#!/usr/bin/env python3
from pathlib import Path
from datetime import date
import re
import subprocess
import xml.etree.ElementTree as ET

SITE = "https://marcelloart.site"
SITEMAP = Path("sitemap.xml")
BLOG_DIR = Path("blog")
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
            text=True
        ).strip()
        return out or date.today().isoformat()
    except Exception:
        return date.today().isoformat()

def first_match(pattern, text):
    m = re.search(pattern, text, flags=re.I | re.S)
    return m.group(1).strip() if m else None

tree = ET.parse(SITEMAP)
root = tree.getroot()

existing = {}
for node in root.findall(q("url")):
    loc = node.find(q("loc"))
    if loc is not None and loc.text:
        existing[loc.text.strip()] = node

articles = {}
for path in sorted(BLOG_DIR.glob("*.html")):
    if path.name == "index.html":
        continue

    html = path.read_text(encoding="utf-8")
    robots = first_match(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']', html)
    if robots and "noindex" in robots.lower():
        continue

    canonical = first_match(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html)
    if not canonical or not canonical.startswith(SITE + "/blog/"):
        continue

    articles[canonical] = {
        "path": path,
        "lastmod": git_lastmod(path),
        "image": first_match(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html),
        "title": first_match(r'<title>(.*?)</title>', html),
    }

# Remove stale article URLs, while preserving the /blog/ index entry.
for loc, node in list(existing.items()):
    if loc.startswith(SITE + "/blog/") and loc != SITE + "/blog/" and loc not in articles:
        root.remove(node)
        existing.pop(loc, None)

# Add missing articles and keep lastmod synchronized to the latest commit touching each file.
for loc, info in articles.items():
    node = existing.get(loc)
    if node is None:
        node = ET.SubElement(root, q("url"))
        ET.SubElement(node, q("loc")).text = loc
        ET.SubElement(node, q("lastmod")).text = info["lastmod"]
        ET.SubElement(node, q("changefreq")).text = "monthly"
        ET.SubElement(node, q("priority")).text = "0.8"

        if info["image"]:
            image_node = ET.SubElement(node, iq("image"))
            ET.SubElement(image_node, iq("loc")).text = info["image"]
            if info["title"]:
                clean_title = re.sub(r"\s+[—|-]\s+MarcelloArt\s*$", "", info["title"]).strip()
                ET.SubElement(image_node, iq("title")).text = clean_title
    else:
        lastmod = node.find(q("lastmod"))
        if lastmod is None:
            lastmod = ET.SubElement(node, q("lastmod"))
        lastmod.text = info["lastmod"]

ET.indent(tree, space="  ")
tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)
