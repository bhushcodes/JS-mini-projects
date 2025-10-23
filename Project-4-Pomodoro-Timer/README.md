# Pomodoro Timer 🍅

<div align="center">
  <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" alt="Cat typing on computer">
  <br>
  <em>When you're in deep focus mode and nothing can stop you! 😺</em>
</div>

<br>

A feature-rich Pomodoro Timer built with vanilla JavaScript, HTML, and CSS. Stay focused, track your productivity, and take breaks at the right time with customizable sessions, sound alerts, desktop notifications, and beautiful animated themes.

![Pomodoro Timer](https://img.shields.io/badge/vanilla-JavaScript-yellow) ![HTML5](https://img.shields.io/badge/HTML-5-orange) ![CSS3](https://img.shields.io/badge/CSS-3-blue)

## Features

### Core Timer Features
⏱️ **Configurable Durations** - Customize work (default 25min), short break (5min), and long break (15min)  
🔄 **Session Cycles** - Automatic long break after N work sessions (default 4)  
▶️ **Smart Controls** - Start/Pause, Reset, Skip Break with one click  
🔊 **Sound Alerts** - Completion sounds with volume control and mute toggle  
🎵 **Ticking Sound** - Optional subtle ticking during countdown  
🔔 **Desktop Notifications** - Get notified when tab is unfocused  
🚀 **Auto-start** - Automatically begin next session (toggle on/off)

### UI/UX Features
🎨 **Animated Progress Ring** - Beautiful circular progress indicator  
📊 **Today's Stats** - Track completed sessions, focus time, and streaks  
📈 **Weekly Chart** - Visual bar chart showing your productivity  
🌓 **Dark/Light Theme** - Toggle themes with system preference detection  
⌨️ **Keyboard Shortcuts** - Space, R, S, M for quick actions  
📱 **Fully Responsive** - Mobile-first design, works on all devices  
♿ **Accessible** - ARIA labels, semantic HTML, focus management

### Technical Features
⚡ **Drift Compensation** - Accurate timing using `performance.now()`  
💾 **Persistent Storage** - Settings and stats saved to localStorage  
🔄 **Tab Sleep Handling** - Resync time when returning to tab  
✅ **Input Validation** - 1-120 minute range with inline errors  
🎯 **No Scroll Window** - Fixed height, no vertical scrolling

## Quick Start

<img src="https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif" width="200" align="right" alt="Excited cat">

### Local Development

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **Start focusing!**

No build process or dependencies required - just open and use.

<br clear="right">

### GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to **Settings** → **Pages**
3. Select **main** branch as source
4. Your app will be live at `https://[username].github.io/Pomodoro-Timer/`

## Project Structure

```
Project-4-Pomodoro-Timer/
├── index.html      # Main HTML with semantic markup
├── styles.css      # Styles, themes, animations, responsive design
├── app.js          # Application logic with modular architecture
├── assets/         # Icons and audio files (optional)
└── README.md       # Documentation
```

## Technical Specifications

### State Model
```javascript
{
  phase: 'work' | 'shortBreak' | 'longBreak',
  isRunning: boolean,
  isPaused: boolean,
  remainingTime: number,        // seconds
  currentSession: number,
  completedSessions: number,
  totalFocusTime: number,       // minutes
  longestStreak: number,
  settings: { /* ... */ },
  weeklyStats: { Mon: 0, ... }
}
```

### localStorage Keys
- **Key**: `pomodoro:v1:state`
- **Format**: JSON object with settings, stats, and session data

### Core Modules

**State Module** - Manages timer state, sessions, and statistics  
**Timer Module** - Handles countdown with drift compensation  
**Storage Module** - Persists data to localStorage  
**UI Module** - Updates DOM and handles user interactions  
**Audio Module** - Plays sounds using Web Audio API  
**Notify Module** - Desktop notifications with fallback banner

## Usage Guide

<div align="center">
  <img src="https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif" width="250" alt="Cat working on laptop">
  <br>
  <em>Me getting things done with the Pomodoro technique 🐱</em>
</div>

<br>

### Starting a Session
1. Click **Start** or press **Space**
2. Timer begins countdown
3. Progress ring animates smoothly
4. Stay focused until completion sound

### Pausing & Resuming
1. Click **Pause** or press **Space** while running
2. Timer preserves exact remaining time
3. Click **Resume** to continue

### Resetting
1. Click **Reset** or press **R**
2. Timer returns to session start time
3. Progress ring resets

### Skipping Breaks
1. During break, click **Skip** or press **S**
2. Immediately starts next work session
3. (Skip button disabled during work sessions)

<div align="center">
  <img src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif" width="200" alt="Cat celebrating">
  <br>
  <em>When you complete a full Pomodoro cycle! 🎉</em>
</div>

<br>

### Keyboard Shortcuts
- **Space** - Start/Pause timer
- **R** - Reset timer
- **S** - Skip break
- **M** - Mute/Unmute sounds

### Customizing Settings
1. Scroll to **Settings** section
2. Adjust work/break durations (1-120 minutes)
3. Change sessions before long break (1-10)
4. Toggle auto-start, ticking sound, notifications
5. Adjust volume with slider
6. Settings save automatically

### Theme Toggle
- Click **sun/moon icon** in top-right
- Switches between light and dark themes
- Respects system preference on first load
- Choice persists across sessions

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires ES6+, Web Audio API, Notifications API, and localStorage.

## Features in Detail

### Accurate Timer with Drift Compensation

Traditional `setInterval` can drift over time. This timer uses:
- `performance.now()` for high-precision timestamps
- `requestAnimationFrame` for smooth updates
- Elapsed time calculation to prevent drift
- Automatic resync on tab focus

### Session Tracking

**Work Sessions**: Count toward daily completed sessions  
**Breaks**: Don't count as completed sessions  
**Cycles**: After N work sessions, trigger long break  
**Streaks**: Track consecutive completed sessions  
**Weekly Stats**: Bar chart shows last 7 days

### Daily Reset

Stats automatically reset at midnight:
- Completed sessions → 0
- Total focus time → 0
- Current streak → 0
- Weekly stats persist

### Desktop Notifications

When tab is unfocused:
1. Request permission on first enable
2. Show native notification at session end
3. Click notification to focus window
4. Fallback to banner if permission denied

### Sound System

**Completion Sound**: Pleasant ascending notes (C5, E5, G5)  
**Ticking Sound**: Subtle 800Hz tone every second  
**Web Audio API**: Synthesized sounds, no external files  
**Volume Control**: 0-100% with mute toggle  
**User Gesture**: Audio context created on first click

### Responsive Design

**Mobile (< 480px)**:
- Smaller timer (240px)
- Stacked controls
- Single-column layout

**Tablet (480-767px)**:
- Medium timer (280px)
- Flexible grid

**Desktop (≥ 768px)**:
- Large timer (320px)
- Two-column layout
- Full-width timer section

### Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus-visible outlines
- Screen reader friendly
- High contrast mode support
- Reduced motion support

### Animated Background

Gradient background with smooth color transitions:
- 4 gradient colors
- 15-second animation cycle
- 15% opacity overlay
- Adapts to theme

## Customization

### Changing Default Durations

Edit in `app.js`:
```javascript
settings: {
    workDuration: 25,           // minutes
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4
}
```

### Modifying Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --color-work: #ef4444;
    --color-short-break: #10b981;
    --color-long-break: #3b82f6;
    --color-accent: #8b5cf6;
}
```

### Adjusting Progress Ring

Change radius in `styles.css` and `app.js`:
```css
/* CSS */
.progress-ring-circle {
    /* Update cx, cy, r values */
}
```
```javascript
// JavaScript
const circumference = 2 * Math.PI * 140; // Update radius
```

### Storage Key Namespace

Change in `app.js`:
```javascript
const Storage = {
    prefix: 'pomodoro:v1:',  // Update version
    // ...
}
```

## Performance

- Lightweight (~50KB total uncompressed)
- No external dependencies
- Fast load time
- Efficient DOM updates
- RequestAnimationFrame for smooth animations
- Minimal reflows/repaints

## Security

- XSS protection via proper escaping
- No external API calls
- Client-side only (no server)
- Safe localStorage usage
- No eval() or dangerous patterns

## Data Persistence

All data saved to localStorage:
- Settings (durations, toggles, volume, theme)
- Stats (sessions, focus time, streaks)
- Weekly data (last 7 days)
- Current session state

**Auto-save triggers**:
- Setting changes
- Session completion
- Every 30 seconds (periodic)
- Before page unload

**Note**: Clearing browser data removes all saved information.

## Edge Cases Handled

✅ Multiple concurrent timers prevented  
✅ Tab sleep/visibility changes  
✅ Invalid input validation  
✅ Negative time prevented  
✅ Audio context user gesture requirement  
✅ Notification permission denial  
✅ localStorage quota exceeded  
✅ Daily stats reset at midnight

## Browser Permissions

**Notifications**: Optional, requested when enabled  
**Audio**: Auto-enabled on first user click  
**localStorage**: Required for persistence

## License

MIT License - Feel free to use for personal or commercial projects.

## Contributing

Suggestions and improvements welcome! This is a learning project demonstrating vanilla JavaScript best practices and the Pomodoro Technique.

<div align="center">
  <img src="https://media1.tenor.com/m/cb9L14uH-YAAAAAd/cool-fun.gif" width="250" alt="Cat with glasses coding">
  <br>
  <em>Ready to boost your productivity? Let's focus together! 😸</em>
</div>

---

<div align="center">
  <img src="https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif" width="150" alt="Typing cat">
  <br>
  <strong>Made with ❤️ and 🍅 by Bhushan Pawar</strong>
  <br>
  <em>Built during many Pomodoro sessions 🐾</em>
</div>
