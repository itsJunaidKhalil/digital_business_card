import { notFound, redirect } from "next/navigation";
import { getProfile } from "@/lib/getProfile";
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
      
      const { data: redirectData } = await supabase
        .from("username_redirects")
        .select("new_username")
        .eq("old_username", params.username)
        .single();
      
      if (redirectData?.new_username) {
        // Redirect to new username (301 permanent redirect)
        redirect(`/${redirectData.new_username}`);
      }
      
      notFound();
    }

    return <ProfilePageContent profile={profile} />;
  } catch (error) {
    console.error("Error loading profile:", error);
    notFound();
  }
}
