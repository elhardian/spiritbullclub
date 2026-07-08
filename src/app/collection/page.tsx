"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BidModal } from "@/components/BidModal";
import { BidGuide } from "@/components/BidGuide";
import { Header } from "@/components/Header";
import { useWallet } from "@/context/WalletContext";
import { COLLECTION_STATS, HIDDEN_SOL } from "@/data/collection";
import type { SpiritBull } from "@/data/collection";
import {
  collectionCategory,
  highestBidLabel,
  isReservable,
  matchesCollectionSearch,
  type CollectionCategory,
} from "@/lib/collection-utils";

const FILTER_OPTIONS: { value: CollectionCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "reservable", label: "Reservable" },
  { value: "reserved", label: "Reserved" },
  { value: "airdrop", label: "Holder airdrop" },
];

export default function CollectionPage() {
  const { nfts } = useWallet();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CollectionCategory>("all");
  const [selected, setSelected] = useState<SpiritBull | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return nfts.filter((nft) => {
      if (category !== "all" && collectionCategory(nft) !== category) return false;
      return matchesCollectionSearch(nft, search);
    });
  }, [nfts, search, category]);

  function openNft(nft: SpiritBull) {
    setSelected(nft);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-[0.35em] text-white/35 uppercase">Herd</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Full Collection</h1>
          <p className="mt-2 text-white/50">
            {COLLECTION_STATS.released} released · {COLLECTION_STATS.totalSupply} max supply · floor{" "}
            {HIDDEN_SOL}
          </p>
        </div>

        <BidGuide variant="compact" className="mb-8" />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
              Search
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, token #, traits…"
              className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:bg-white/[0.09]"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategory(opt.value)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  category === opt.value
                    ? "bg-white text-black"
                    : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-6 font-mono text-xs text-white/40">
          Showing {filtered.length} of {nfts.length}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.04] px-6 py-12 text-center">
            <p className="text-white/50">No bulls match your filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="mt-4 text-sm text-white underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((nft) => (
              <li key={nft.id}>
                <CollectionCard nft={nft} onSelect={() => openNft(nft)} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-white/60 underline hover:text-white">
            ← Back to showcase
          </Link>
        </div>
      </main>

      <BidModal nft={selected} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function CollectionCard({ nft, onSelect }: { nft: SpiritBull; onSelect: () => void }) {
  const actionLabel = nft.reserved
    ? "Genesis"
    : nft.airdropped
      ? "Airdrop"
      : isReservable(nft)
        ? "Bid"
        : "View";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full overflow-hidden rounded-2xl bg-white/[0.04] text-left transition hover:bg-white/[0.07]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black">
        <Image
          src={nft.image}
          alt={nft.name}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/70">
          #{String(nft.id).padStart(4, "0")}
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-white">{nft.name}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-xs text-white/50">{highestBidLabel(nft)}</span>
          <span className="shrink-0 rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] tracking-wide text-white/60 uppercase">
            {actionLabel}
          </span>
        </div>
      </div>
    </button>
  );
}
