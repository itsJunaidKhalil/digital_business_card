import { createClient } from "@supabase/supabase-js";

// Create a server-side client for these functions
const getSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );
};

export async function getSocialLinks(userId: string) {
  const supabase = getSupabaseClient();
  
  try {
    // Log for debugging
    console.log(`[getSocialLinks] Fetching links for user_id: ${userId}`);
    
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", userId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("[getSocialLinks] Error fetching social links:", error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }

    // Log for debugging - verify the filter worked
    if (data && data.length > 0) {
      const allMatch = data.every(link => link.user_id === userId);
      if (!allMatch) {
        console.error(`[getSocialLinks] WARNING: Found links with mismatched user_id! Expected: ${userId}, Got:`, data.map(l => l.user_id));
      }
    }

    return data || [];
  } catch (error) {
    console.error("[getSocialLinks] Exception fetching social links:", error);
    return [];
  }
}
