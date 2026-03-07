import React from "react";
import Image from "next/image";
import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}: AuthShellProps) {
  return (
    <main className="h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-16 bg-white">
        {/* Logo */}
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <Image
              src="/treklylogo.png"
              alt="Trekly"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-green-700">Trekly</span>
          </Link>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 text-base mb-8">{subtitle}</p>
          )}

          {/* Form */}
          {children}

          {/* Footer */}
          {footerText && footerLink && (
            <p className="text-center text-sm text-gray-400 mt-8">
              {footerText}{" "}
              <Link
                href={footerLink}
                className="text-green-700 font-semibold hover:underline"
              >
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Right Side - Full height image */}
      <div className="hidden lg:block w-[55%] relative">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400"
          alt="Mountains"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-black/50" />

        {/* Content on image */}
        <div className="absolute inset-0 flex flex-col justify-between p-14">
          {/* Top badge */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm w-fit px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">
              Nepal's #1 Trekking Platform
            </span>
          </div>

          {/* Bottom content */}
          <div>
            <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              Your Next<br />
              <span className="text-green-400">Adventure</span><br />
              Awaits
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-sm">
              Explore breathtaking trails, expert guides, and unforgettable experiences in the Himalayas.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-3xl font-extrabold text-white">500+</p>
                <p className="text-green-300 text-sm mt-1">Happy Trekkers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-3xl font-extrabold text-white">12+</p>
                <p className="text-green-300 text-sm mt-1">Trek Routes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-3xl font-extrabold text-white">100%</p>
                <p className="text-green-300 text-sm mt-1">Safe & Guided</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}