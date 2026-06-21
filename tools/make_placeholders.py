"""
Generate cohesive brand placeholder images for One Way Insurance.
Palette: Prussian Blue + Emerald (no yellow). Output: WebP.
These are TEMPORARY placeholders — replace with real photos (same filenames).
Run:  python tools/make_placeholders.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "images")
OUT = os.path.abspath(OUT)
os.makedirs(OUT, exist_ok=True)

PRUSSIAN = (5, 38, 66)
PRUSSIAN7 = (10, 52, 87)
SHAMROCK = (1, 150, 109)
EMERALD = (14, 164, 125)
SURFACE = (238, 243, 246)
INK = (13, 20, 28)
WHITE = (255, 255, 255)


def font(size, bold=True):
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    ]
    for c in candidates:
        try:
            return ImageFont.truetype(c, size)
        except Exception:
            continue
    return ImageFont.load_default()


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(w, h, c1, c2, diagonal=True):
    """Vertical or diagonal linear gradient."""
    base = Image.new("RGB", (w, h), c1)
    top = Image.new("RGB", (w, h), c2)
    mask = Image.new("L", (w, h))
    md = mask.load()
    for y in range(h):
        for x in range(0, w, 4):  # step for speed; fill 4px blocks
            if diagonal:
                t = (x / w + y / h) / 2
            else:
                t = y / h
            v = int(t * 255)
            for dx in range(4):
                if x + dx < w:
                    md[x + dx, y] = v
    base.paste(top, (0, 0), mask)
    return base


def center_text(draw, box, text, fnt, fill):
    l, t, r, b = draw.textbbox((0, 0), text, font=fnt)
    tw, th = r - l, b - t
    x = box[0] + (box[2] - box[0] - tw) / 2 - l
    y = box[1] + (box[3] - box[1] - th) / 2 - t
    draw.text((x, y), text, font=fnt, fill=fill)


def watermark_one(img, color, alpha=42):
    """Draw a large translucent '1' motif (the brand symbol)."""
    w, h = img.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = font(int(h * 0.9))
    d.text((int(w * 0.04), int(h * 0.02)), "1", font=f, fill=color + (alpha,))
    img.paste(Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB"), (0, 0))


def make_card(name, w, h, label, sub="ONE WAY INSURANCE",
              c1=PRUSSIAN, c2=EMERALD, mark=True):
    img = gradient(w, h, c1, c2)
    if mark:
        watermark_one(img, WHITE, alpha=30)
    d = ImageDraw.Draw(img)
    # accent rule
    d.rectangle([int(w * 0.08), int(h * 0.60), int(w * 0.08) + 54, int(h * 0.60) + 5],
                fill=EMERALD if c1 == PRUSSIAN else WHITE)
    fl = font(max(22, int(h * 0.085)))
    fs = font(max(13, int(h * 0.032)))
    d.text((int(w * 0.08), int(h * 0.64)), label, font=fl, fill=WHITE)
    d.text((int(w * 0.08), int(h * 0.64) + int(h * 0.10)), sub, font=fs, fill=(210, 225, 235))
    img.save(os.path.join(OUT, name), "WEBP", quality=86)
    print("wrote", name)


def make_avatar(name, size=240, initials="OW"):
    img = gradient(size, size, PRUSSIAN, SHAMROCK)
    d = ImageDraw.Draw(img)
    center_text(d, (0, 0, size, size), initials, font(int(size * 0.42)), WHITE)
    img.save(os.path.join(OUT, name), "WEBP", quality=86)
    print("wrote", name)


# Hero (portrait)
make_card("hero-home.webp", 1000, 1250, "Protect What Matters", c1=PRUSSIAN, c2=SHAMROCK)

# About / services / cta (landscape)
for n, lbl in [
    ("about-story.webp", "Our Story"),
    ("about-values.webp", "What Sets Us Apart"),
    ("services-process.webp", "How We Work"),
    ("services-support.webp", "Always Here for You"),
    ("cta-advisor.webp", "Talk to an Advisor"),
]:
    make_card(n, 1100, 850, lbl)

# Products
for n, lbl in [
    ("product-home.webp", "Home Insurance"),
    ("product-auto.webp", "Auto Insurance"),
    ("product-business.webp", "Business Insurance"),
    ("product-truck.webp", "Truck Insurance"),
    ("product-life.webp", "Personal Life Insurance"),
]:
    make_card(n, 900, 650, lbl)

# NOTE: The blog is text-only (no images), so no blog-*.webp are generated.

# OG image
make_card("og-image.webp", 1200, 630, "One Way Insurance",
          sub="Protect What Matters", c1=PRUSSIAN, c2=SHAMROCK)

# Avatars
for n, ini in [("testimonial-1.webp", "JM"), ("testimonial-2.webp", "SR"),
               ("testimonial-3.webp", "DT"), ("author-1.webp", "OW")]:
    make_avatar(n, 240, ini)

print("Done. All placeholders regenerated with navy + emerald palette.")
