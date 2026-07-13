import os
from PIL import Image

image_dir = 'frontend/public/cars'

for filename in os.listdir(image_dir):
    if filename.endswith('.jpg'):
        filepath = os.path.join(image_dir, filename)
        # Open an image file
        with Image.open(filepath) as img:
            # Calculate new size maintaining aspect ratio
            max_size = (1920, 1080)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save it back with high compression
            img.save(filepath, 'JPEG', quality=60, optimize=True)
            print(f"Compressed {filename}")
