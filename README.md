# 💙 A Birthday Website

A fully interactive, romantic birthday website — built as a digital gift.
Light-blue & white glassmorphism theme, soft floral decorations, music,
mini-game, photo gallery, digital letter, gift vouchers, a final surprise,
and a private invitation at the very end.

Everything runs by simply opening **`index.html`** in a browser. No build
step, no installation, no paid libraries.

---

## 🚀 Quick start

1. Open `index.html` in any modern browser to preview it immediately.
   It already works out of the box using elegant placeholder graphics, so
   you can see the full experience before adding anything.
2. Fill in your personal details (see **Step 1** below).
3. Drop in your photos and song (see **Step 2** below).
4. Deploy (see **Deploying** below) — or just send the folder.

---

## ✏️ Step 1 — Edit your personal details (the only file you must touch)

Open **`script.js`** and edit the single `birthdayData` object at the very
top of the file. **All** text, names, dates, photos, wishes, and vouchers
on the website come from this one object — you never need to hunt through
the HTML.

```js
const birthdayData = {
  girlfriendName: "Her Name",
  senderName:     "Your Name",
  birthDate:      "1 January 2000",
  currentAge:     25,
  mainMessage:    "I created this little digital space to celebrate you...",

  event: {
    date:        "Saturday, 12 July 2025",
    startTime:   "7:00 PM",
    endTime:     "10:00 PM",
    startTime24: "19:00",   // 24h format — used for the calendar file
    endTime24:   "22:00",   // 24h format — used for the calendar file
    isoDate:     "2025-07-12", // YYYY-MM-DD — used for the calendar file
    venue:       "The Garden Terrace",
    address:     "123 Example Street, Your City",
    dressCode:   "Smart casual, something blue",
    mapsLink:    "https://maps.google.com/?q=...",
    whatsappNumber: "628123456789"  // international format, digits only
  },

  playlist: [
    {
      title:  "Song Title",
      artist: "Artist Name",
      audio:  "assets/music/song-1.mp3",
      cover:  "assets/images/cover-1.jpg"
    }
    // add more songs here if you like — the player supports a full playlist
  ],

  photos: [        // MAXIMUM 3 photos. sticker can be "star", "flower", or "heart"
    { src: "assets/images/photo-1.jpg", caption: "A caption",  date: "Summer 2024", sticker: "star" },
    { src: "assets/images/photo-2.jpg", caption: "Another one", date: "Last winter", sticker: "flower" },
    { src: "assets/images/photo-3.jpg", caption: "One more",    date: "That trip",   sticker: "heart" }
  ],

  wishes: [        // MAXIMUM 3 wishes
    { object: "balloon", text: "Semoga kamu panjang umur" },
    { object: "star",    text: "Semua plan dan cita-cita kamu tercapai" },
    { object: "gift",    text: "Semoga kamu selalu bahagia dimana dan kapanpun kamu berada" }
  ],

  vouchers: [
    { title: "A Full Day Hug Voucher",     description: "Redeemable any time, no questions asked." },
    { title: "A Dinner Date Voucher",      description: "Your favourite place, my treat." },
    { title: "One Special Request Voucher",description: "Ask for anything within reason." }
  ]
};
```

> **Tips**
> - `currentAge` can be a number or text.
> - For `whatsappNumber`, use the full international format with no `+`,
>   spaces, or dashes (e.g. Indonesia `628123…`, US `1555…`).
> - Each wish `object` can be `"balloon"`, `"star"`, or `"gift"`.

---

## 🖼️ Step 2 — Add your photos & music

Place your files in the `assets/` folder using these **exact names** (or
change the names in `birthdayData` to match your files):

| What                | Where to put it               | Suggested file              |
|---------------------|-------------------------------|-----------------------------|
| Main hero photo     | `assets/images/`              | `hero.jpg`                  |
| Gallery photo 1–3   | `assets/images/`              | `photo-1.jpg` … `photo-3.jpg` |
| Song cover art      | `assets/images/`              | `cover-1.jpg`               |
| Background song     | `assets/music/`               | `song-1.mp3`                |

The hero photo is read from `birthdayData.heroPhoto` (defaults to
`assets/images/hero.jpg`).

**You don't have to add anything to see it working.** Until you add real
files, the site automatically shows soft floral placeholder graphics in
every photo slot, and the music player simply stays paused. Nothing breaks.

**Image tips for fast loading on mobile data:**
- Resize photos to roughly 1200px on the long edge.
- Export as JPG at ~80% quality (or `.webp` for even smaller files).
- Keep the song a normal-length MP3.

---

## 🎵 About the music

- Music **never autoplays** — browsers block that anyway. It starts only
  after the recipient presses **“Open Your Gift”** or the play button.
- The floating glass player has play/pause, previous/next, a seek bar,
  volume, mute, and live time display.
- Add as many songs as you like to the `playlist` array.

---

## 🔧 What's interactive

- **Opening gift** → confetti, stars & hearts, music begins.
- **Hero** with typing animation and a gently floating photo.
- **Greeting** card with a “Tap for More” reveal.
- **Gallery** (max 3 polaroids) → lightbox, slideshow, random memory.
- **Wishes** (max 3 floating objects) → opened state saved in your browser.
- **Mini-game** — 20 seconds, tap the objects, best score saved.
- **Digital letter** in an envelope that opens with a soft sound.
- **Gift vouchers** — pick one, save it as an image.
- **Final surprise** — night sky, fireworks, balloons, messages, virtual hug.
- **Invitation** (the grand finale) — maps link, WhatsApp RSVP, add to
  calendar (Google + `.ics` download), save as image.

All sound effects are generated in-browser (no extra files) and can be muted.

---

## 💾 Saved progress (localStorage)

The site remembers, in the visitor's own browser only: opened wishes, best
game score, the chosen voucher, and music/sound preferences. The footer has
a **Reset** button that clears all of this after a confirmation.

---

## 📁 Project structure

```
birthday-website/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── images/   ← photos, hero, song cover
    ├── music/    ← background song(s)
    ├── icons/    ← (icons are inline SVG; folder kept for your own additions)
    └── sounds/   ← (sound effects are generated in-browser; folder optional)
```

---

## 🌐 Deploying

The site is plain static files, so any of these work:

- **Just send it:** zip the folder and share it; opening `index.html` works
  offline (except the web-fonts, which need internet — it falls back to
  clean system fonts otherwise).
- **GitHub Pages:** push the folder to a repo → Settings → Pages → deploy
  from the `main` branch root.
- **Netlify / Vercel:** drag-and-drop the folder, or connect the repo.
  No build command, no framework — publish directory is the folder itself.

---

## ♿ Accessibility & performance notes

- Semantic HTML, keyboard-navigable controls, visible focus states,
  `aria-label`s on icon buttons, and alt text on images.
- Respects **prefers-reduced-motion** — animations calm down automatically
  for visitors who request reduced motion.
- Images lazy-load, decorations are lightweight SVG/CSS, and there are no
  heavy third-party libraries.

---

Made with care. Enjoy giving it. 💙
