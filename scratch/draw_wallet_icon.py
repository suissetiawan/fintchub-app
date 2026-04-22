from PIL import Image, ImageDraw

def create_rounded_rect(width, height, radius, color):
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([(0, 0), (width, height)], radius, fill=color)
    return img

def draw_wallet_path(draw, padding, scale, offset_x, offset_y, color):
    # Scale and translate path manually
    # Wallet SVG path logic simplified: just drawing lines and curves is hard without an SVG library
    # Let's use cairosvg or reportlab to render SVG if installed, otherwise simplified PIL drawing.
    pass

# We can actually just use Python to rasterize the SVG.
import subprocess
svg_content = """<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Rounded blue background -->
  <rect x="50" y="50" width="924" height="924" rx="200" fill="#2563eb"/>
  
  <!-- Centered White Wallet Icon -->
  <g transform="translate(262, 262) scale(20.8)">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-5.45 7.49" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 9.6V20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 15a3 3 0 0 1 3-3h4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 15v-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21 15v-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21 11h-4a2 2 0 0 0 0 4h4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>"""

with open('scratch/fincthub_icon.svg', 'w') as f:
    f.write(svg_content)
