import { createClient } from "@supabase/supabase-js";

// Create a server-side client for these functions
const getSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );
};

export async function getProfile(username: string) {
  const supabase = getSupabaseClient();
  
  // Follow redirect chain until we find the final username
  let currentUsername = username;
  const visitedUsernames = new Set<string>(); // Prevent infinite loops
  let redirectChain: string[] = [username];
  
  // Follow redirect chain (max 10 redirects to prevent infinite loops)
  for (let i = 0; i < 10; i++) {
    if (visitedUsernames.has(currentUsername)) {
      console.error(`[getProfile] Circular redirect detected for username: ${username}, chain: ${redirectChain.join(' → ')}`);
      break;
    }
    visitedUsernames.add(currentUsername);
    
    const { data: redirectData } = await supabase
      .from("username_redirects")
      .select("new_username")
      .eq("old_username", currentUsername)
      .single();
    
    if (!redirectData?.new_username) {
      // No more redirects, this is the final username
      break;
    }
    
    currentUsername = redirectData.new_username;
    redirectChain.push(currentUsername);
  }
  
  // Log redirect chain for debugging
  if (redirectChain.length > 1) {
    console.log(`[getProfile] Username redirect chain: ${redirectChain.join(' → ')}`);
  }
  
  // Fetch profile with final username
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", currentUsername)
    .single();

  if (error) {
    // Log for debugging
    console.error(`[getProfile] Error fetching profile for username: ${username}, finalUsername: ${currentUsername}`, error);
    throw error;
  }

  return data;
}

export async function getProfileById(id: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
