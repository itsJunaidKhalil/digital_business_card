import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if profile exists, if not create one
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingProfile) {
          // Create profile for OAuth users
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
          });
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const redirectUrl = new URL(next, `${protocol}://${forwardedHost || requestUrl.host}`);

      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  // Return the user to an error page with instructions
  const errorUrl = new URL("/auth/login", requestUrl.origin);
  errorUrl.searchParams.set("error", "Could not authenticate user");
  return NextResponse.redirect(errorUrl.toString());
}

