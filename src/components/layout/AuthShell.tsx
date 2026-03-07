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
    <main className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Image src="/treklylogo.png" alt="Trekly" width={45} height={45} className="object-contain" />
          <span className="text-2xl font-bold text-green-700">Trekly</span>
        </Link>

        {/* Card */}
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-500 mb-8">{subtitle}</p>}
          {children}

          {footerText && footerLink && (
            <p className="text-center text-sm text-gray-500 mt-6">
              {footerText}{" "}
              <Link href={footerLink} className="text-green-700 font-semibold hover:underline">
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"
          alt="Mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-900/60 flex flex-col justify-end p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Discover Nepal's<br />Hidden Treasures
          </h2>
          <p className="text-green-100 text-lg max-w-md">
            Join thousands of trekkers exploring the most beautiful mountains in the world.
          </p>
          <div className="flex gap-6 mt-8">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-green-200 text-sm">Happy Trekkers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">12+</p>
              <p className="text-green-200 text-sm">Trek Routes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-green-200 text-sm">Safe & Guided</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}