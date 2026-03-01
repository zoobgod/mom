# Mom Birthday Story Website

Minimal, slide-based birthday story website with:
- left-side emotional text
- right-side fullscreen memory videos
- click-through flow
- accent-color animations between slides
- background music triggered on first user interaction

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Replace with your real media

Put these files in `public/`:

- `public/media/videos/01-welcome.mp4`
- `public/media/videos/02-childhood.mp4`
- `public/media/videos/03-strength.mp4`
- `public/media/videos/04-final-main.mp4`
- `public/media/music/main-track.mp3`

If music does not start automatically, the page shows a "Tap to start music" button (browser autoplay safety).

## Customize text and colors

Edit slide content in:

- `src/App.jsx` (array `slides`)

Adjust visual style in:

- `src/App.css`
