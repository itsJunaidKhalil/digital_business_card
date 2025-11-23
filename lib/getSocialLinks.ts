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
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", userId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching social links:", error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exception fetching social links:", error);
    return [];
  }
}
