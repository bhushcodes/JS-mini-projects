# Pomodoro Timer 🍅

<div align="center">
  <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" alt="Cat typing on laptop">
  <br>
  <em>Focus hard. Break smart. Repeat. 😺</em>
</div>

A playful, productivity‑boosting Pomodoro Timer inspired by the flow of [pomofocus.io](https://pomofocus.io) — built using just **HTML**, **CSS**, and **vanilla JavaScript**. It’s fast, accessible, responsive, and sprinkled with joyful cat gifs to keep the vibes high.

![JavaScript](https://img.shields.io/badge/vanilla-JavaScript-yellow) ![HTML5](https://img.shields.io/badge/HTML-5-orange) ![CSS3](https://img.shields.io/badge/CSS-3-blue)

## Features

✨ **Three Modes** — Pomodoro, Short Break, Long Break  
🧭 **Auto Flow** — Optional auto‑start next session  
🔔 **End Alerts** — Smooth Web Audio chime, optional desktop notifications  
🧅 **Long Break Interval** — Take a longer rest every X pomodoros  
🧮 **Daily Count** — Tracks completed pomodoros per day  
📝 **Tasks List** — Add/complete/reorder/delete tasks with localStorage  
🎛️ **Quick Settings** — Custom durations, toggles for sound/notify  
📱 **Responsive UI** — Looks great on phone, tablet, and desktop  
🧑‍🦯 **Accessible** — Keyboard shortcuts, ARIA, focus styles  
🐈 **Cat Energy** — Mode‑based fun gifs to match the mood

## Quick Start

<img src="https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif" width="200" align="right" alt="Excited cat">

1. Open `index.html` in your browser
2. Click a mode (Pomodoro / Short / Long)
3. Press **Start** (or hit **Space**) to begin
4. Stay focused. Breathe. Celebrate each 🍅

> Tip: Use the gear icon to tweak durations and options.

<br clear="right"/>

## Keyboard Shortcuts
- Space — Start / Pause
- R — Reset
- N — Skip to next session
- 1 — Pomodoro
- 2 — Short Break
- 3 — Long Break

## Project Structure

```
Project-4-Pomodoro-Timer/
├── index.html      # App layout & UI
├── styles.css      # Theme, responsive layout, progress ring
├── script.js       # Timer logic, settings, tasks, notifications
└── README.md       # You are here
```

## Technical Notes

### Timer accuracy
Timer uses a target end timestamp and recalculates remaining time on each tick to avoid drift. UI updates run ~5x/second for a smooth conic‑gradient progress ring, while time text updates stay precise to seconds.

### No dependencies
- Web Audio API for end chime (no audio assets)
- `Notification` API for optional desktop notifications
- localStorage for settings, tasks, and daily counts

### Accessibility
- Proper ARIA for tabs and live regions
- Focus‑visible and keyboard navigation
- Buttons have clear labels and states

## What Is This Project About?
This mini‑app helps you apply the **Pomodoro Technique**: 25 minutes of deep work followed by a 5‑minute break, with a long break every 4 pomodoros. It’s designed to be **minimal**, **delightful**, and **bug‑free** so you can get in the zone without fuss.

<div align="center">
  <img src="https://media.giphy.com/media/13borq7Zo2kulO/giphy.gif" width="260" alt="Sleepy cat">
  <br>
  <em>Work. Break. Repeat. Your brain will thank you. 🧠</em>
</div>

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires ES6+ and permission for Notifications if enabled.

## Deploy
- Serve as static files (GitHub Pages, Vercel, Netlify, or any static host)
- Or just open `index.html` directly for local use

## Credits
- Inspired by pomofocus.io’s simple and effective flow
- Cat gifs lovingly borrowed from GIPHY’s greatest hits

---

> "Focus like a cat on a laser pointer." ✨

