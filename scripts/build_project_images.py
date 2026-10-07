from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "project-source"
OUTPUT = ROOT / "public" / "projects"
SIZE = (1600, 1000)


def font(size):
    return ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", size)


def cover(image, size):
    return ImageOps.fit(image.convert("RGBA"), size, Image.Resampling.LANCZOS)


def contain(image, size):
    result = image.convert("RGBA")
    result.thumbnail(size, Image.Resampling.LANCZOS)
    return result


def rounded(image, radius):
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, *image.size), radius=radius, fill=255)
    result = image.copy()
    result.putalpha(mask)
    return result


def save(image, name):
    image.convert("RGB").save(OUTPUT / name, "WEBP", quality=80, method=6)


def losslesso():
    canvas = Image.new("RGBA", SIZE, "#071018")
    glow = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw.ellipse((960, -250, 1750, 540), fill=(53, 178, 255, 80))
    glow = glow.filter(ImageFilter.GaussianBlur(110))
    canvas = Image.alpha_composite(canvas, glow)

    screen = cover(Image.open(SOURCE / "losslesso-home.png"), (1400, 875))
    screen = rounded(screen, 28)
    shadow = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((84, 66, 1516, 974), radius=34, fill=(0, 0, 0, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.alpha_composite(screen, (100, 58))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((100, 58, 151, 65), fill="#57bfff")
    draw.text((1210, 90), "REAL APP CAPTURE", font=font(20), fill=(255, 255, 255, 180))
    save(canvas, "losslesso.webp")


def toka():
    canvas = cover(Image.open(SOURCE / "toka-bg.png"), SIZE)
    overlay = Image.new("RGBA", SIZE, (5, 18, 64, 80))
    canvas = Image.alpha_composite(canvas, overlay)
    draw = ImageDraw.Draw(canvas)
    for x, y, r in [(180, 160, 70), (360, 770, 30), (850, 110, 45), (1430, 720, 90)]:
        draw.ellipse((x-r, y-r, x+r, y+r), outline=(221, 247, 255, 100), width=3)
        draw.ellipse((x-r/2, y-r/2, x+r/2, y+r/2), fill=(255, 255, 255, 30))

    mascot = contain(Image.open(SOURCE / "toka-mascota.png"), (760, 900))
    canvas.alpha_composite(mascot, (820, 65))
    friends = contain(Image.open(SOURCE / "toka-ajolotes.png"), (630, 420))
    canvas.alpha_composite(friends, (40, 555))
    draw = ImageDraw.Draw(canvas)
    draw.text((90, 115), "TOKA", font=font(112), fill="#ffffff")
    draw.text((90, 215), "TRIBE", font=font(112), fill="#ff9dc4")
    draw.text((96, 352), "PRODUCT  /  COMMUNITY  /  REWARDS", font=font(23), fill=(225, 243, 255, 210))
    save(canvas, "toka-tribe.webp")


def enjambre():
    canvas = Image.new("RGBA", SIZE, "#12171c")
    glow = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((740, 80, 1530, 880), fill=(255, 89, 23, 58))
    canvas = Image.alpha_composite(canvas, glow.filter(ImageFilter.GaussianBlur(130)))
    draw = ImageDraw.Draw(canvas)
    for x in range(-300, 1800, 240):
        draw.line((x, 0, x + 600, 1000), fill=(255, 255, 255, 10), width=1)

    cover_art = cover(Image.open(SOURCE / "enjambre-cover.jpg"), (690, 690))
    cover_art = rounded(cover_art, 12)
    canvas.alpha_composite(cover_art, (90, 155))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((760, 120, 1600, 960), fill="#050607", outline=(255, 255, 255, 38), width=3)
    draw.ellipse((820, 180, 1540, 900), outline=(255, 255, 255, 18), width=2)
    draw.ellipse((910, 270, 1450, 810), outline=(255, 255, 255, 18), width=2)
    label = cover(Image.open(SOURCE / "enjambre-vinyl.webp"), (290, 290))
    canvas.alpha_composite(rounded(label, 145), (1030, 395))
    draw = ImageDraw.Draw(canvas)
    draw.text((870, 104), "ENJAMBRE", font=font(70), fill="#ffffff")
    draw.text((875, 185), "INTERACTIVE VINYL EXPERIENCE", font=font(20), fill="#ff7a24")
    save(canvas, "enjambre.webp")


def tournify():
    canvas = cover(Image.open(SOURCE / "tournify-featured.png"), SIZE)
    tint = Image.new("RGBA", SIZE, (1, 7, 10, 72))
    canvas = Image.alpha_composite(canvas, tint)
    header = contain(Image.open(SOURCE / "tournify-header.png"), (1320, 760))
    canvas.alpha_composite(header, (210, 245))
    logo = contain(Image.open(SOURCE / "tournify-logo.png"), (400, 120))
    if logo.width < 200:
        logo = logo.resize((logo.width * 3, logo.height * 3), Image.Resampling.NEAREST)
    canvas.alpha_composite(logo, (90, 90))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((91, 195, 530, 201), fill="#d9ff43")
    draw.text((92, 225), "SPORTS  /  ESPORTS  /  BRACKETS", font=font(21), fill=(255, 255, 255, 215))
    save(canvas, "tournify.webp")


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    losslesso()
    toka()
    enjambre()
    tournify()
    for name in ("losslesso.webp", "toka-tribe.webp", "enjambre.webp", "tournify.webp"):
        path = OUTPUT / name
        print(f"{name}: {path.stat().st_size / 1024:.1f} KB")
