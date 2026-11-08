# 🎂 KMB Birthday Messages

Birthday message wall for **Ginge / KMB** ([twitch.tv/kmbpc](https://www.twitch.tv/kmbpc)), styled like one of his streams.
Mates leave a message (🎉 Hype, 🔥 Roast or 🎵 Vibes) and it shows up live in the "Birthday Chat".

## Setup

Messages are stored in [PocketBase](https://pocketbase.io), hosted for free on [PocketHost](https://pockethost.io).

### 1. PocketBase on PocketHost
1. Sign up at [pockethost.io](https://pockethost.io) and create an instance, e.g. `ginge` → `https://ginge.pockethost.io`.
   Use PocketBase **v0.23 or newer** (the schema file uses the newer format; it was tested on v0.40.6).
2. Open `https://<your-instance>.pockethost.io/_/` and create your admin (superuser) account.
3. Upload [`pb_migrations/`](pb_migrations) to the instance's `pb_migrations` folder
   (PocketHost dashboard → your instance → **FTP**, log in with your PocketHost account), then restart the instance.
   This creates the `messages` collection, its security rules, and a server-side slow mode (2 posts per minute per IP).
   - No FTP? In the admin UI create a **Base collection** `messages` with fields `name` (text, required, max 30),
     `message` (text, required, max 5000), `vibe` (select: Hype / Roast / Vibes, required), `created` (autodate, on create).
     API rules: List / View / Create = empty (public), Update / Delete = locked.

### 2. Config
Edit [`config.js`](config.js):
```js
window.KMB_CONFIG = {
  POCKETBASE_URL: "https://ginge.pockethost.io",
  DISCORD_INVITE: "https://discord.gg/xxxx"
};
```
The URL is safe to be public: what visitors can do is controlled by the collection's API rules on the server.

### 3. GitHub Pages
Repo **Settings → Pages → Source: Deploy from a branch → `main` / root → Save**.
The site goes live at `https://necero71.github.io/KMB-Birthday-Messages/` after a minute or so.

## Moderating
Delete spam or anything dodgy in the PocketBase admin (`https://<your-instance>.pockethost.io/_/` → **messages**).
The page can only add messages, never edit or delete them. Slow mode is 30 seconds per browser, plus 2 posts per minute per IP on the server.

## Files
| File | What it is |
|---|---|
| `index.html` | Page layout + styles |
| `app.js` | Chat, !wheel, Copy for Discord, PocketBase live updates |
| `config.js` | Your PocketBase URL + Discord settings |
| `pb_migrations/` | `messages` collection, security rules, rate limit |
| `assets/` | Stream clip, poster, avatar |
