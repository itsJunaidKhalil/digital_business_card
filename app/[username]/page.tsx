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
    // Check for redirect chain and get final username
    const { createServerClient } = await import("@/lib/supabase-server");
    const supabase = createServerClient();
    
    let currentUsername = params.username;
    const visitedUsernames = new Set<string>();
    let redirectChain: string[] = [params.username];
    
    // Follow redirect chain to find final username
    for (let i = 0; i < 10; i++) {
      if (visitedUsernames.has(currentUsername)) {
        break; // Circular redirect detected
      }
      visitedUsernames.add(currentUsername);
      
      const { data: redirectData } = await supabase
        .from("username_redirects")
        .select("new_username")
        .eq("old_username", currentUsername)
        .single();
      
      if (!redirectData?.new_username) {
        break; // No more redirects
      }
      
      currentUsername = redirectData.new_username;
      redirectChain.push(currentUsername);
    }
    
    // If we found a redirect chain, do HTTP 301 redirect for SEO
    if (redirectChain.length > 1 && currentUsername !== params.username) {
      redirect(`/${currentUsername}`);
    }
    
    // Fetch profile with final username
    let profile = await getProfile(currentUsername);
    
    if (!profile) {
      notFound();
    }

    return <ProfilePageContent profile={profile} />;
  } catch (error) {
    console.error("Error loading profile:", error);
    notFound();
  }
}
