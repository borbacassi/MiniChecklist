"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/ ", label: "Home" },
  { href: "/recordacoes", label: "Recordações" },
  { href: "/lista", label: "Lista" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="webcore-window w-full mb-6">
      <div className="webcore-titlebar">menu.exe</div>
      <ul className="flex flex-wrap items-center justify-center gap-2 p-2">
        {NAV_ITEMS.map((item) => {
          const ativo = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`webcore-button inline-block px-4 py-2 text-sm ${
                  ativo ? "bg-black text-white" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}