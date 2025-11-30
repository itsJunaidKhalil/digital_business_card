"use client";

import { useState } from "react";
import { themes, ThemeName } from "@/utils/themes";

interface ProfileThemeToggleProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export default function ProfileThemeToggle({ currentTheme, onThemeChange }: ProfileThemeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions: ThemeName[] = ["default", "dark", "blue", "green"];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass p-3 rounded-2xl shadow-soft-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center"
        style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
        aria-label="Change profile theme"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {/* Theme Options Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute bottom-16 right-0 glass rounded-2xl shadow-soft-lg border p-3 min-w-[180px] z-50"
            style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
          >
            <div className="space-y-2">
              <div className="text-xs font-semibold mb-2 px-2" style={{ color: 'var(--text)', opacity: 0.7 }}>
                Profile Theme
              </div>
              {themeOptions.map((themeName) => {
                const theme = themes[themeName];
                const isSelected = currentTheme === themeName;
                
                return (
                  <button
                    key={themeName}
                    onClick={() => {
                      onThemeChange(themeName);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                      isSelected ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex-shrink-0 border-2"
                      style={{
                        backgroundColor: theme.bg,
                        borderColor: isSelected ? 'var(--text)' : 'transparent',
                      }}
                    />
                    <span className="text-sm font-medium capitalize flex-1 text-left" style={{ color: 'var(--text)' }}>
                      {themeName}
                    </span>
                    {isSelected && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

