const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const body = document.body;
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('primary-navigation');
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const nav = document.querySelector('.navbar');

function setNavVisibility(isVisible) {
  if (!navLinks || !navToggle) return;
  navLinks.dataset.visible = String(isVisible);
  navToggle.setAttribute('aria-expanded', String(isVisible));
  body.classList.toggle('nav-open', isVisible);
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setNavVisibility(!isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavVisibility(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setNavVisibility(false);
    }
  });
}

function handleScroll() {
  if (!nav) return;
  if (window.scrollY > 16) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

handleScroll();
window.addEventListener('scroll', handleScroll, { passive: true });

// Reveal sections animation disabled for tab navigation
// function revealSections() {
//   const revealElements = document.querySelectorAll('.reveal');
//   if (prefersReducedMotion.matches) {
//     revealElements.forEach((el) => el.classList.add('is-visible'));
//     return;
//   }
//   const observer = new IntersectionObserver((entries, obs) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('is-visible');
//         obs.unobserve(entry.target);
//       }
//     });
//   }, {
//     threshold: 0.2,
//     rootMargin: '0px 0px -80px 0px'
//   });
//   revealElements.forEach((el) => observer.observe(el));
// }
// revealSections();

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setStatus(message, type) {
  if (!contactStatus) return;
  contactStatus.textContent = message;
  contactStatus.classList.remove('success', 'error');
  if (type) {
    contactStatus.classList.add(type);
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !message) {
      setStatus('Please complete all fields before submitting.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('Enter a valid email address.', 'error');
      return;
    }

    setStatus('Sending...', '');

    const endpoint = contactForm.dataset.endpoint;

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, message })
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        setStatus('Thanks for reaching out! I will get back to you shortly.', 'success');
        contactForm.reset();
      } catch (error) {
        console.error(error);
        setStatus('Sorry, something went wrong. Please try again later or email me directly.', 'error');
      }
    } else {
      setStatus('Form validation passed. Connect EmailJS or your backend to send messages.', 'success');
      contactForm.reset();
    }
  });
}

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear().toString();
}

// Animated font changes for hero title - 20 Google Fonts cycling every 0.8s
function animateFontChanges() {
  const nameElement = document.querySelector('.hero-text h1');
  if (!nameElement) return;

  const fonts = [
    "'Inter', sans-serif",
    "'Roboto', sans-serif",
    "'Open Sans', sans-serif",
    "'Montserrat', sans-serif",
    "'Lato', sans-serif",
    "'Poppins', sans-serif",
    "'Oswald', sans-serif",
    "'Raleway', sans-serif",
    "'Merriweather', serif",
    "'Playfair Display', serif",
    "'Ubuntu', sans-serif",
    "'Nunito', sans-serif",
    "'Quicksand', sans-serif",
    "'Bebas Neue', cursive",
    "'Indie Flower', cursive",
    "'Lobster', cursive",
    "'Pacifico', cursive",
    "'Righteous', cursive",
    "'Permanent Marker', cursive",
    "'Caveat', cursive"
  ];

  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % fonts.length;
    nameElement.style.fontFamily = fonts[currentIndex];
  }, 800);
}

animateFontChanges();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 80; // navbar height
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }
    
    // Close mobile menu if open
    setNavVisibility(false);
  });
});

// Vanta.js Waves Animation
let vantaEffect = null;

function initVanta() {
  const heroElement = document.querySelector('.hero');
  if (!heroElement || !window.VANTA || !window.THREE) return;

  // Destroy existing effect if it exists
  if (vantaEffect) {
    vantaEffect.destroy();
  }

  const colors = {
    color: 0x1a4d7a,
    backgroundColor: 0x0f1728,
    waveSpeed: 0.78,
    shininess: 50,
    waveHeight: 18,
    zoom: 0.78
  };

  vantaEffect = VANTA.WAVES({
    el: heroElement,
    THREE: window.THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: colors.color,
    backgroundColor: colors.backgroundColor,
    waveSpeed: colors.waveSpeed,
    shininess: colors.shininess,
    waveHeight: colors.waveHeight,
    zoom: colors.zoom
  });
}

// Initialize Vanta after page loads
window.addEventListener('load', () => {
  setTimeout(initVanta, 100);
});
