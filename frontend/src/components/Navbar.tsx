"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Resume" },
    { href: "/projects/", label: "Projects" },
    { href: "/experience/", label: "Experience" },
    { href: "/skills/", label: "Skills" },
    { href: "/how-it-works/", label: "How It Works" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-black/[0.06]">

      {/* ── Desktop layout (lg+) ── */}
      <div className="hidden lg:flex max-w-screen-xl mx-auto px-5 h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-bold text-base gradient-text">Jackie Jin</span>
          <div className="flex gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === href
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-black/[0.04]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <a
          href="/resume.pdf"
          download="Jackie_Jin_Resume.pdf"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg transition-all shadow-lg shadow-violet-500/20"
        >
          <Download className="w-3.5 h-3.5" />
          Download Resume
        </a>
      </div>

      {/* ── Mobile layout (< lg) ── */}
      <div className="lg:hidden">
        {/* Top row: logo + download */}
        <div className="flex items-center justify-between px-4 h-11">
          <span className="font-bold text-base gradient-text">Jackie Jin</span>
          <a
            href="/resume.pdf"
            download="Jackie_Jin_Resume.pdf"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg shadow-md shadow-violet-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            CV
          </a>
        </div>

        {/* Links row: horizontally scrollable, active underline style */}
        <div className="flex overflow-x-auto scrollbar-none px-3 pb-0">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative shrink-0 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === href
                  ? "text-violet-600"
                  : "text-gray-500"
              }`}
            >
              {label}
              {pathname === href && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-violet-600 rounded-t-full" />
              )}
            </Link>
          ))}
        </div>
      </div>

    </nav>
  );
}
