import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SolanaProviders } from "@/providers/SolanaProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spirit Bull Club",
  description:
    "Spirit Bull Club - Solana NFT herd. Bid in SOL, trade on Bull Marketplace, and meet Genesis #0001 for Ansem.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SolanaProviders>{children}</SolanaProviders>
      </body>
    </html>
  );
}
