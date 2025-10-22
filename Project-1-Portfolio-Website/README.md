# Portfolio Website 💼

<div align="center">
  <img src="https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif" width="300" alt="Cat typing on computer">
  <br>
  <em>Building my portfolio like a pro! 😺</em>
</div>
 
<br>

A modern, responsive portfolio website showcasing projects, resume, and contact information. Built with vanilla JavaScript, HTML5, and CSS3, featuring smooth animations, interactive 3D background, and a clean, professional design.

![Portfolio](https://img.shields.io/badge/vanilla-JavaScript-yellow) ![HTML5](https://img.shields.io/badge/HTML-5-orange) ![CSS3](https://img.shields.io/badge/CSS-3-blue) ![Three.js](https://img.shields.io/badge/Three.js-black)

## Features

🎨 **Modern Design** - Clean, professional UI with smooth animations  
📱 **Fully Responsive** - Mobile-first design that works on all devices  
🌊 **3D Background** - Interactive Vanta.js waves animation  
📂 **Project Showcase** - Featured projects with tech stack and live demos  
📄 **Resume Section** - Embedded PDF viewer with download option  
📧 **Contact Form** - Functional contact form with validation  
♿ **Accessible** - ARIA labels, semantic HTML, keyboard navigation  
🚀 **Fast Loading** - Optimized assets and lazy loading

## Quick Start

<img src="https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif" width="200" align="right" alt="Excited cat">

### Local Development

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **Customize** with your own information

No build process or dependencies required - just open and use.

<br clear="right">

### GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to **Settings** → **Pages**
3. Select **main** branch as source
4. Your portfolio will be live at `https://[username].github.io/Portfolio-Website/`

### Vercel Deployment

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Deploy with one click
4. Your portfolio will be live instantly

## Project Structure

```
Portfolio-Website/
├── index.html                  # Main HTML structure
├── styles.css                  # Styles and responsive design
├── script.js                   # JavaScript for interactions
├── BhushanPawarResume.pdf     # Resume PDF file
├── bhushcodes-favicon/        # Favicon assets
│   ├── apple-touch-icon.png
│   ├── favicon-32x32.png
│   ├── favicon-16x16.png
│   └── site.webmanifest
└── README.md                   # Documentation
```

## Technical Specifications

### Core Technologies
- **HTML5** - Semantic markup with SEO meta tags
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Vanilla JS for interactions
- **Three.js** - 3D graphics library
- **Vanta.js** - Animated 3D backgrounds

### External Libraries
```html
<!-- Three.js for 3D rendering -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>

<!-- Vanta.js for animated background -->
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js"></script>
```

### Key Features Implementation

#### Responsive Navigation
- Mobile hamburger menu
- Smooth scroll to sections
- Active state management
- Keyboard accessible

#### 3D Background Animation
- Vanta.js waves effect
- Responsive to screen size
- Performance optimized
- Graceful fallback

#### Contact Form
- Client-side validation
- Success/error feedback
- Accessible form controls
- Ready for backend integration

## Usage Guide

<div align="center">
  <img src="https://media.giphy.com/media/Ln2dAW9oycjgmTpjX9/giphy.gif" width="250" alt="Cat working on laptop">
  <br>
  <em>Customizing my portfolio like a boss! 🐱</em>
</div>

<br>

### Customizing Content

#### 1. Personal Information
Edit `index.html` to update:
- Name and title in the hero section
- Introduction text
- Contact information (email, phone, location)
- Social media links

#### 2. Projects
Update the projects grid in `index.html`:
```html
<article class="project-card">
  <div class="project-header">
    <h4>Your Project Name</h4>
    <span class="project-year">2024</span>
  </div>
  <p>Project description...</p>
  <div class="tech-stack">
    <span>Tech 1</span>
    <span>Tech 2</span>
  </div>
  <div class="project-links">
    <a href="github-url" class="btn-project github">GitHub</a>
    <a href="demo-url" class="btn-project demo">Live Demo</a>
  </div>
</article>
```

#### 3. Resume
Replace `BhushanPawarResume.pdf` with your own resume PDF file.

#### 4. Favicon
Replace files in `bhushcodes-favicon/` folder with your own favicon assets.

<div align="center">
  <img src="https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif" width="200" alt="Cat celebrating">
  <br>
  <em>Portfolio looking amazing! 🎉</em>
</div>

<br>

### Styling Customization

#### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --text-color: #your-color;
    --background-color: #your-color;
}
```

#### Fonts
Update Google Fonts link in `index.html` and font-family in `styles.css`.

#### Background Animation
Customize Vanta.js settings in `script.js`:
```javascript
VANTA.WAVES({
  el: "#home",
  color: 0x1a1a2e,
  waveHeight: 20,
  waveSpeed: 0.5,
  zoom: 0.75
})
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires ES6+ support and modern CSS features.

## Features in Detail

### Responsive Design
- **Mobile-first approach** - Optimized for small screens
- **Breakpoints** - Tablet (768px), Desktop (1024px)
- **Flexible layouts** - CSS Grid and Flexbox
- **Touch-friendly** - Large tap targets for mobile

### Accessibility
- **Semantic HTML** - Proper heading hierarchy
- **ARIA labels** - Screen reader support
- **Keyboard navigation** - Full keyboard access
- **Focus management** - Visible focus indicators
- **Alt text** - Descriptive image alternatives

### Performance
- **Lazy loading** - Images and iframes load on demand
- **Optimized assets** - Compressed images and fonts
- **Minimal dependencies** - Only essential libraries
- **Fast rendering** - Efficient CSS and JS

### SEO
- **Meta tags** - Title, description, Open Graph
- **Semantic markup** - Proper HTML structure
- **Social sharing** - Twitter Card and OG tags
- **Mobile-friendly** - Responsive design

## Contact Form Integration

The contact form is ready for backend integration. Here are some options:

### Option 1: Formspree
```html
<form action="https://formspree.io/f/your-id" method="POST">
  <!-- form fields -->
</form>
```

### Option 2: Netlify Forms
Add `netlify` attribute to form:
```html
<form name="contact" method="POST" data-netlify="true">
  <!-- form fields -->
</form>
```

### Option 3: Custom Backend
Update the form submission handler in `script.js` to send data to your API endpoint.

## Customization Examples

### Change Hero Background
Replace Vanta.js with a static image or gradient:
```css
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Add More Sections
Follow the existing section structure:
```html
<section class="your-section" id="your-id">
  <div class="section-heading">
    <h3>Section Title</h3>
    <p>Section description</p>
  </div>
  <!-- section content -->
</section>
```

### Modify Navigation
Update nav links in `index.html`:
```html
<ul class="nav-links">
  <li><a href="#section-id">Section Name</a></li>
</ul>
```

## Performance Optimization

### Image Optimization
- Use WebP format for images
- Compress images before upload
- Use appropriate image sizes

### Font Loading
- Preconnect to Google Fonts
- Use font-display: swap
- Limit font weights loaded

### JavaScript
- Defer non-critical scripts
- Use event delegation
- Minimize DOM manipulation

## Security

- ✅ No sensitive data in client-side code
- ✅ Form validation on client and server
- ✅ HTTPS recommended for production
- ✅ Content Security Policy ready

## License

MIT License - Feel free to use for personal or commercial projects.

## Contributing

Suggestions and improvements welcome! This is a portfolio template demonstrating modern web development best practices.

<div align="center">
  <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="250" alt="Cat working on computer">
  <br>
  <em>Ready to build your portfolio? Let's code! 😸</em>
</div>

---

<div align="center">
  <img src="https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif" width="150" alt="Cat typing">
  <br>
  <strong>Built with ❤️ using vanilla JavaScript</strong>
  <br>
  <em>No cats were harmed in the making of this portfolio 🐾</em>
</div>
