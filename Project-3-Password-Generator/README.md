# Password Generator 🔐

<div align="center">
  <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" alt="Cat typing on computer">
  <br>
  <em>Creating secure passwords like a cybersecurity pro! 😺</em>
</div>

<br>

A modern, secure password generator with customizable options and real-time strength indicators. Built with vanilla JavaScript, HTML5, and CSS3, featuring cryptographically secure random generation and a beautiful, responsive UI.

![Password Generator](https://img.shields.io/badge/vanilla-JavaScript-yellow) ![HTML5](https://img.shields.io/badge/HTML-5-orange) ![CSS3](https://img.shields.io/badge/CSS-3-blue)

## Features

🔒 **Cryptographically Secure** - Uses `crypto.getRandomValues()` for true randomness  
🎚️ **Adjustable Length** - Generate passwords from 8 to 64 characters  
🔤 **Character Options** - Uppercase, lowercase, numbers, and symbols  
🚫 **Exclude Ambiguous** - Option to avoid confusing characters (0, O, l, I)  
💪 **Strength Indicator** - Real-time visual feedback on password strength  
📋 **One-Click Copy** - Copy passwords to clipboard instantly  
📱 **Fully Responsive** - Mobile-first design that works on all devices  
♿ **Accessible** - Keyboard navigation, ARIA labels, semantic HTML  
🎨 **Modern UI** - Beautiful gradient animations and smooth interactions

## Quick Start

<img src="https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif" width="200" align="right" alt="Excited cat">

### Local Development

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **Start generating secure passwords!**

No build process or dependencies required - just open and use.

<br clear="right">

### GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to **Settings** → **Pages**
3. Select **main** branch as source
4. Your app will be live at `https://[username].github.io/Password-Generator/`

## Project Structure

```
Password-Generator/
├── index.html      # Main HTML structure
├── styles.css      # Styles and animations
├── script.js       # Password generation logic
└── README.md       # Documentation
```

## Technical Specifications

### Character Sets
```javascript
{
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}
```

### Cryptographic Security
- **Random Generation**: `window.crypto.getRandomValues()`
- **Complexity Enforcement**: Ensures at least one character from each selected type
- **No External Calls**: All generation happens locally in browser

### Core Functions

- `generatePassword()` - Create password with selected options
- `ensureComplexity()` - Guarantee character type requirements
- `updateStrength()` - Calculate and display password strength
- `copyToClipboard()` - Copy password with visual feedback
- `showToast()` - Display success/error notifications

## Usage Guide

<div align="center">
  <img src="https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif" width="250" alt="Cat working on laptop">
  <br>
  <em>Me securing all my accounts! 🐱</em>
</div>

<br>

### Generating Passwords
1. Adjust the **length slider** (8-64 characters)
2. Select desired **character types** (uppercase, lowercase, numbers, symbols)
3. Optionally enable **exclude ambiguous characters**
4. Click **Generate Password** or press **Enter**
5. Password appears with strength indicator

### Copying Passwords
1. Click the **copy icon** next to the password
2. Success notification appears
3. Password is ready to paste anywhere

### Understanding Strength
- 🔴 **Weak** - Short length or limited character types
- 🟡 **Medium** - Moderate length with some variety
- 🟢 **Strong** - Long password with diverse characters

<div align="center">
  <img src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif" width="200" alt="Cat celebrating">
  <br>
  <em>When you create the perfect password! 🎉</em>
</div>

<br>

### Keyboard Navigation
- **Tab** - Navigate between controls
- **Enter** - Generate new password
- **Space** - Toggle checkboxes

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires ES6+ support and Web Crypto API.

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
}
```

### Password Length Range
Modify in `index.html`:
```html
<input type="range" id="length" min="8" max="64" value="16">
```

### Character Sets
Update in `script.js`:
```javascript
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};
```

## Features in Detail

### Password Strength Calculation
The strength indicator evaluates based on:
- **Length** - Longer passwords score higher
- **Character Diversity** - Multiple types increase strength
- **Complexity** - Mix of uppercase, lowercase, numbers, symbols

Scoring system:
- Length ≥ 8: +1 point
- Length ≥ 12: +1 point
- Length ≥ 16: +1 point
- Length ≥ 20: +1 point
- Contains lowercase: +1 point
- Contains uppercase: +1 point
- Contains numbers: +1 point
- Contains symbols: +1 point

### Accessibility
- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Focus-visible styles
- Toast notifications for feedback

### Responsive Design
- Mobile-first approach
- Touch-friendly controls
- Adaptive layout for all screens
- Smooth animations

### Security Best Practices
- Cryptographically secure randomness
- Client-side only (no server calls)
- No password storage or logging
- XSS protection via proper escaping

## Password Best Practices

When using this generator:

1. **Use at least 12-16 characters** for strong security
2. **Enable all character types** for maximum complexity
3. **Never reuse passwords** across different accounts
4. **Store passwords securely** using a password manager
5. **Change passwords regularly** for sensitive accounts
6. **Enable two-factor authentication** when available

## Performance

- Lightweight (~25KB total)
- No external dependencies
- Instant generation
- Efficient DOM updates
- Smooth animations

## Security

- ✅ Cryptographically secure random generation
- ✅ No external API calls
- ✅ Client-side only processing
- ✅ No password storage or tracking
- ✅ Safe clipboard operations

## License

MIT License - Feel free to use for personal or commercial projects.

## Contributing

Suggestions and improvements welcome! This is a learning project demonstrating vanilla JavaScript best practices and web security principles.

<div align="center">
 <img src="https://media1.tenor.com/m/cb9L14uH-YAAAAAd/cool-fun.gif" width="250" alt="Cat with glasses coding">
  <br>
  <em>Ready to secure your digital life? Let's code! 😸</em>
</div>

---

<div align="center">
  <img src="https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif" width="150" alt="Typing cat">
  <br>
  <strong>Made with ❤️ by Bhushan Pawar</strong>
  <br>
  <em>No cats were harmed in the making of this app 🐾</em>
</div>
