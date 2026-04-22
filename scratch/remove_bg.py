from PIL import Image
import os

def remove_background(input_path, output_path, bg_color, threshold=30):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Calculate color difference
            diff = abs(item[0] - bg_color[0]) + abs(item[1] - bg_color[1]) + abs(item[2] - bg_color[2])
            if diff < threshold:
                newData.append((255, 255, 255, 0)) # Fully transparent
            else:
                # Basic feathering for edges could be complex, simple threshold for now
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Success: {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# The dark mode image has a black background (0,0,0)
remove_background("ui/public/dark-mode.jpg", "ui/public/dark-mode-transparent.png", (0, 0, 0), threshold=50)

# The light mode image has a white background (255,255,255)
remove_background("ui/public/light-mode.jpg", "ui/public/light-mode-transparent.png", (255, 255, 255), threshold=50)

