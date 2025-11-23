"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    mobileViews: 0,
    desktopViews: 0,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
      loadAnalytics(user.id);
    });
  }, [router]);

  const loadAnalytics = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("profile_id", userId)
        .order("timestamp", { ascending: false })
        .limit(100);

      if (error) throw error;

      setAnalytics(data || []);

      // Calculate stats
      const views = data?.filter((a) => a.event_type === "profile_view") || [];
      const clicks = data?.filter((a) => a.event_type === "link_click") || [];
      const mobile = data?.filter((a) => a.platform === "mobile") || [];
      const desktop = data?.filter((a) => a.platform === "desktop") || [];

      setStats({
        totalViews: views.length,
        totalClicks: clicks.length,
        mobileViews: mobile.length,
        desktopViews: desktop.length,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Analytics</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total Views
            </h3>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalViews}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Link Clicks
            </h3>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalClicks}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Mobile Views
            </h3>
            <p className="text-2xl sm:text-3xl font-bold">{stats.mobileViews}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Desktop Views
            </h3>
            <p className="text-2xl sm:text-3xl font-bold">{stats.desktopViews}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Activity</h2>
          {analytics.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No analytics data yet. Share your profile to start tracking!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 sm:px-4 font-medium">Event</th>
                    <th className="text-left py-2 px-2 sm:px-4 font-medium hidden sm:table-cell">Platform</th>
                    <th className="text-left py-2 px-2 sm:px-4 font-medium hidden md:table-cell">Referrer</th>
                    <th className="text-left py-2 px-2 sm:px-4 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-2 sm:px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs sm:text-sm ${
                            item.event_type === "profile_view"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {item.event_type === "profile_view" ? "View" : "Click"}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-4 hidden sm:table-cell">
                        {item.platform || "Unknown"}
                      </td>
                      <td className="py-2 px-2 sm:px-4 hidden md:table-cell text-xs sm:text-sm">
                        {item.referrer || "Direct"}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
