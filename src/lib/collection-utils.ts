import type { SpiritBull } from "@/data/collection";
import { MIN_BID_OFFER_SOL } from "@/data/collection";

export function isReservable(nft: SpiritBull) {
  return !nft.reserved && !nft.airdropped;
}

export type CollectionCategory = "all" | "reservable" | "reserved" | "airdrop";

export function collectionCategory(nft: SpiritBull): Exclude<CollectionCategory, "all"> {
  if (nft.reserved) return "reserved";
  if (nft.airdropped) return "airdrop";
  return "reservable";
}

export function listingLabel(nft: SpiritBull) {
  if (nft.reserved) return "Reserved";
  if (nft.airdropped) return "Holder airdrop";
  return null;
}

export function formatSol(amount: number) {
  return `${parseFloat(amount.toFixed(4))} SOL`;
}

export function highestBidLabel(nft: SpiritBull) {
  const status = listingLabel(nft);
  if (status) return status;
  if (nft.highestBid > 0) return formatSol(nft.highestBid);
  return "No bids";
}

export function minBidAmount(nft: SpiritBull) {
  if (nft.highestBid <= 0) return MIN_BID_OFFER_SOL;
  return Math.max(MIN_BID_OFFER_SOL, Number((nft.highestBid + 0.1).toFixed(4)));
}

export function matchesCollectionSearch(nft: SpiritBull, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const id = String(nft.id).padStart(4, "0");
  return (
    nft.name.toLowerCase().includes(q) ||
    id.includes(q) ||
    String(nft.id).includes(q) ||
    Object.values(nft.traits).some((t) => t.toLowerCase().includes(q))
  );
}
