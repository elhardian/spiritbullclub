"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { formatAddress, useWallet } from "@/context/WalletContext";
import { SEAT_FEE_SOL, COLLECTION } from "@/data/collection";
import { formatSol } from "@/lib/collection-utils";
import type { PublicReservation } from "@/types/reservation";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function bullImage(nftId: number) {
  return COLLECTION.find((n) => n.id === nftId)?.image;
}

export default function YourBidPage() {
  const { address, isConnected, openWalletModal } = useWallet();
  const [reservations, setReservations] = useState<PublicReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setReservations([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/reservations/mine?wallet=${encodeURIComponent(address)}`)
      .then((res) => res.json())
      .then((data: { reservations?: PublicReservation[]; error?: string }) => {
        if (!cancelled) {
          if (data.error) setError(data.error);
          else setReservations(data.reservations ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load your reservations.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-[0.35em] text-white/35 uppercase">Account</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your Bid</h1>
          <p className="mt-2 text-white/50">
            Bids tied to your wallet · {SEAT_FEE_SOL} SOL seat fee per bid
          </p>
        </div>

        {!isConnected || !address ? (
          <div className="rounded-2xl bg-white/[0.04] px-6 py-12 text-center">
            <p className="text-white/50">Connect your wallet to see your reservations.</p>
            <button
              type="button"
              onClick={openWalletModal}
              className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-2xl bg-white/[0.04] px-4 py-4">
              <p className="font-mono text-[10px] tracking-[0.25em] text-white/35 uppercase">
                Connected wallet
              </p>
              <p className="mt-1 font-mono text-sm text-white/80">{formatAddress(address)}</p>
            </div>

            {loading && <p className="text-white/40">Loading your reservations…</p>}
            {error && <p className="text-rose-400">{error}</p>}

            {!loading && !error && reservations.length === 0 && (
              <div className="rounded-2xl bg-white/[0.04] px-6 py-12 text-center">
                <p className="text-white/50">No reservations yet for this wallet.</p>
                <Link
                  href="/collection"
                  className="mt-4 inline-block text-sm text-white underline"
                >
                  Browse the collection
                </Link>
              </div>
            )}

            {!loading && reservations.length > 0 && (
              <ul className="space-y-3">
                {reservations.map((r) => {
                  const image = bullImage(r.nftId);
                  return (
                    <li
                      key={r.id}
                      className="flex gap-4 rounded-2xl bg-white/[0.04] p-4 sm:items-center"
                    >
                      {image ? (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/[0.06]">
                          <Image
                            src={image}
                            alt={r.nftName}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl">
                          🐂
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white">{r.nftName}</p>
                        <p className="font-mono text-xs text-white/40">
                          #{String(r.nftId).padStart(4, "0")}
                        </p>
                        <p className="mt-1 text-xs text-white/45">{formatTime(r.createdAt)}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-sm text-white">{formatSol(r.bidAmount)}</p>
                        <a
                          href={`https://solscan.io/tx/${r.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block font-mono text-xs text-white/60 underline hover:text-white"
                        >
                          View tx
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-white/60">
          <Link href="/bids" className="underline hover:text-white">
            All bids →
          </Link>
          <Link href="/" className="underline hover:text-white">
            ← Back to collection
          </Link>
        </div>
      </main>
    </div>
  );
}
