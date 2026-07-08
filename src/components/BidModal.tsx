"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { MIN_BID_OFFER_SOL, SEAT_FEE_SOL, HIDDEN_SOL } from "@/data/collection";
import { useWallet } from "@/context/WalletContext";
import { formatSol, highestBidLabel, isReservable, minBidAmount } from "@/lib/collection-utils";
import { BidGreeting } from "@/components/BidGreeting";
import { BidGuide } from "@/components/BidGuide";
import { isValidEmail } from "@/lib/validation";
import type { SpiritBull } from "@/data/collection";

type Props = {
  nft: SpiritBull | null;
  open: boolean;
  onClose: () => void;
};

export function BidModal({ nft, open, onClose }: Props) {
  const { isConnected, openWalletModal, placeBid, getNft, isConnecting } = useWallet();
  const [email, setEmail] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [status, setStatus] = useState<{ type: "ok" | "err"; message: string } | null>(null);
  const [success, setSuccess] = useState<{
    bidOffer: number;
    signature: string;
    email: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const live = nft ? getNft(nft.id) ?? nft : null;
  const canReserve = live ? isReservable(live) : false;
  const minimumOffer = live ? minBidAmount(live) : MIN_BID_OFFER_SOL;

  useEffect(() => {
    if (!open) return;
    setEmail("");
    setStatus(null);
    setSuccess(null);
    if (live) setBidAmount(String(minBidAmount(live)));
  }, [open, live?.id, live?.highestBid]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !live) return null;

  const imageSrc = live.image;

  async function onReserve(e: FormEvent) {
    e.preventDefault();
    if (!canReserve) return;

    if (!isValidEmail(email)) {
      setStatus({ type: "err", message: "Enter a valid email to place your bid." });
      return;
    }

    const offer = Number(bidAmount);
    if (!Number.isFinite(offer) || offer < minimumOffer) {
      setStatus({ type: "err", message: `Bid offer must be at least ${formatSol(minimumOffer)}.` });
      return;
    }

    setStatus(null);
    setBusy(true);
    try {
      if (!isConnected) {
        openWalletModal();
        setStatus({ type: "err", message: "Connect a wallet to book your seat." });
        return;
      }
      const result = await placeBid(live!.id, email.trim(), offer);
      if (!result.ok) setStatus({ type: "err", message: result.error });
      else
        setSuccess({
          bidOffer: offer,
          signature: result.signature,
          email: email.trim(),
        });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-[#080808] sm:grid-cols-2">
        <div
          className="relative min-h-[280px] bg-black p-5 sm:min-h-[380px]"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${live.palette.glow}18, #000 65%)`,
          }}
        >
          <Image
            src={imageSrc}
            alt={live.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
          />
        </div>

        <div className="relative z-10 flex flex-col bg-[#0a0a0a] p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
                {live.reserved
                  ? "Genesis reserved"
                  : live.airdropped
                    ? "Holder airdrop"
                    : "Bid · Solana"}
              </p>
              <h2 className="text-2xl font-semibold text-white">{live.name}</h2>
              <p className="mt-1 text-sm text-white/50">{live.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-2.5 py-1 text-white/45 transition hover:bg-white/[0.06] hover:text-white"
            >
              ✕
            </button>
          </div>

          {live.reserved ? (
            <div className="rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-white/70">
              This genesis bull is ceremony-bound for{" "}
              <a
                href="https://twitter.com/blknoiz06"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline decoration-white/20 hover:decoration-white/40"
              >
                Ansem (@blknoiz06)
              </a>{" "}
              and is not open for public bidding.
            </div>
          ) : live.airdropped ? (
            <div className="rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-white/70">
              <span className="font-semibold text-white">Spirit Bull #0002 — Trencher</span> is
              airdropped to existing Spirit Bull Club holders. Not available for public bidding.
            </div>
          ) : (
            <div className="mb-4 grid grid-cols-3 gap-2 text-sm">
              <Stat label="Buy now" value={HIDDEN_SOL} />
              <Stat label="Highest bid" value={highestBidLabel(live)} />
              <Stat label="Seat fee" value={formatSol(SEAT_FEE_SOL)} />
            </div>
          )}

          <div className="mb-4 mt-4 flex flex-wrap gap-2">
            {Object.entries(live.traits).map(([key, value]) => (
              <span
                key={key}
                className="rounded-lg bg-white/[0.05] px-2 py-1 font-mono text-[10px] text-white/60"
              >
                <span className="text-white/35 uppercase">{key}: </span>
                {value}
              </span>
            ))}
          </div>

          {success ? (
            <BidGreeting
              bullName={live.name}
              email={success.email}
              bidOffer={success.bidOffer}
              signature={success.signature}
              onClose={onClose}
            />
          ) : canReserve ? (
            <form onSubmit={onReserve} className="mt-auto space-y-3">
              <BidGuide variant="compact" />
              <label className="block text-xs tracking-wide text-white/40 uppercase">
                Your bid offer (SOL)
                <input
                  type="number"
                  required
                  min={minimumOffer}
                  step="0.1"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-white/[0.05] px-3 py-2.5 font-mono text-sm text-white outline-none placeholder:text-white/30 focus:bg-white/[0.08]"
                />
              </label>
              <p className="text-xs text-white/40">
                Offer min {formatSol(minimumOffer)} · charged only if you win · pay{" "}
                {formatSol(SEAT_FEE_SOL)} now to book your seat
              </p>
              <label className="block text-xs tracking-wide text-white/40 uppercase">
                Email for updates
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="mt-1 w-full rounded-xl bg-white/[0.05] px-3 py-2.5 font-mono text-sm text-white outline-none placeholder:text-white/30 focus:bg-white/[0.08]"
                />
              </label>
              <button
                type="submit"
                disabled={busy || isConnecting}
                className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                {busy
                  ? "Confirm seat fee in wallet…"
                  : `Place bid · ${formatSol(SEAT_FEE_SOL)} seat`}
              </button>
            </form>
          ) : null}

          {status && !success && (
            <p
              className={`mt-3 text-sm break-all ${
                status.type === "ok" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {status.message}
            </p>
          )}

          {canReserve && live.bids.length > 0 && (
            <div className="mt-4 max-h-28 overflow-y-auto border-t border-white/[0.06] pt-3">
              <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
                Recent bid offers
              </p>
              <ul className="space-y-1.5">
                {live.bids.map((bid, i) => (
                  <li key={`${bid.timestamp}-${i}`} className="flex justify-between gap-2 text-xs text-white/55">
                    <span className="font-mono shrink-0">{bid.bidder}</span>
                    <span className="text-white/80">{formatSol(bid.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.05] px-3 py-2">
      <p className="text-[10px] tracking-wider text-white/35 uppercase">{label}</p>
      <p className="font-mono text-white">{value}</p>
    </div>
  );
}
