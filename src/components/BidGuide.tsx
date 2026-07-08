import { MIN_BID_OFFER_SOL, SEAT_FEE_SOL } from "@/data/collection";
import { formatSol } from "@/lib/collection-utils";

const STEPS = [
  { title: "Connect", detail: "Wallet" },
  { title: "Pick bull", detail: "Collection" },
  { title: "Seat fee", detail: formatSol(SEAT_FEE_SOL) },
  { title: "Bid offer", detail: `Min ${formatSol(MIN_BID_OFFER_SOL)}` },
  { title: "Win", detail: "Highest bid" },
] as const;

type Props = {
  variant?: "full" | "compact";
  className?: string;
};

function Timeline({ compact }: { compact?: boolean }) {
  return (
    <ol className="relative flex min-w-0 items-start justify-between gap-2">
      <div
        aria-hidden
        className={`absolute top-[0.55rem] right-4 left-4 h-px bg-white/15 sm:top-[0.65rem] ${
          compact ? "top-[0.45rem]" : ""
        }`}
      />
      {STEPS.map((step, i) => (
        <li key={step.title} className="relative z-10 flex min-w-0 flex-1 flex-col items-center text-center">
          <div
            className={`flex shrink-0 items-center justify-center rounded-full border border-white/20 bg-black font-mono text-white/80 ${
              compact ? "h-3.5 w-3.5 text-[9px]" : "h-5 w-5 text-[10px] sm:h-6 sm:w-6 sm:text-xs"
            }`}
          >
            {i + 1}
          </div>
          <p
            className={`mt-2 font-medium text-white ${
              compact ? "text-[10px] leading-tight" : "text-xs sm:text-sm"
            }`}
          >
            {step.title}
          </p>
          <p
            className={`mt-0.5 text-white/45 ${
              compact ? "text-[9px] leading-tight" : "text-[10px] sm:text-xs"
            }`}
          >
            {step.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function BidGuide({ variant = "full", className = "" }: Props) {
  const compact = variant === "compact";

  if (compact) {
    return (
      <div className={`overflow-x-auto rounded-xl bg-white/[0.04] px-4 py-3 ${className}`}>
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
          How bidding works
        </p>
        <div className="mt-3 min-w-[28rem]">
          <Timeline compact />
        </div>
      </div>
    );
  }

  return (
    <section id="how-bids" className={`mx-auto max-w-5xl px-4 py-10 sm:px-6 ${className}`}>
      <div className="mb-5 text-center">
        <p className="font-mono text-xs tracking-[0.35em] text-white/35 uppercase">Guide</p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">How bidding works</h2>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white/[0.04] px-4 py-6 sm:px-8">
        <div className="min-w-[36rem]">
          <Timeline />
        </div>
        <p className="mt-5 text-center text-xs text-white/40 sm:text-sm">
          Pay {formatSol(SEAT_FEE_SOL)} seat fee now · bid offer charged only if you win
        </p>
      </div>
    </section>
  );
}
