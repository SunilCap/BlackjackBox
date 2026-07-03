# 🃏 21 Table — Blackjack

A fully-featured, mobile-first casino Blackjack game built as a single HTML file. Installable as a PWA, supports 10 languages, and designed for easy Google AdSense monetisation.

**Live demo:** `https://YOUR-USERNAME.github.io/21-table-blackjack/`

---

## ✨ Features

### Gameplay
- Full casino Blackjack rules — Hit, Stand, Double Down, Split, Surrender
- Insurance side bet (offered on dealer Ace)
- Dealer peek on Ace & 10-value upcards (standard American rules)
- Correct split-hand payout (21 on split pays 1:1, not 3:2)
- Blackjack pays 3:2 · Insurance pays 2:1
- Animated card dealing, hole-card flip, particle burst on win

### 5 Casino Tables
| Table | Min Stack | Bet Range | Decks |
|-------|-----------|-----------|-------|
| 🎰 Las Vegas | $500 | $5 – $100 | 2 |
| 🗼 Paris | $2,500 | $25 – $500 | 4 |
| 🏙️ Singapore | $10,000 | $100 – $2,000 | 6 |
| 🌆 Melbourne | $25,000 | $500 – $5,000 | 8 |
| 💎 Monaco | $100,000 | $1,000 – $10,000 | 8 |

### Languages
English · Español · Français · Deutsch · 日本語 · Português · 中文 · हिन्दी · العربية (RTL) · Italiano

### Technical
- ⚡ Single HTML file — zero dependencies, zero build step
- 📱 PWA — installable on iOS & Android, works offline
- 🔊 Sound effects via Web Audio API (no audio files)
- 📊 Session stats tracker
- 🛒 In-app purchase UI (store page, ready for real integration)
- 📐 Proportional scaling — pixel-perfect on any screen size

---

## 🚀 Deploy to GitHub Pages (Free Hosting + HTTPS)

1. **Fork or create a new repo** on GitHub
2. **Upload both files:**
   - `blackjack.html`
   - `sw.js`
3. Go to **Settings → Pages**
4. Set Source: `Deploy from a branch` → Branch: `main` → Folder: `/ (root)`
5. Click **Save** — your site is live at:
   ```
   https://YOUR-USERNAME.github.io/REPO-NAME/
   ```
6. Visit the URL on mobile and tap **"Add to Home Screen"** to install as a PWA

> **HTTPS is automatic** on GitHub Pages — required for PWA install and Service Worker.

---

## 💰 Google AdSense Integration

AdSense works perfectly on GitHub Pages sites. Follow these steps:

### Step 1 — Apply for AdSense
1. Go to [google.com/adsense](https://www.google.com/adsense)
2. Add your GitHub Pages URL as your site
3. Wait for approval (usually 1–7 days)

### Step 2 — Add your Publisher ID to `blackjack.html`
Open `blackjack.html` and find this section near the top:

```html
<!-- STEP 1: Uncomment and replace YOUR_PUBLISHER_ID -->
<!--
<script async src="https://pagead2.googlesyndication.com/...?client=ca-pub-YOUR_PUBLISHER_ID" ...></script>
-->
```

Uncomment it and replace `YOUR_PUBLISHER_ID` with your `ca-pub-XXXXXXXXXXXXXXXX`.

### Step 3 — Enable the lobby ad banner (optional)
Search for `MANUAL AD SLOT` in `blackjack.html`, uncomment the block, and replace both `YOUR_PUBLISHER_ID` and `YOUR_AD_SLOT_ID`.

### AdSense Tips for Games
| Strategy | Why it works |
|----------|-------------|
| **Auto Ads** (recommended) | Google picks the best spots automatically |
| **Lobby banner** | Players see it between table selections — high visibility |
| **Rules page** | Non-intrusive placement, still monetised |
| **Interstitial after 10 hands** | Can be added — ask Claude to implement |
| Keep gameplay **100% ad-free** | Users return more; AdSense rewards session length |

### Privacy Policy Requirement
AdSense requires a privacy policy. Options:
- Add a `/privacy.html` page to your repo
- Use a generator like [privacypolicygenerator.info](https://www.privacypolicygenerator.info)
- Link it in your site footer

---

## 📁 File Structure

```
21-table-blackjack/
├── blackjack.html    # The entire game (HTML + CSS + JS, ~2000 lines)
├── sw.js             # Service Worker — enables offline/PWA caching
└── README.md         # This file
```

That's it. No `node_modules`, no build tools, no CDN dependencies.

---

## 🔧 Updating the Game

When you receive an updated `blackjack.html` from Claude:

1. Open the file and find the version in the changelog comment at the top
2. Bump the version number: `v1.0.0` → `v1.0.1` (bug fix) or `v1.1.0` (new feature)
3. Update `APP_VERSION` in the JS section to match
4. Upload the new file to GitHub — GitHub Pages auto-deploys in ~60 seconds
5. The Service Worker will detect the version change and refresh the cache for all users

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | Vanilla HTML5 + CSS3 (no frameworks) |
| Logic | Vanilla JavaScript ES6+ (no libraries) |
| Audio | Web Audio API (synthesised, no files) |
| Graphics | CSS animations + Canvas (particles) |
| PWA | Service Worker + Web App Manifest |
| Hosting | GitHub Pages (free) |
| Ads | Google AdSense (optional) |

---

## 📋 Changelog

### v1.0.0 — 2025-07-03
- Initial release
- 5-table lobby with city themes (Vegas, Paris, Singapore, Melbourne, Monaco)
- Full blackjack rules with all casino-standard actions
- 10-language support with RTL (Arabic)
- PWA with offline support and install prompt
- Stats tracker, Store UI, Rules page
- Result animations with particle burst
- Sound effects

---

## 📄 License

MIT License — free to use, modify, and deploy commercially.

---

## 🤝 Credits

Built with [Claude](https://claude.ai) by Anthropic.
