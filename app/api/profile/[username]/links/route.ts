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

    const links = await getSocialLinks(profile.id);

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

