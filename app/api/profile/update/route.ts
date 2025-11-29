import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    // Get auth token from header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authHeader.replace("Bearer ", "");
    
    // Create a client to verify the user (using anon key)
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!
    );
    
    // Verify the user and get their ID
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) {
      console.error("Auth verification failed:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Ensure user can only update their own profile
    if (user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    // Use service role key for database operations (bypasses RLS but we've verified auth)
    // If service role key is not available, use anon key with proper session
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      serviceRoleKey ? {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      } : {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // First, check if profile exists and get current username
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("id", id)
      .single();

    let data;
    let error;

    if (existingProfile) {
      // Check if username is being changed
      const oldUsername = existingProfile.username;
      const newUsername = updateData.username;
      
      // Profile exists, update it
      const result = await supabase
        .from("profiles")
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
      
      // If username changed, create a redirect entry
      if (!error && oldUsername && newUsername && oldUsername !== newUsername) {
        // Check if username_redirects table exists, if not we'll create it via SQL
        // For now, we'll store it in a simple table
        try {
          await supabase.from("username_redirects").upsert({
            old_username: oldUsername,
            new_username: newUsername,
            user_id: id,
            created_at: new Date().toISOString(),
          }, {
            onConflict: "old_username"
          });
        } catch (redirectError) {
          // Table might not exist yet, log but don't fail
          console.warn("Could not create username redirect:", redirectError);
        }
      }
    } else {
      // Profile doesn't exist, create it
      const result = await supabase
        .from("profiles")
        .insert({
          id,
          ...updateData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
    }

    return NextResponse.json({ data, error: null });
  } catch (error: any) {
    console.error("Profile update exception:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

