"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { BidGuide } from "@/components/BidGuide";
import { COLLECTION_STATS, HIDDEN_SOL, SEAT_FEE_SOL } from "@/data/collection";
import { formatSol } from "@/lib/collection-utils";
import type { PublicReservation } from "@/types/reservation";

type SortOrder = "newest" | "oldest";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function matchesReservationSearch(r: PublicReservation, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const id = String(r.nftId).padStart(4, "0");
  return (
    r.nftName.toLowerCase().includes(q) ||
    id.includes(q) ||
    String(r.nftId).includes(q) ||
    r.maskedWallet.toLowerCase().includes(q) ||
    r.signature.toLowerCase().includes(q)
  );
}

export default function BidsPage() {
  const [reservations, setReservations] = useState<PublicReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [bullFilter, setBullFilter] = useState("all");
  const [sort, setSort] = useState<SortOrder>("newest");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reservations")
      .then((res) => res.json())
      .then((data: { reservations?: PublicReservation[] }) => {
        if (!cancelled) setReservations(data.reservations ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load reservations.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const bullOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const r of reservations) {
      if (!map.has(r.nftId)) map.set(r.nftId, r.nftName);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [reservations]);

  const filtered = useMemo(() => {
    let list = reservations.filter((r) => matchesReservationSearch(r, search));
    if (bullFilter !== "all") {
      list = list.filter((r) => String(r.nftId) === bullFilter);
    }
    return [...list].sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sort === "newest" ? tb - ta : ta - tb;
    });
  }, [reservations, search, bullFilter, sort]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-[0.35em] text-white/35 uppercase">Ledger</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">All Reservations</h1>
          <p className="mt-2 text-white/50">
            Bids across the herd · {SEAT_FEE_SOL} SOL seat fee · max supply{" "}
            {COLLECTION_STATS.totalSupply}
          </p>
        </div>

        <BidGuide variant="compact" className="mb-8" />

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Max supply" value={String(COLLECTION_STATS.totalSupply)} />
          <Stat label="Released" value={`${COLLECTION_STATS.released}`} />
          <Stat label="Reservations" value={String(reservations.length)} />
          <Stat label="Seat fee" value={`${SEAT_FEE_SOL} SOL`} />
        </div>

        {!loading && reservations.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                Search
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Bull, token #, wallet, tx…"
                className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:bg-white/[0.09]"
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:w-48">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                Bull
              </span>
              <select
                value={bullFilter}
                onChange={(e) => setBullFilter(e.target.value)}
                className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm text-white outline-none focus:bg-white/[0.09]"
              >
                <option value="all">All bulls</option>
                {bullOptions.map(([id, name]) => (
                  <option key={id} value={String(id)}>
                    #{String(id).padStart(4, "0")} - {name.replace(/^Spirit Bull #\d+ - /, "")}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 sm:w-40">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
                className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm text-white outline-none focus:bg-white/[0.09]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>
        )}

        {!loading && reservations.length > 0 && (
          <p className="mb-4 font-mono text-xs text-white/40">
            Showing {filtered.length} of {reservations.length}
          </p>
        )}

        {loading && <p className="text-white/40">Loading reservations…</p>}
        {error && <p className="text-rose-400">{error}</p>}

        {!loading && !error && reservations.length === 0 && (
          <div className="rounded-2xl bg-white/[0.04] px-6 py-12 text-center">
            <p className="text-white/50">No reservations yet.</p>
            <Link href="/collection" className="mt-4 inline-block text-sm text-white underline">
              Browse the collection
            </Link>
          </div>
        )}

        {!loading && reservations.length > 0 && filtered.length === 0 && (
          <div className="rounded-2xl bg-white/[0.04] px-6 py-12 text-center">
            <p className="text-white/50">No reservations match your filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setBullFilter("all");
              }}
              className="mt-4 text-sm text-white underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-white/[0.04]">
            <div className="hidden grid-cols-[1.4fr_1.2fr_0.8fr_1fr] gap-4 border-b border-white/[0.06] px-4 py-3 font-mono text-[10px] tracking-wider text-white/35 uppercase sm:grid">
              <span>Bull</span>
              <span>Wallet</span>
              <span>Bid offer</span>
              <span>Time</span>
            </div>
            <ul className="divide-y divide-white/[0.06]">
              {filtered.map((r) => (
                <li
                  key={r.id}
                  className="grid gap-2 px-4 py-4 sm:grid-cols-[1.4fr_1.2fr_0.8fr_1fr] sm:items-center sm:gap-4"
                >
                  <div>
                    <p className="font-medium text-white">{r.nftName}</p>
                    <p className="font-mono text-xs text-white/40">
                      #{String(r.nftId).padStart(4, "0")}
                    </p>
                  </div>
                  <p className="font-mono text-sm text-white/70">{r.maskedWallet}</p>
                  <p className="font-mono text-sm text-white">{formatSol(r.bidAmount)}</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-white/45">{formatTime(r.createdAt)}</p>
                    <a
                      href={`https://solscan.io/tx/${r.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-white/60 underline hover:text-white"
                    >
                      {r.signature.slice(0, 8)}…
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-white/30">
          Emails hidden · wallet addresses masked · {SEAT_FEE_SOL} SOL seat per bid · floor {HIDDEN_SOL}
        </p>

        <div className="mt-8 text-center">
          <Link href="/collection" className="text-sm text-white/60 underline hover:text-white">
            View collection
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] px-4 py-4 text-center">
      <p className="font-mono text-[10px] tracking-[0.25em] text-white/35 uppercase">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
