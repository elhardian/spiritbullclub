"use client";

import Image from "next/image";
import Link from "next/link";
import { formatAddress, useWallet } from "@/context/WalletContext";

export function Header() {
  const { address, walletLabel, isConnected, isConnecting, openWalletModal, disconnect } =
    useWallet();

  return (
    <header className="relative z-40 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
          <Image
            src="/logo.png"
            alt="Spirit Bull Club"
            width={140}
            height={48}
            className="h-9 w-auto sm:h-10"
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
          <Link href="/bids" className="transition hover:text-white">
            Bids
          </Link>
          <Link href="/collection" className="transition hover:text-white">
            Collection
          </Link>
          <Link href="/#roadmap" className="transition hover:text-white">
            Roadmap
          </Link>
          <Link href="/#stats" className="transition hover:text-white">
            Stats
          </Link>
          <Link href="/#about" className="transition hover:text-white">
            Lore
          </Link>
          <Link href="/your-bid" className="transition hover:text-white">
            My Bids
          </Link>
        </nav>

        {isConnected && address ? (
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white/[0.06] px-3 py-1.5 font-mono text-xs text-white/75">
              <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {walletLabel ? `${walletLabel} · ` : ""}
              {formatAddress(address)}
            </div>
            <button
              type="button"
              onClick={() => disconnect()}
              className="rounded-full px-3 py-1.5 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={openWalletModal}
            disabled={isConnecting}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-60"
          >
            {isConnecting ? "Connecting…" : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}
