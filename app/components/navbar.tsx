"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/recordacoes", label: "Recordações" },
  { href: "/lista", label: "Lista" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  function linkClasses(href: string) {
    const ativo = pathname === href;
    return `webcore-button block text-center px-4 py-2 text-sm ${ativo ? "bg-black text-white" : ""}`;
  }

  return (
    <nav className="webcore-window w-full mb-6">
      <div className="webcore-titlebar relative flex items-center justify-center">
        <span>menu.exe</span>
        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 text-sm leading-none px-1"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
        >
          {aberto ? "✕" : "☰"}
        </button>
      </div>

      {/* Telas médias/grandes: sempre visível */}
      <ul className="hidden sm:flex flex-wrap items-center justify-center gap-2 p-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={linkClasses(item.href)}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Celular: só aparece com o menu aberto */}
      {aberto && (
        <ul className="sm:hidden flex flex-col gap-2 p-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setAberto(false)}
                className={linkClasses(item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}