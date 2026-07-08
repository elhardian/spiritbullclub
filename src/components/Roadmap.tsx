import Image from "next/image";

const PHASES = [
  {
    phase: "01",
    title: "Genesis Drop",
    status: "Live",
    points: [
      "Limited collection of 777 Spirit Bulls on Solana — never more",
      "7 bulls released every week",
      "Spirit Bull #0002 — Trencher — airdropped to holders",
      "Living showcase with Phantom wallet & 0.1 SOL bids",
    ],
  },
  {
    phase: "02",
    title: "Bull Marketplace",
    status: "Next",
    points: [
      "Full peer-to-peer Bull Marketplace for listings, offers & floors",
      "Trade Spirit Bulls natively in SOL with low fees",
      "Holder tools: rarity filters, trait search, and live activity feed",
    ],
  },
  {
    phase: "03",
    title: "Coin × NFT Synergy",
    status: "Planned",
    points: [
      "Spirit Bull Club NFTs are utility wrappers around the community coin",
      "Holding a bull unlocks coin rewards, fee discounts, and voting weight",
      "Marketplace volume & staking feed value back into the coin flywheel",
    ],
  },
  {
    phase: "04",
    title: "Ansem Genesis Pass",
    status: "Sacred",
    points: [
      "Spirit Bull #0001 — the first NFT of the collection — is reserved for Ansem (@blknoiz06)",
      "A ceremonial handoff of the genesis bull with the iconic ANSEM chain",
      "Honoring the spirit that stampedes culture across Solana",
    ],
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs tracking-[0.35em] text-white/35 uppercase">
          Roadmap
        </p>
        <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Where the stampede goes</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/45">
          777 limited. 7 bulls per week. Bull Marketplace next — NFTs and the coin move as one Solana herd.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {PHASES.map((item) => (
          <article
            key={item.phase}
            className="rounded-2xl bg-white/[0.04] p-6 transition hover:bg-white/[0.06]"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
                Phase {item.phase}
              </span>
              <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white/60 uppercase">
                {item.status}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <ul className="mt-3 space-y-2">
              {item.points.map((point) => (
                <li key={point} className="flex gap-2 text-sm text-white/50">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-white/[0.04] p-6 sm:p-8">
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/35 uppercase">
            Coin utility
          </p>
          <h3 className="mt-2 text-2xl font-semibold">How the collection ties to the coin</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
            Spirit Bull Club lives on Solana — capped at 777, released weekly. Every bull is a key
            into the coin economy. Holders get priority access on the upcoming Bull Marketplace,
            reduced trading fees paid in the community coin, and staking boosts proportional to bull
            rarity. Bids and sales settle in <span className="text-white">SOL</span>, while the coin
            powers rewards, governance, and liquidity around the herd.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <UtilityChip label="SOL trading" detail="Bids & buys settle in SOL" />
            <UtilityChip label="Coin rewards" detail="Holder yield & fee kicks" />
            <UtilityChip label="Governance" detail="Bull weight = vote power" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-black">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <Image
            src="/ansem-bull.png"
            alt="Spirit Bull #0001 — Ansem (@blknoiz06)"
            width={640}
            height={640}
            className="h-full w-full object-cover"
            priority={false}
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-mono text-[10px] tracking-[0.3em] text-white/45 uppercase">
              Genesis handoff
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">First NFT → Ansem</h3>
            <p className="mt-1 text-sm text-white/55">
              Spirit Bull #0001 passes to{" "}
              <a href="https://twitter.com/blknoiz06" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline decoration-white/20 hover:decoration-white/40">Ansem (@blknoiz06)</a> — the opening chapter of the
              herd.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function UtilityChip({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-xl bg-black/50 px-3 py-2.5">
      <p className="text-xs font-medium text-white/80">{label}</p>
      <p className="mt-0.5 text-[11px] text-white/40">{detail}</p>
    </div>
  );
}
