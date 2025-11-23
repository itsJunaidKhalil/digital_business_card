"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getProfileById } from "@/lib/getProfile";
import { themes, ThemeName } from "@/utils/themes";
import Navbar from "@/components/Navbar";

export default function AppearancePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
      loadProfile(user.id);
    });
  }, [router]);

  const loadProfile = async (userId: string) => {
    try {
      const profileData = await getProfileById(userId);
      setProfile(profileData);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (theme: ThemeName) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setError("You must be logged in to change themes. Please refresh the page.");
        setSaving(false);
        return;
      }

      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: user.id, theme }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to update theme");
      }

      setProfile({ ...profile, theme });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error updating theme:", error);
      setError(error.message || "Error updating theme. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentTheme = (profile?.theme as ThemeName) || "default";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Appearance</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Choose a theme for your public profile
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              Theme updated successfully!
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Choose Theme</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(themes) as ThemeName[]).map((themeName) => {
              const theme = themes[themeName];
              const isSelected = currentTheme === themeName;

              return (
                <button
                  key={themeName}
                  onClick={() => handleThemeChange(themeName)}
                  disabled={saving}
                  className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-lg ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-lg capitalize text-gray-900 dark:text-white">
                      {themeName}
                    </span>
                    {isSelected && (
                      <span className="text-blue-600 dark:text-blue-400 text-xl">✓</span>
                    )}
                  </div>
                  <div
                    className="h-24 rounded-lg flex items-center justify-center shadow-inner"
                    style={{
                      backgroundColor: theme.bg,
                      color: theme.text,
                    }}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Preview</div>
                      <div className="text-xs opacity-75">Sample text</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {profile?.username && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              💡 Preview your theme by visiting{" "}
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-blue-700 dark:hover:text-blue-300"
              >
                your public profile
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
