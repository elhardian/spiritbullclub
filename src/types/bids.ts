import type { Bid } from "@/data/collection";
import { maskWallet } from "@/lib/validation";

export type PublicBid = {
  maskedWallet: string;
  amount: number;
  createdAt: string;
  signature: string;
};

export type NftBidSummary = {
  nftId: number;
  highestBid: number;
  bids: PublicBid[];
};

export function bidsToClientBids(
  bids: PublicBid[],
): Pick<Bid, "amount" | "bidder" | "timestamp" | "signature">[] {
  return bids.map((b) => ({
    amount: b.amount,
    bidder: b.maskedWallet,
    timestamp: new Date(b.createdAt).getTime(),
    signature: b.signature,
  }));
}

export function summariesToHighestBidMap(summaries: NftBidSummary[]) {
  return new Map(summaries.map((s) => [s.nftId, s.highestBid]));
}

export function maskBidWallet(wallet: string) {
  return maskWallet(wallet);
}
