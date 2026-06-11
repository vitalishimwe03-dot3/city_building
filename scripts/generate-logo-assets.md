# Generate Retina Logo and Favicon

This project prefers a vector `logo.svg` for crisp rendering. If you want a 2x raster image and favicon, run one of the commands below on your development machine.

Requirements
- ImageMagick (recommended) OR Node.js + `sharp` installed.

Using ImageMagick (quick):

```bash
# Create a 2x PNG from existing PNG
magick public/images/logo.png -resize 200% public/images/logo@2x.png

# Create a 48x48 PNG favicon
magick public/images/logo.png -resize 48x48 public/favicon-48.png

# Convert to ICO (contains 16x16, 32x32, 48x48)
magick public/images/logo.png -define icon:auto-resize=64,48,32,16 public/favicon.ico
```

Using Node + sharp

```bash
# Install sharp
npm install --save-dev sharp

# Run the following node script (create and run scripts/generate-assets.js)
node scripts/generate-assets.js
```

If you'd like, I can add a ready `scripts/generate-assets.js` that uses `sharp` — tell me if you want that and I will create it.
