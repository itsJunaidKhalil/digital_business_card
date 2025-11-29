import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/getProfile";
import { getSocialLinks } from "@/lib/getSocialLinks";

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
    
    const links = await getSocialLinks(profile.id);
    
    // Log for debugging - verify we're getting the correct links
    console.log(`[API] Found ${links.length} links for profile.id: ${profile.id}`);
    if (links.length > 0) {
      console.log(`[API] First link user_id: ${links[0].user_id}, expected: ${profile.id}`);
    }

    // Set cache control headers to prevent caching
    const response = NextResponse.json({ links, error: null });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error("Error fetching profile links:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

