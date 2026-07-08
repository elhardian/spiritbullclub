export type Bid = {
  amount: number;
  bidder: string;
  email?: string;
  timestamp: number;
  signature?: string;
};

export const HIDDEN_SOL = "xx SOL";
/** Upfront seat booking fee — always charged when placing a bid. */
export const SEAT_FEE_SOL = 0.1;
/** @deprecated Use SEAT_FEE_SOL */
export const BID_AMOUNT_SOL = SEAT_FEE_SOL;
/** Minimum bid offer (settled later if you win). */
export const MIN_BID_OFFER_SOL = 0.1;

export const COLLECTION_IMAGES = {
  ansem: "/ansem-bull.png",
  diamondHorn: "/diamond-horn.jpg",
  goldHorn: "/gold-horn.jpg",
  punk: "/punk.jpg",
  trencher: "/trencher-bull.png",
} as const;

export type SpiritBull = {
  id: number;
  name: string;
  description: string;
  price: number;
  highestBid: number;
  bids: Bid[];
  image: string;
  reserved?: boolean;
  airdropped?: boolean;
  traits: {
    aura: string;
    horns: string;
    eyes: string;
    background: string;
  };
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
};

export const COLLECTION: SpiritBull[] = [
  {
    id: 1,
    name: "Spirit Bull #0001 — Ansem",
    description:
      "Genesis of the herd. The first Spirit Bull is reserved for Ansem (@blknoiz06).",
    price: 0,
    highestBid: 0,
    reserved: true,
    image: COLLECTION_IMAGES.ansem,
    bids: [],
    traits: {
      aura: "Legend Status",
      horns: "Ridged Ivory",
      eyes: "Cool Gaze",
      background: "Teal Void",
    },
    palette: { primary: "#f59e0b", secondary: "#0a1f1c", accent: "#34d399", glow: "#fbbf24" },
  },
  {
    id: 2,
    name: "Spirit Bull #0002 — Trencher",
    description:
      "The trench warrior — airdropped to Spirit Bull Club holders. Not open for public reservation.",
    price: 0,
    highestBid: 0,
    airdropped: true,
    image: COLLECTION_IMAGES.trencher,
    bids: [],
    traits: {
      aura: "Trench Fire",
      horns: "Battle Scar",
      eyes: "Warpath Red",
      background: "Smoke Field",
    },
    palette: { primary: "#dc2626", secondary: "#1a0808", accent: "#f87171", glow: "#ef4444" },
  },
  {
    id: 3,
    name: "Spirit Bull #0003 — Diamond Horn",
    description: "Ice-cold alpha draped in crystal horns and midnight knit.",
    price: 0,
    highestBid: 0,
    bids: [],
    image: COLLECTION_IMAGES.diamondHorn,
    traits: { aura: "Frost Luxe", horns: "Diamond Facet", eyes: "Arctic Stare", background: "Teal Grid" },
    palette: { primary: "#67e8f9", secondary: "#0c4a6e", accent: "#a5f3fc", glow: "#22d3ee" },
  },
  {
    id: 4,
    name: "Spirit Bull #0004 — Gold Horn",
    description: "Solar titan with molten horns and a ribbed black turtleneck.",
    price: 0,
    highestBid: 0,
    bids: [],
    image: COLLECTION_IMAGES.goldHorn,
    traits: { aura: "Solar Flare", horns: "Golden Crown", eyes: "Amber Flame", background: "Teal Eclipse" },
    palette: { primary: "#ffd700", secondary: "#1a1400", accent: "#ffe566", glow: "#ffb800" },
  },
  {
    id: 5,
    name: "Spirit Bull #0005 — Punk",
    description: "Spiked leather rebel with geometric chrome horns and a mohawk.",
    price: 0,
    highestBid: 0,
    bids: [],
    image: COLLECTION_IMAGES.punk,
    traits: { aura: "Street Rage", horns: "Chrome Spike", eyes: "Laser Red", background: "Mint Void" },
    palette: { primary: "#ef4444", secondary: "#1a0a0a", accent: "#fca5a5", glow: "#dc2626" },
  },
];

export const COLLECTION_STATS = {
  totalSupply: 777,
  released: 5,
  weeklyDrop: 7,
  owners: 0,
  floorPrice: 0,
  volume: 0,
};
