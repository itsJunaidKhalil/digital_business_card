import { notFound, redirect } from "next/navigation";
import { getProfile } from "@/lib/getProfile";
import { getSocialLinks } from "@/lib/getSocialLinks";
import ProfilePageContent from "@/components/ProfilePage";

// Disable caching for this page to ensure fresh data
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  try {
    let profile = await getProfile(params.username);
    
    // If profile not found, check for username redirect
    if (!profile) {
      const { createServerClient } = await import("@/lib/supabase-server");
      const supabase = createServerClient();
      
      const { data: redirect } = await supabase
        .from("username_redirects")
        .select("new_username")
        .eq("old_username", params.username)
        .single();
      
      if (redirect?.new_username) {
        // Redirect to new username (301 permanent redirect)
        redirect(`/${redirect.new_username}`);
      }
      
      notFound();
    }

    // Fetch social links for this profile
    const links = await getSocialLinks(profile.id);
    
    // Log for debugging (remove in production)
    console.log(`Profile ${profile.username} has ${links.length} social links`);

    return <ProfilePageContent profile={profile} links={links} />;
  } catch (error) {
    console.error("Error loading profile:", error);
    notFound();
  }
}
