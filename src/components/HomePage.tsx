"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BidGuide } from "@/components/BidGuide";
import { BidModal } from "@/components/BidModal";
import { Carousel3D } from "@/components/Carousel3D";
import { ContractAddress } from "@/components/ContractAddress";
import { Header } from "@/components/Header";
import { Roadmap } from "@/components/Roadmap";
import { useWallet } from "@/context/WalletContext";
import { COLLECTION_STATS, HIDDEN_SOL, SEAT_FEE_SOL } from "@/data/collection";
import type { SpiritBull } from "@/data/collection";

export function HomePage() {
  const { nfts, openWalletModal, isConnected, isConnecting } = useWallet();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<SpiritBull | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const active = nfts[activeIndex];
  const remaining = COLLECTION_STATS.totalSupply - COLLECTION_STATS.released;

  function openNft(nft: SpiritBull) {
    setSelected(nft);
    setModalOpen(true);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <BackgroundFX />
      <Header />

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pt-10 pb-4 text-center sm:px-6 sm:pt-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1 font-mono text-[10px] tracking-[0.3em] text-white/55 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
            Limited · 777 · 7 / Week
          </div>
          <Image
            src="/logo.png"
            alt="Spirit Bull Club"
            width={320}
            height={110}
            className="mx-auto h-16 w-auto sm:h-20 md:h-24"
            priority
          />
          <h1 className="sr-only">Spirit Bull Club</h1>
          <ContractAddress />
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            A tightly capped Solana herd of 777. Seven bulls drop every week.
            #0002 Trencher airdrops to holders.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!isConnected && (
              <button
                type="button"
                onClick={openWalletModal}
                disabled={isConnecting}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
              >
                {isConnecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}
            <Link
              href="/collection"
              className="rounded-full bg-white/[0.08] px-6 py-3 text-sm text-white/80 transition hover:bg-white/[0.14]"
            >
              Explore Collection
            </Link>
          </div>
        </section>

        <section id="collection" className="px-2 py-8 sm:px-4 sm:py-12">
          <div className="mx-auto mb-2 max-w-7xl px-4 text-center sm:px-6">
            <p className="font-mono text-xs tracking-[0.35em] text-white/35 uppercase">
              Living Showcase · SOL
            </p>
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
              {active?.name ?? "Loading…"}
            </h2>
            <p className="mt-1 text-sm text-white/40">
              Drag left or right - active bull holds the center frame
            </p>
          </div>

          <Carousel3D
            items={nfts}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
            onSelect={openNft}
          />

          {active && (
            <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-3 px-4">
              <button
                type="button"
                onClick={() => openNft(active)}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                {active.reserved
                  ? "View Genesis Bull"
                  : active.airdropped
                    ? "View Trencher"
                    : `Bid on ${active.name}`}
              </button>
            </div>
          )}
        </section>

        <BidGuide />

        <section id="stats" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Max supply" value={COLLECTION_STATS.totalSupply.toLocaleString()} />
            <StatCard label="Released" value={`${COLLECTION_STATS.released} / ${COLLECTION_STATS.totalSupply}`} />
            <StatCard label="Weekly drop" value={`${COLLECTION_STATS.weeklyDrop} bulls`} />
            <StatCard label="Remaining" value={remaining.toLocaleString()} />
          </div>
          <p className="mt-4 text-center font-mono text-[11px] tracking-wide text-white/35">
            Floor {HIDDEN_SOL} · Volume {HIDDEN_SOL} · {COLLECTION_STATS.owners} owners
          </p>
        </section>

        <Roadmap />

        <section id="about" className="mx-auto max-w-4xl px-4 py-12 pb-24 text-center sm:px-6">
          <div className="rounded-3xl bg-white/[0.04] p-8 md:p-12">
            <p className="font-mono text-xs tracking-[0.3em] text-white/35 uppercase">
              Club Lore
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Born of chaos. Bound by Solana.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/50">
              Spirit Bull Club is a limited Solana collection of 777 bulls never more. Seven bulls release
              every week. Book a seat for {SEAT_FEE_SOL} SOL and place your bid offer to win the price
              charged later. Genesis Bull #0001 belongs to <a
                href="https://twitter.com/blknoiz06"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline decoration-white/20 hover:decoration-white/40"
              >
                Ansem (@blknoiz06)
              </a>.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-6 text-center font-mono text-xs text-white/30">
        © {new Date().getFullYear()} Spirit Bull Club · 777 Limited · Weekly Drops · Solana
      </footer>

      <BidModal nft={selected} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] px-4 py-5 text-center">
      <p className="font-mono text-[10px] tracking-[0.25em] text-white/35 uppercase">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">{value}</p>
    </div>
  );
}

function BackgroundFX() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute -top-40 left-1/2 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[120px]" />
      <div className="absolute top-1/3 -left-24 h-[300px] w-[300px] rounded-full bg-white/[0.02] blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 15%, transparent 70%)",
        }}
      />
      <div className="scanlines absolute inset-0 opacity-[0.02]" />
    </div>
  );
}
