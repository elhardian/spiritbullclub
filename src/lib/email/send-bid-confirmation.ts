import nodemailer from "nodemailer";
import {
  buildBidConfirmationEmail,
  type BidEmailData,
} from "@/lib/email/bid-confirmation-template";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  if (!host || !user || !pass || !from) return null;

  return {
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user,
    pass,
    from,
  };
}

export function isEmailConfigured() {
  return getSmtpConfig() !== null;
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3007"
  );
}

export async function sendBidConfirmationEmail(input: {
  email: string;
  bullName: string;
  nftId: number;
  bidOffer: number;
  signature: string;
}) {
  const config = getSmtpConfig();
  if (!config) {
    console.warn("[email] SMTP not configured - skipping bid confirmation email");
    return { sent: false as const };
  }

  const name = input.email.split("@")[0] || "bidder";
  const data: BidEmailData = {
    email: input.email,
    name,
    bullName: input.bullName,
    nftId: input.nftId,
    bidOffer: input.bidOffer,
    signature: input.signature,
    siteUrl: getSiteUrl(),
  };

  const { subject, text, html } = buildBidConfirmationEmail(data);

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transport.sendMail({
    from: config.from,
    to: input.email,
    subject,
    text,
    html,
  });

  return { sent: true as const };
}
