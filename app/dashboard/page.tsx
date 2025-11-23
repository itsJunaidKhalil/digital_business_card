"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getProfileById } from "@/lib/getProfile";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const profileUrl = `${baseUrl}/${profile.username}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const profileUrl = profile?.username
    ? `${baseUrl}/${profile.username}`
    : "Complete your profile to get a public URL";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Link
            href="/dashboard/profile"
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-3xl mb-2">👤</div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Profile</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Update your profile information, photos, and contact details
            </p>
          </Link>

          <Link
            href="/dashboard/social"
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-3xl mb-2">🔗</div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Social Links</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Add and manage your social media links
            </p>
          </Link>

          <Link
            href="/dashboard/appearance"
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-3xl mb-2">🎨</div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Appearance</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Customize your profile theme and styling
            </p>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-3xl mb-2">📊</div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              View your profile views and link clicks
            </p>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Your Public Profile</h2>
          {profile?.username ? (
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Share this URL:</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <Link
                href={`/${profile.username}`}
                target="_blank"
                className="inline-block text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base"
              >
                View your profile →
              </Link>
            </div>
          ) : (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Complete your profile to get a public URL.{" "}
              <Link href="/dashboard/profile" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Get started →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
