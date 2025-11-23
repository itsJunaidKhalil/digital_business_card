import { notFound } from "next/navigation";
import { getProfile } from "@/lib/getProfile";
import { getSocialLinks } from "@/lib/getSocialLinks";
import ProfilePageContent from "@/components/ProfilePage";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  try {
    const profile = await getProfile(params.username);
    
    if (!profile) {
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
