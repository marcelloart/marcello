#!/usr/bin/env python3
# Managed by GitHub Actions workflow: Keep sitemap in sync
from datetime import date
from pathlib import Path
from html import unescape
import re
import subprocess
import xml.etree.ElementTree as ET

SITE = "https://marcelloart.site"
SITEMAP = Path("sitemap.xml")
BLOG_INDEX = SITE + "/blog/"
SM_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
IMG_NS = "http://www.google.com/schemas/sitemap-image/1.1"

ET.register_namespace("", SM_NS)
ET.register_namespace("image", IMG_NS)


def q(tag):
    return f"{{{SM_NS}}}{tag}"


def iq(tag):
    return f"{{{IMG_NS}}}{tag}"


def git_lastmod(path):
    try:
        out = subprocess.check_output(
            ["git", "log", "-1", "--format=%cs", "--", str(path)],
            text=True,
        ).strip()
        return out or date.today().isoformat()
    except Exception:
        return date.today().isoformat()


def first_match(pattern, text):
    match = re.search(pattern, text, flags=re.I | re.S)
    return match.group(1).strip() if match else None


def add_image(node, image, title):
    image_node = ET.SubElement(node, iq("image"))
    ET.SubElement(image_node, iq("loc")).text = image
    if title:
        clean_title = re.sub(
            r"\s+[—|-]\s+MarcelloArt\s*$", "", unescape(title)
        ).strip()
        ET.SubElement(image_node, iq("title")).text = clean_title


tree = ET.parse(SITEMAP)
root = tree.getroot()

existing = {}
for node in root.findall(q("url")):
    loc = node.find(q("loc"))
    if loc is not None and loc.text:
        existing[loc.text.strip()] = node

# Build a canonical-to-file map for every indexable HTML page, not just blog posts.
pages = {}
for path in sorted(Path(".").rglob("*.html")):
    if ".git" in path.parts:
        continue

    html = path.read_text(encoding="utf-8")
    robots = first_match(
        r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)', html
    )
    if robots and "noindex" in robots.lower():
        continue

    canonical = first_match(
        r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)', html
    )
    if not canonical or (
        not canonical.startswith(SITE + "/") and canonical != SITE
    ):
        continue

    pages[canonical] = {
        "path": path,
        "lastmod": git_lastmod(path),
        "image": first_match(
            r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)',
            html,
        ),
        "title": first_match(r"<title>(.*?)</title>", html),
    }

articles = {
    loc: info
    for loc, info in pages.items()
    if loc.startswith(SITE + "/blog/") and loc != BLOG_INDEX
}

# Remove stale article URLs, while preserving the /blog/ index entry.
for loc, node in list(existing.items()):
    if loc.startswith(SITE + "/blog/") and loc != BLOG_INDEX and loc not in articles:
        root.remove(node)
        existing.pop(loc, None)

# Add newly published articles while retaining the existing URL inventory elsewhere.
for loc, info in articles.items():
    if loc not in existing:
        node = ET.SubElement(root, q("url"))
        ET.SubElement(node, q("loc")).text = loc
        ET.SubElement(node, q("changefreq")).text = "monthly"
        ET.SubElement(node, q("priority")).text = "0.8"
        existing[loc] = node

# Refresh dates for every sitemap URL that maps to a tracked, indexable HTML page.
# Keep image sitemap records for the blog index as authored; sync article images to
# each article's current Open Graph featured image.
for loc, node in existing.items():
    info = pages.get(loc)
    if not info:
        continue

    lastmod = node.find(q("lastmod"))
    if lastmod is None:
        lastmod = ET.SubElement(node, q("lastmod"))
    lastmod.text = info["lastmod"]

    if loc.startswith(SITE + "/blog/") and loc != BLOG_INDEX:
        for image_node in list(node.findall(iq("image"))):
            node.remove(image_node)
        if info["image"]:
            add_image(node, info["image"], info["title"])

ET.indent(tree, space="  ")
tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)
