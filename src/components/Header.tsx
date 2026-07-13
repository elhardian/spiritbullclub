"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SOCIAL_LINKS, SocialIcon } from "@/components/SocialLinks";
import { formatAddress, useWallet } from "@/context/WalletContext";

const NAV_LINKS = [
  { href: "/bids", label: "Bids" },
  { href: "/collection", label: "Collection" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/#stats", label: "Stats" },
  { href: "/#about", label: "Lore" },
  { href: "/your-bid", label: "My Bids" },
] as const;

export function Header() {
  const { address, walletLabel, isConnected, isConnecting, openWalletModal, disconnect } =
    useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 transition hover:opacity-90">
          <Image
            src="/logo.png"
            alt="Spirit Bull Club"
            width={140}
            height={48}
            className="h-9 w-auto shrink-0 sm:h-10"
            priority
          />
          <div className="hidden sm:block">
            <p className="font-semibold tracking-wide text-white">Spirit Bull Club</p>
            <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
              777 · Weekly
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/45 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition hover:bg-white/[0.12] hover:text-white"
              >
                <SocialIcon name={link.label} />
              </a>
            ))}
          </div>
          {isConnected && address ? (
            <>
              <div className="hidden rounded-full bg-white/[0.06] px-3 py-1.5 font-mono text-xs text-white/75 sm:block">
                <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {walletLabel ? `${walletLabel} · ` : ""}
                {formatAddress(address)}
              </div>
              <div className="rounded-full bg-white/[0.06] px-2.5 py-1.5 font-mono text-xs text-white/75 sm:hidden">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {formatAddress(address)}
              </div>
              <button
                type="button"
                onClick={() => disconnect()}
                className="hidden rounded-full px-3 py-1.5 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white sm:inline"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={openWalletModal}
              disabled={isConnecting}
              className="rounded-full bg-white px-3 py-2 text-xs font-medium text-black transition hover:bg-white/90 disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              {isConnecting ? "Connecting…" : "Connect"}
            </button>
          )}

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/70 transition hover:bg-white/[0.1] hover:text-white md:hidden"
          >
            {menuOpen ? (
              <span className="text-lg leading-none">✕</span>
            ) : (
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      {mounted &&
        menuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] md:hidden">
            <button
              type="button"
              aria-label="Close menu backdrop"
              className="absolute inset-0 bg-black/90"
              onClick={closeMenu}
            />
            <nav className="absolute top-0 right-0 z-10 flex h-full w-[min(100%,18rem)] flex-col border-l border-white/10 bg-black p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
                <p className="font-mono text-[10px] tracking-[0.25em] text-white/50 uppercase">Menu</p>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="rounded-full bg-white/[0.08] px-2.5 py-1 text-white/70 transition hover:bg-white/[0.12] hover:text-white"
                >
                  ✕
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="block rounded-xl bg-white/[0.04] px-3 py-3 text-base font-medium text-white transition hover:bg-white/[0.1]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-2">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    onClick={closeMenu}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/[0.04] px-3 py-3 text-sm font-medium text-white transition hover:bg-white/[0.1]"
                  >
                    <SocialIcon name={link.label} />
                    {link.label}
                  </a>
                ))}
              </div>
              {isConnected && address && (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    disconnect();
                  }}
                  className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-left text-sm text-white/70 transition hover:bg-white/[0.1] hover:text-white"
                >
                  Disconnect wallet
                </button>
              )}
            </nav>
          </div>,
          document.body,
        )}
    </header>
  );
}
