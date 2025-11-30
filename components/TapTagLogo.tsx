"use client";

import Link from "next/link";

interface TapTagLogoProps {
  variant?: "default" | "icon-only" | "text-only";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export default function TapTagLogo({ 
  variant = "default", 
  size = "md",
  href,
  className = ""
}: TapTagLogoProps) {
  const sizeClasses = {
    sm: { icon: "w-6 h-6", text: "text-lg", gap: "gap-1.5" },
    md: { icon: "w-8 h-8", text: "text-xl", gap: "gap-2" },
    lg: { icon: "w-12 h-12", text: "text-3xl", gap: "gap-3" },
  };

  const currentSize = sizeClasses[size];

  const LogoContent = () => (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {/* Icon - Modern tap/tag design */}
      {(variant === "default" || variant === "icon-only") && (
        <div className={`${currentSize.icon} relative group`}>
          {/* Main tap icon with gradient */}
          <div className="absolute inset-0 bg-gradient-primary rounded-xl shadow-glow transform rotate-12 group-hover:rotate-0 transition-all duration-300 group-hover:scale-110">
            {/* Tap/Tag symbol */}
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-full h-full p-1.5 text-white"
            >
              {/* Tag shape */}
              <path
                d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(255, 255, 255, 0.15)"
              />
              {/* Tap/NFC indicator - wave effect */}
              <circle
                cx="7"
                cy="7"
                r="2"
                fill="currentColor"
                className="animate-pulse"
              />
              {/* Signal waves */}
              <circle
                cx="7"
                cy="7"
                r="3.5"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
                className="animate-ping"
              />
            </svg>
          </div>
          {/* Secondary accent circle */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-secondary rounded-full shadow-soft opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
        </div>
      )}

      {/* Text */}
      {(variant === "default" || variant === "text-only") && (
        <span className={`font-heading font-bold ${currentSize.text} gradient-text`}>
          TapTag
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-block">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}

