#!/usr/bin/env python3
"""Generate Chrome Web Store assets: screenshots and promotional tiles."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "screenshots"
SCREENSHOT_EN = ASSETS / "popup-en.png"
SCREENSHOT_JA = ASSETS / "popup-ja.png"
ICON = ROOT / "icons" / "icon128.png"
OUT = ROOT / "store-screenshots"

GREEN = (76, 175, 80)
DARK = (33, 33, 33)
GRAY = (117, 117, 117)
BG = (248, 250, 248)

FONT_EN_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_EN_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_JA = "/System/Library/Fonts/Hiragino Sans GB.ttc"


def load_font(locale: str, size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    if locale == "ja":
        return ImageFont.truetype(FONT_JA, size, index=0)
    path = FONT_EN_BOLD if bold else FONT_EN_REGULAR
    return ImageFont.truetype(path, size)


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines: list[str] = []
    for paragraph in text.split("\n"):
        current = ""
        for char in paragraph:
            candidate = current + char
            if font.getlength(candidate) <= max_width:
                current = candidate
            else:
                if current:
                    lines.append(current)
                current = char
        if current:
            lines.append(current)
    return lines


def trim_whitespace(img: Image.Image, threshold: int = 250, pad: int = 10) -> Image.Image:
    """Crop to non-white content bounding box."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    pixels = rgb.load()
    min_x, min_y = w, h
    max_x, max_y = 0, 0

    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r < threshold or g < threshold or b < threshold:
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

    if max_x <= min_x or max_y <= min_y:
        return img

    return rgb.crop(
        (
            max(0, min_x - pad),
            max(0, min_y - pad),
            min(w, max_x + pad + 1),
            min(h, max_y + pad + 1),
        )
    )


def build_popup_card(src_path: Path, max_w: int, max_h: int) -> Image.Image:
    popup = trim_whitespace(Image.open(src_path)).convert("RGBA")
    pw, ph = popup.size
    scale = min(max_w / pw, max_h / ph)
    new_size = (int(pw * scale), int(ph * scale))
    popup = popup.resize(new_size, Image.Resampling.LANCZOS)

    pad = 16
    card = Image.new("RGBA", (new_size[0] + pad * 2, new_size[1] + pad * 2), (255, 255, 255, 255))
    card.paste(popup, (pad, pad), popup)

    shadow_offset = 4
    framed = Image.new(
        "RGBA",
        (card.size[0] + shadow_offset, card.size[1] + shadow_offset),
        (0, 0, 0, 0),
    )
    shadow = Image.new("RGBA", card.size, (0, 0, 0, 40))
    framed.paste(shadow, (shadow_offset, shadow_offset), shadow)
    framed.paste(card, (0, 0), card)
    return framed


def compose_store_image(
    src_path: Path,
    locale: str,
    config: dict,
    out_name: str,
    size: tuple[int, int] = (1280, 800),
) -> None:
    W, H = size
    right_margin = 100
    top_margin = 56
    left_margin = 64
    gap = 48

    max_popup_w = 300
    max_popup_h = H - 130
    card = build_popup_card(src_path, max_popup_w, max_popup_h)

    card_x = W - right_margin - card.size[0]
    card_y = (H - card.size[1]) // 2
    text_max_width = card_x - left_margin - gap

    canvas = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([0, 0, 6, H], fill=GREEN)

    title_font = load_font(locale, 48, bold=(locale == "en"))
    sub_font = load_font(locale, 24)
    bullet_font = load_font(locale, 20)
    tag_font = load_font(locale, 16)

    y = top_margin + 24
    draw.text((left_margin, y), config["title"], fill=DARK, font=title_font)
    y += 62

    for line in wrap_text(config["subtitle"], sub_font, text_max_width):
        draw.text((left_margin, y), line, fill=GREEN, font=sub_font)
        y += 34
    y += 18

    for bullet in config["bullets"]:
        lines = wrap_text(bullet, bullet_font, text_max_width - 24)
        for i, line in enumerate(lines):
            if i == 0:
                draw.ellipse([left_margin, y + 7, left_margin + 8, y + 15], fill=GREEN)
                draw.text((left_margin + 20, y), line, fill=GRAY, font=bullet_font)
            else:
                draw.text((left_margin + 20, y), line, fill=GRAY, font=bullet_font)
            y += 30
        y += 8

    for line in wrap_text(config["tag"], tag_font, text_max_width):
        draw.text((left_margin, H - 52), line, fill=GRAY, font=tag_font)

    canvas.paste(card, (card_x, card_y), card)

    out_path = OUT / out_name
    canvas.save(out_path, "PNG")
    print(f"Saved {out_path} ({canvas.size}, {canvas.mode})")


def draw_gradient_bg(canvas: Image.Image, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> None:
    """Vertical gradient background."""
    draw = ImageDraw.Draw(canvas)
    w, h = canvas.size
    for y in range(h):
        ratio = y / max(h - 1, 1)
        color = tuple(int(top[i] + (bottom[i] - top[i]) * ratio) for i in range(3))
        draw.line([(0, y), (w, y)], fill=color)


def paste_icon(canvas: Image.Image, size: int, x: int, y: int) -> None:
    icon = Image.open(ICON).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    canvas.paste(icon, (x, y), icon)


def compose_small_promo_tile(out_name: str = "promo-tile-small-440x280.png") -> None:
    """440x280 small promotional tile."""
    W, H = 440, 280
    canvas = Image.new("RGB", (W, H), (250, 252, 250))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([0, 0, 4, H], fill=GREEN)

    title_font = load_font("en", 32, bold=True)
    sub_font = load_font("en", 14)
    tag_font = load_font("en", 11)

    left = 30
    draw.text((left, 62), "Cycle Counter", fill=DARK, font=title_font)
    draw.text((left, 104), "Auto-incrementing", fill=GREEN, font=sub_font)
    draw.text((left, 122), "daily counter", fill=GREEN, font=sub_font)
    draw.text((left, 168), "Savings • Learning • Stamina", fill=GRAY, font=tag_font)

    paste_icon(canvas, 100, W - 122, (H - 100) // 2)

    out_path = OUT / out_name
    canvas.save(out_path, "PNG")
    print(f"Saved {out_path} ({canvas.size}, {canvas.mode})")


def compose_marquee_promo_tile(
    src_path: Path,
    out_name: str = "promo-tile-marquee-1400x560.png",
) -> None:
    """1400x560 marquee promotional tile — clean, minimal layout."""
    W, H = 1400, 560
    canvas = Image.new("RGB", (W, H), (252, 253, 252))
    draw = ImageDraw.Draw(canvas)

    # Subtle top accent line
    draw.rectangle([0, 0, W, 3], fill=GREEN)

    # Soft decorative circle (very subtle)
    draw.ellipse([980, -80, 1380, 320], fill=(241, 248, 241))

    left = 96
    title_font = load_font("en", 58, bold=True)
    sub_font = load_font("en", 24)
    feature_font = load_font("en", 18)
    tag_font = load_font("en", 15)

    paste_icon(canvas, 72, left, 88)

    text_x = left + 92
    draw.text((text_x, 96), "Cycle Counter", fill=DARK, font=title_font)
    draw.text((text_x, 168), "Auto-incrementing daily counter", fill=GREEN, font=sub_font)

    features = "Savings  ·  Learning  ·  Stamina  ·  Private & local"
    draw.text((text_x, 228), features, fill=GRAY, font=feature_font)

    draw.line([(text_x, 280), (text_x + 420, 280)], fill=(224, 232, 224), width=1)
    draw.text(
        (text_x, 304),
        "Badge display  ·  Custom cycles  ·  EN / JA",
        fill=(158, 158, 158),
        font=tag_font,
    )

    # Single popup preview — centered on the right half
    card = build_popup_card(src_path, 300, H - 120)
    card_x = W - card.size[0] - 96
    card_y = (H - card.size[1]) // 2
    canvas.paste(card, (card_x, card_y), card)

    out_path = OUT / out_name
    canvas.save(out_path, "PNG")
    print(f"Saved {out_path} ({canvas.size}, {canvas.mode})")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    compose_store_image(
        SCREENSHOT_EN,
        "en",
        {
            "title": "Cycle Counter",
            "subtitle": "Auto-incrementing daily counter",
            "bullets": [
                "Track savings, learning & stamina",
                "Live value on toolbar badge",
                "Custom cycle & daily rate",
                "Data stays on your device",
            ],
            "tag": "English UI  •  Japanese available in settings",
        },
        "screenshot-en-1280x800.png",
    )

    compose_store_image(
        SCREENSHOT_JA,
        "ja",
        {
            "title": "Cycle Counter",
            "subtitle": "毎日自動で増えるカウンター",
            "bullets": [
                "貯金・学習・スタミナ管理に",
                "ツールバーバッジに現在値を表示",
                "増加量・周期・開始日を自由設定",
                "データは端末内のみに保存",
            ],
            "tag": "日本語 UI  •  設定から English に切替可能",
        },
        "screenshot-ja-1280x800.png",
    )

    for name in ["screenshot-en-1280x800.png", "screenshot-ja-1280x800.png"]:
        img = Image.open(OUT / name).convert("RGB")
        small = img.resize((640, 400), Image.Resampling.LANCZOS)
        small_path = OUT / name.replace("1280x800", "640x400")
        small.save(small_path, "PNG")
        print(f"Saved {small_path}")

    compose_small_promo_tile()
    compose_marquee_promo_tile(SCREENSHOT_EN)


if __name__ == "__main__":
    main()
