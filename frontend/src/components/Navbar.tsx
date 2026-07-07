"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Resume" },
    { href: "/projects/", label: "Projects" },
    { href: "/experience/", label: "Experience" },
    { href: "/skills/", label: "Skills" },
    { href: "/how-it-works/", label: "How It Works" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-xl border-b border-hairline">

        {/* ── Desktop (lg+) ── */}
        <div className="hidden lg:flex max-w-screen-xl mx-auto px-5 h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-semibold text-[15px] tracking-display text-ink">
              Jackie Jin
            </span>
            <div className="flex gap-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-surface-2 text-ink"
                      : "text-ink-subtle hover:text-ink hover:bg-surface-1"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-on-primary bg-primary hover:bg-primary-hover rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Resume
          </a>
        </div>

        {/* ── Mobile (< lg): logo + hamburger only ── */}
        <div className="lg:hidden flex items-center justify-between px-4 h-12">
          <span className="font-semibold text-[15px] tracking-display text-ink">
            Jackie Jin
          </span>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-1 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex flex-col" onClick={() => setMenuOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" />

          {/* Menu panel — slides down from top */}
          <div
            className="relative mt-12 mx-3 bg-surface-1 border border-hairline-strong rounded-xl shadow-2xl shadow-ink/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-surface-2 text-ink"
                      : "text-ink-subtle hover:text-ink hover:bg-surface-2"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="px-3 pb-3">
              <a
                href="/resume.pdf"
                download="Jackie_Jin_Resume.pdf"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-on-primary bg-primary hover:bg-primary-hover rounded-md transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
