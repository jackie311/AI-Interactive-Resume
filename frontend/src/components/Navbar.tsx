"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { href: "/", label: "Resume" },
    { href: "/projects", label: "Projects" },
    { href: "/stats", label: "Stats" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-sm text-gray-900 dark:text-white">Jackie Jin</span>
          <div className="flex gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  pathname === href
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/resume/download"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Resume PDF
          </a>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
