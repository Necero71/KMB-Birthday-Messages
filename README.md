# 🎂 KMB Birthday Messages

Birthday message wall for **Ginge / KMB** ([twitch.tv/kmbpc](https://www.twitch.tv/kmbpc)), styled like one of his streams.
Mates leave a message (🎉 Hype, 🔥 Roast or 🎵 Vibes) and it shows up live in the "Birthday Chat".

## Setup

### 1. Supabase (free)
1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query**, paste [`supabase/schema.sql`](supabase/schema.sql), hit **Run**.
3. **Project Settings → API**: copy the **Project URL** and the **publishable / anon key**.
   Do **not** use the `service_role` / secret key, because that one would be public on the site.

### 2. Config
Edit [`config.js`](config.js):
```js
window.KMB_CONFIG = {
  SUPABASE_URL: "https://xxxx.supabase.co",
  SUPABASE_KEY: "sb_publishable_xxx",
  DISCORD_INVITE: "https://discord.gg/xxxx"
};
```

### 3. GitHub Pages
Repo **Settings → Pages → Source: Deploy from a branch → `main` / root → Save**.
The site goes live at `https://necero71.github.io/KMB-Birthday-Messages/` after a minute or so.

## Moderating
Delete spam or anything dodgy in Supabase → **Table Editor → messages**.
The page can only add messages, never edit or delete them. It also has a 30-second slow mode per browser.

## Files
| File | What it is |
|---|---|
| `index.html` | Page layout + styles |
| `app.js` | Chat, !wheel, Copy for Discord, Supabase live updates |
| `config.js` | Your Supabase + Discord settings |
| `supabase/schema.sql` | Table, security rules, realtime |
| `assets/` | Stream clip, poster, avatar |
