# Spirit Bull Club

A futuristic Solana NFT collection website. Built with **Next.js**, Tailwind CSS, and a living 3D-style carousel.

## Features

- Dark showcase for the Spirit Bull herd with 3D carousel
- Phantom wallet connect with on-chain **0.1 SOL** bids
- 777 limited supply · **7 bulls released per week**
- Template spirit art on bulls **#0005–#0010**
- Genesis Bull #0001 reserved for Ansem (Zion Thomas)

## Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_MARKETING_WALLET=YourSolanaWalletAddressHere
```

Each bid sends exactly **0.1 SOL** to `NEXT_PUBLIC_MARKETING_WALLET` via Phantom.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router)
- React 19
- Tailwind CSS v4
- TypeScript
- @solana/web3.js
