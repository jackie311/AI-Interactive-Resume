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
    // { href: "/jobs/", label: "Jobs" },
    // { href: "/jd-analyzer/", label: "JD Analyzer" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/70#09090f]/80 backdrop-blur-xl border-b border-black/[0.06]">
      <div className="max-w-screen-xl mx-auto px-5 h-14 flex items-center justify-between">
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

        <div className="flex items-center">
          <a
            href="/resume.pdf"
            download="Jackie_Jin_Resume.pdf"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg transition-all shadow-lg shadow-violet-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            Download Resume
          </a>
        </div>
      </div>
    </nav>
  );
}
