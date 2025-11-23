--------------------------------------------
🏗️ TECHNICAL ARCHITECTURE DOCUMENTATION
--------------------------------------------
📌 Project Overview

A full-stack platform where users can:

Sign up

Create a customizable profile

Upload a profile picture + banner

Add social media links

Share a dynamic link: yourapp.com/username

Download a VCF (contact card)

Track analytics

Integrate NFC keychains

This document describes all architecture, database schema, folder structures, APIs, and components to build this webapp.

⚙️ 1. Tech Stack
Frontend

Next.js 14 (App Router)

React Server Components

TypeScript

Tailwind CSS

Shadcn UI

Backend

Supabase Auth

Supabase PostgreSQL

Supabase Storage

Supabase Edge Functions (analytics optional)

Hosting

Frontend → Vercel

Backend → Supabase

🛢️ 2. Database Schema (Supabase PostgreSQL)
profiles
create table profiles (
  id uuid primary key references auth.users(id),
  username text unique,
  full_name text,
  company text,
  about text,
  phone text,
  email text,
  website text,

  profile_image_url text,
  banner_image_url text,

  theme text default 'default',

  created_at timestamp default now(),
  updated_at timestamp default now()
);

social_links
create table social_links (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  platform text,
  url text,
  order_index int default 0,
  created_at timestamp default now()
);

analytics
create table analytics (
  id bigserial primary key,
  profile_id uuid references profiles(id),
  event_type text,         -- 'profile_view', 'link_click'
  platform text,           -- mobile, desktop
  referrer text,
  timestamp timestamp default now()
);

🔒 3. Row-Level Security (RLS)
For profiles
create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

For social_links
create policy "Users manage own links"
on social_links
using (auth.uid() = user_id);

📁 4. File Storage Structure

Supabase Storage Buckets:

profile-images/{userId}.jpg
banners/{userId}.jpg

🧱 5. Next.js Directory Structure (App Router)
/app
   /auth
      login/page.tsx
      register/page.tsx

   /dashboard
      page.tsx
      profile/page.tsx
      social/page.tsx
      appearance/page.tsx
      analytics/page.tsx

   /api
      /profile/update/route.ts
      /social/create/route.ts
      /social/update/route.ts
      /social/delete/route.ts
      /vcf/[username]/route.ts
      /analytics/route.ts

   /[username]
      page.tsx

/components
   Navbar.tsx
   ProfileForm.tsx
   SocialLinksForm.tsx
   ImageUploader.tsx
   ProfilePage.tsx
   SocialButton.tsx

/lib
   supabase.ts
   getProfile.ts
   getSocialLinks.ts

/styles
   globals.css

/utils
   vcf.ts
   themes.ts

🧩 6. Core Utilities
lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

🔌 7. API Endpoints
7.1 Update Profile

/app/api/profile/update/route.ts

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("profiles")
    .update(body)
    .eq("id", body.id);

  return Response.json({ data, error });
}

7.2 Add Social Link

/app/api/social/create/route.ts

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await supabase.from("social_links").insert(body);

  return Response.json({ data, error });
}

7.3 Generate VCF

/app/api/vcf/[username]/route.ts

import { supabase } from "@/lib/supabase";

export async function GET(req, { params }) {
  const { username } = params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  const vcf = `
BEGIN:VCARD
VERSION:3.0
FN:${profile.full_name}
ORG:${profile.company}
TEL;TYPE=work:${profile.phone}
EMAIL:${profile.email}
URL:https://yourapp.com/${username}
END:VCARD
`;

  return new Response(vcf, {
    headers: {
      "Content-Type": "text/vcard",
      "Content-Disposition": `attachment; filename="${username}.vcf"`
    }
  });
}

🌐 8. Public Profile Page

Location:

app/[username]/page.tsx

Fetch profile + social links as server components:
export default async function ProfilePage({ params }) {
  const { username } = params;

  const profile = await getProfile(username);
  const links = await getSocialLinks(profile.id);

  return (
    <ProfilePageContent profile={profile} links={links} />
  );
}

🧬 9. NFC Integration

Each NFC keychain stores URL:

https://yourapp.com/username


When tapped → opens profile → logs analytics.

📊 10. Analytics API

app/api/analytics/route.ts

export async function POST(req: Request) {
  const body = await req.json();
  await supabase.from("analytics").insert(body);

  return Response.json({ success: true });
}

🎨 11. Themes

Use Tailwind variables:

:root {
  --bg: white;
  --text: black;
}

[data-theme="dark"] {
  --bg: #111;
  --text: white;
}


Saved in profiles.theme.

🧪 12. Testing Strategy
Unit Tests

Jest + RTL

Integration Tests

Cypress

Cloud Testing

Vercel preview deployments

🚀 13. Deployment Procedure
Vercel

Auto-build Next.js App Router

Supabase

Push migrations

Enable RLS

Upload policies

🔐 14. Security Measures

RLS enforced

Signed URLs for uploads

Supabase Auth handles password encryption

Rate limit public APIs

🎯 End of Technical Architecture Document