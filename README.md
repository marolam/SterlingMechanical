# SterlingMechanical
Barry's Website

## About

A simple, mobile-friendly single-page website for **Sterling Mechanical** — a small mechanical service company. Designed to be linked from a QR code on a business card.

### Features
- Contact section (phone, email, website, Facebook)
- Google Reviews link
- **Request a Quote** form with drag-and-drop photo upload
- Responsive design (works on all screen sizes)

## Deployment

The site is three plain files: `index.html`, `styles.css`, `script.js`. They can be hosted on any static hosting service (GitHub Pages, Netlify, etc.).

### Configuring the Quote Form

The quote form uses [Formspree](https://formspree.io) to handle submissions without a backend.

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form — Formspree will give you a form endpoint like `https://formspree.io/f/xyzabc`.
3. In `index.html`, find the `<form>` tag and replace the placeholder action URL:

```html
<!-- Before -->
action="https://formspree.io/f/YOUR_FORM_ID"

<!-- After (example) -->
action="https://formspree.io/f/xyzabc"
```

4. Update the contact details (phone number, email, social links) directly in `index.html`.
