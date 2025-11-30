import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-bg via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass p-8 rounded-3xl shadow-soft-lg">
          <h1 className="text-4xl font-heading font-bold mb-6 gradient-text">Privacy Policy</h1>
          <div className="prose prose-gray dark:prose-invert max-w-none" style={{ color: 'var(--text)' }}>
            <p className="text-lg mb-4">
              Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="mb-4">
              This is a placeholder privacy policy. Please update this with your actual privacy policy content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

