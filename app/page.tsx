import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Your Digital Business Card
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Create a beautiful profile, share your links, and connect with NFC
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-lg font-semibold"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Customizable Profile</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add your photo, banner, and personal information to create a unique
              profile
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Social Links</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Share all your social media profiles and websites in one place
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">NFC Integration</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect NFC keychains to instantly share your profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

