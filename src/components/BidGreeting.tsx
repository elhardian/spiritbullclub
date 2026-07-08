import Link from "next/link";
import { SEAT_FEE_SOL } from "@/data/collection";
import { formatSol } from "@/lib/collection-utils";

type Props = {
  bullName: string;
  email: string;
  bidOffer: number;
  signature: string;
  onClose: () => void;
};

export function BidGreeting({ bullName, email, bidOffer, signature, onClose }: Props) {
  const name = email.split("@")[0] || "bidder";

  return (
    <div className="mt-auto rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] p-5">
      <p className="font-mono text-[10px] tracking-[0.25em] text-emerald-400/80 uppercase">
        Welcome to the herd
      </p>
      <h3 className="mt-2 text-xl font-semibold text-white">
        Gg, {name} — your bid is in.
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        You&apos;ve booked a seat on <span className="text-white">{bullName}</span> with a{" "}
        {formatSol(bidOffer)} offer. {formatSol(SEAT_FEE_SOL)} seat fee paid — your full offer is
        only charged if you win. We&apos;ll reach you at{" "}
        <span className="text-white/80">{email}</span> — check your inbox for confirmation.
      </p>
      <p className="mt-3 font-mono text-xs text-white/40">
        Tx{" "}
        <a
          href={`https://solscan.io/tx/${signature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400/90 underline hover:text-emerald-300"
        >
          {signature.slice(0, 10)}…
        </a>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/your-bid"
          onClick={onClose}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
        >
          View your bids
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/[0.08] px-4 py-2 text-xs text-white/70 transition hover:bg-white/[0.12] hover:text-white"
        >
          Keep browsing
        </button>
      </div>
    </div>
  );
}
