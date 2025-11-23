export function generateVCF(profile: {
  full_name: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  username: string;
  website?: string | null;
}) {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
  ];

  if (profile.full_name) {
    lines.push(`FN:${escapeVCardValue(profile.full_name)}`);
  }

  if (profile.company) {
    lines.push(`ORG:${escapeVCardValue(profile.company)}`);
  }

  if (profile.phone) {
    lines.push(`TEL;TYPE=work:${escapeVCardValue(profile.phone)}`);
  }

  if (profile.email) {
    lines.push(`EMAIL:${escapeVCardValue(profile.email)}`);
  }

  if (profile.website) {
    lines.push(`URL:${escapeVCardValue(profile.website)}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.com";
  lines.push(`URL:${baseUrl}/${profile.username}`);

  lines.push("END:VCARD");

  return lines.join("\r\n");
}

function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

