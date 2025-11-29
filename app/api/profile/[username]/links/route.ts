import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/getProfile";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
    const profile = await getProfile(username);
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Log for debugging - verify we're getting the correct profile
    console.log(`[API] Fetching links for username: ${username}, profile.id: ${profile.id}`);
    
    // Query directly with service role key or anon key to ensure we get fresh data
    // Public profiles should be viewable by anyone, so we use anon key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!
    );
    
    // Query social_links directly with explicit filtering
    const { data: links, error: linksError } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", profile.id) // Explicitly filter by user_id
      .order("order_index", { ascending: true });
    
    if (linksError) {
      console.error(`[API] Error fetching links for profile.id: ${profile.id}`, linksError);
      return NextResponse.json({ links: [], error: null }); // Return empty array instead of error
    }
    
    // Log for debugging - verify we're getting the correct links
    console.log(`[API] Found ${links?.length || 0} links for profile.id: ${profile.id}`);
    if (links && links.length > 0) {
      console.log(`[API] First link user_id: ${links[0].user_id}, expected: ${profile.id}`);
      // Verify all links belong to this user
      const allMatch = links.every(link => link.user_id === profile.id);
      if (!allMatch) {
        console.error(`[API] WARNING: Some links have mismatched user_id! Expected: ${profile.id}`);
      }
    }

    // Set cache control headers to prevent caching
    const response = NextResponse.json({ links: links || [], error: null });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    return response;
  } catch (error: any) {
    console.error("[API] Error fetching profile links:", error);
    return NextResponse.json(
      { links: [], error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

