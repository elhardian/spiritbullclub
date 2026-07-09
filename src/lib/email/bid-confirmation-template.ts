import { SEAT_FEE_SOL } from "@/data/collection";

export type BidEmailData = {
  email: string;
  name: string;
  bullName: string;
  nftId: number;
  bidOffer: number;
  signature: string;
  siteUrl: string;
};

function formatSol(amount: number) {
  return `${parseFloat(amount.toFixed(4))} SOL`;
}

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildBidConfirmationEmail(data: BidEmailData) {
  const tokenId = String(data.nftId).padStart(4, "0");
  const seatFee = formatSol(SEAT_FEE_SOL);
  const bidOffer = formatSol(data.bidOffer);
  const txUrl = `https://solscan.io/tx/${data.signature}`;
  const yourBidsUrl = `${data.siteUrl}/your-bid`;
  const collectionUrl = `${data.siteUrl}/collection`;

  const subject = `Welcome to the herd - bid confirmed on ${data.bullName}`;

  const text = [
    `Gg, ${data.name} - your bid is in.`,
    ``,
    `Bull: ${data.bullName} (#${tokenId})`,
    `Seat fee paid: ${seatFee}`,
    `Bid offer: ${bidOffer} (charged only if you win)`,
    `Transaction: ${txUrl}`,
    ``,
    `Track your bids: ${yourBidsUrl}`,
    ``,
    `- Spirit Bull Club`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#5c1010 0%,#120606 100%);padding:28px 32px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.55);">Spirit Bull Club</p>
              <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:800;color:#ffffff;">Welcome to the herd</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:18px;line-height:1.5;color:#ffffff;">
                Gg, <strong>${esc(data.name)}</strong> - your bid is in.
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.62);">
                Your seat is booked on <strong style="color:#fff;">${esc(data.bullName)}</strong>.
                The stampede is live - we&apos;ll email you if anything changes on this bull.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#111111;border:1px solid #222222;border-radius:16px;margin-bottom:24px;">
                <tr>
                  <td style="padding:18px 20px;border-bottom:1px solid #222222;">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.38);">Bull</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;">${esc(data.bullName)}</p>
                    <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.45);font-family:ui-monospace,Menlo,monospace;">#${tokenId}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 20px;border-bottom:1px solid #222222;">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.38);">Seat fee paid now</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#34d399;font-family:ui-monospace,Menlo,monospace;">${seatFee}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.38);">Bid offer if you win</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;font-family:ui-monospace,Menlo,monospace;">${bidOffer}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td>
                    <a href="${txUrl}" style="display:inline-block;background:#ffffff;color:#000000;text-decoration:none;font-size:14px;font-weight:700;padding:12px 20px;border-radius:999px;">View transaction</a>
                  </td>
                  <td style="padding-left:10px;">
                    <a href="${yourBidsUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:999px;border:1px solid #2a2a2a;">Your bids</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.42);">
                Your full bid offer is only charged if you win. Browse the full collection at
                <a href="${collectionUrl}" style="color:#ffffff;text-decoration:underline;">${esc(data.siteUrl)}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #1a1a1a;">
              <p style="margin:0;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.32);text-align:center;">
                Spirit Bull Club · 777 limited · Solana
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
