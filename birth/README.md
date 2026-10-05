# Shalini’s Birthday Surprise ✨

A beautiful, highly interactive, emotional, playful, and premium 5-page birthday surprise website crafted especially for **Shalini**.

---

## 🌟 Features

* **100% Frontend Only**: Zero dependencies, no backend, no database, no authentication required.
* **Offline Audio Engine**: Built-in Web Audio API synthesizers for chimes, pop sounds, breath effects, fanfare, and ambient dreamy lo-fi background music without needing external MP3s.
* **5 Distinct Themed Pages**:
  1. **Page 1 (Cosmic Pink/Purple)**: Mysterious entrance with a 3D glowing gift box that opens, bursts with light rays, and fires dual party poppers.
  2. **Page 2 (Pink + Peach + Gold)**: The Big Reveal with celebratory confetti explosions, floating balloons, and glowing glassmorphic card.
  3. **Page 3 (Lavender + Cyan + Soft Blue)**: Interactive college memory scrapbook with Polaroid cards, 3D tilt effects, and a rich lightbox modal with reaction hearts.
  4. **Page 4 (Deep Navy + Royal Purple + Gold)**: Cinematic emotional letter with line-by-line typewriter reveals, pulsating golden heart, and celestial starlight.
  5. **Page 5 (Rainbow + Gold Grand Finale)**: Extravagant fireworks show, continuous confetti, 3-tier birthday cake with lit candles that you can make a wish and blow out!
* **Reusable Party Popper System**: Physics-based canvas confetti firing page-specific color palettes (rectangles, stars, hearts, ribbons, spirals).
* **Fully Responsive**: Designed for iPhone/Android screens, tablets, laptops, and large monitors.

---

## 🚀 How to Run Locally

You can open the project in several ways:

### Option 1: Direct File Opening (Instant)
Simply double-click `index.html` or drag it into any modern web browser (Chrome, Edge, Safari, Firefox).

### Option 2: Local Python Server (Recommended)
Run this command in the project folder:
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

---

## 📸 How to Customize Photos & Memories

All photos and memory stories are defined in:
👉 [`js/memories-data.js`](js/memories-data.js)

1. Put your photos into the `assets/images/` folder.
2. Open [`js/memories-data.js`](js/memories-data.js) and update the `image` paths, titles, stories, or quotes:
```javascript
{
    id: 1,
    title: "College Days 📚",
    tag: "Campus Vibes",
    image: "assets/images/your_photo_name.jpg",
    caption: "UGC Campus '23 — Best Day! ♡",
    story: "Your customized heartfelt memory here...",
    quote: "“Your favorite quote here.”",
    color: "#c084fc"
}
```

---

## ⌨️ Keyboard Shortcuts
* **Right Arrow / Spacebar**: Open surprise / advance to next page / make a wish.
* **Left Arrow**: Go to previous page.
* **Escape**: Close memory modal.
* **Click/Tap Anywhere on Page 5**: Launch interactive fireworks at that spot!

---

*Made with 💖 for Shalini.*
