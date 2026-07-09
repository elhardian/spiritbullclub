/** Full record - server-side only; email is never exposed to clients. */
export type ReservationRecord = {
  id: string;
  email: string;
  nftId: number;
  nftName: string;
  wallet: string;
  signature: string;
  /** Bid offer - settled later if the bidder wins. */
  bidAmount: number;
  createdAt: string;
};

/** Safe shape returned by the API and shown on /bids. */
export type PublicReservation = {
  id: string;
  nftId: number;
  nftName: string;
  maskedWallet: string;
  signature: string;
  /** Bid offer amount (not the upfront seat fee). */
  bidAmount: number;
  createdAt: string;
};
