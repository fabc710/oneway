# One Way Insurance — Website

Professional, fully responsive marketing website for **One Way Insurance** (US English),
built with semantic HTML5, modern CSS, and vanilla JavaScript — no build step required.
Colors and typography follow the official **Brand Manual** (Prussian Blue, Shamrock green,
Burnt Peach, Tuscan Sun · Inter + Roboto).

---

## 📁 Project structure

```
oneway/
├── index.html              # Home
├── about.html              # About
├── products.html           # Our Products (Home, Auto, Business, Truck, Life)
├── services.html           # Our Services (+ FAQ)
├── blog.html               # Blog listing (3 posts, text-only)
├── article-truck-telematics.html   # Blog post: truck telematics discount
├── article-home-coverage.html      # Blog post: how much home insurance
├── article-bundle-save.html        # Blog post: bundle & save
├── contact.html            # Contact (form + map)
├── README.md
├── css/
│   └── style.css           # All styles (design tokens, components, responsive)
├── js/
│   ├── main.js             # Nav/hamburger, sticky header, scroll reveal, FAQ
│   └── contact.js          # Contact form validation + submit scaffold
└── assets/
    ├── logos/              # Brand logos & favicons (extracted from brand manual)
    │   ├── logo.webp / .png          # Primary logo (Prussian Blue, transparent)
    │   ├── logo-white.webp / .png    # White logo (for dark backgrounds/footer)
    │   ├── symbol.png                # "1" symbol only
    │   ├── favicon.ico
    │   ├── favicon-512.png
    │   └── apple-touch-icon.png
    ├── images/             # All photos/illustrations (WebP)
    ├── icons/              # (Reserved) extra UI icons — most icons are inline SVG
    └── videos/             # (Reserved) background or promo videos
```

---

## 🖼️ Images to replace (all in `assets/images/`, **WebP** format)

The site ships with branded **placeholder** images so it looks complete right away.
To use your own photos, simply **replace each file with the same name** (keep `.webp`).
Recommended sizes are listed below.

| File name              | Where it's used                | Recommended size |
|------------------------|--------------------------------|------------------|
| `hero-home.webp`       | Home hero (portrait)           | 1000 × 1250 px   |
| `about-story.webp`     | About — Our Story              | 1100 × 850 px    |
| `about-values.webp`    | Home + About — Why Us          | 1100 × 850 px    |
| `services-process.webp`| Services — How We Work         | 1100 × 850 px    |
| `services-support.webp`| Services — Support             | 1100 × 850 px    |
| `product-home.webp`    | Products — Home                | 900 × 650 px     |
| `product-auto.webp`    | Products — Auto                | 900 × 650 px     |
| `product-business.webp`| Products — Business            | 900 × 650 px     |
| `product-truck.webp`   | Products — Truck               | 900 × 650 px     |
| `product-life.webp`    | Products — Life                | 900 × 650 px     |
| `testimonial-1.webp` … `-3.webp` | Testimonial avatars  | 240 × 240 px     |
| `og-image.webp`        | Social sharing preview         | 1200 × 630 px    |

> **Blog is text-only** (no images) by design — the 3 posts and their article
> pages use typography, tags and accents instead of photos.

> 💡 Tip: To convert JPG/PNG to WebP, use https://squoosh.app or
> `cwebp input.jpg -q 85 -o output.webp`.

---

## 🔌 Things to connect later

1. **Contact form** → open `js/contact.js` and set `FORM_ENDPOINT` to your handler
   (Formspree, Netlify Forms, or your own API). While empty, the form simulates a
   successful submission so you can preview the experience.

2. **Payment button** (bottom-right) → in **every** `.html` file, find:
   ```html
   <a class="fab fab--pay" id="payment-button" href="#" ...>
   ```
   and replace `href="#"` with your payment link. (Add `target="_blank" rel="noopener"`
   if it should open in a new tab.)

3. **WhatsApp button** is already wired to **+1 (888) 686-5309**
   (`https://wa.me/18886865309`) with a pre-filled message.

4. **Social links** (header + footer) currently point to `#` — replace with your
   real Facebook / Instagram / LinkedIn URLs.

---

## 📞 Company details (already in the site)

- **Phone / WhatsApp:** (888) 686-5309
- **Email:** contact@oneway-insurance.com
- **Register Office:** 150 SE 2nd Ave, Suite 1403, Miami, FL 33131

---

## 🚀 Run locally

It's a static site — just open `index.html` in a browser. For best results
(so relative paths and the map behave), serve it locally:

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

---

## ✨ Features

- Responsive design (mobile, tablet, desktop) with a hamburger menu on mobile
- Sticky header, scroll-reveal animations, FAQ accordion
- Accessible: skip link, ARIA labels, keyboard-friendly nav, reduced-motion support
- SEO-ready: meta descriptions, Open Graph tags, semantic structure
- Floating WhatsApp + Payment buttons on every page
- Brand-accurate colors and typography (Inter + Roboto)
