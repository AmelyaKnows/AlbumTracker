# Album Tracker

A React web app for finding albums, previewing their tracks, and keeping a personal listening log. Search the iTunes catalog, play 30-second previews in a built-in mini player, and save albums with a status, star rating, and notes.

<!-- Add a screenshot or GIF here once you have one:
![Album Tracker screenshot](docs/screenshot.png)
-->

**Live demo:** _add your deployed link here_

## Features

- **Search** albums and artists using the iTunes Search API (no account or API key needed)
- **Album pages** with cover art, release year, genre, and a full track list
- **Preview playback** of 30-second clips with a persistent mini player (play/pause, previous/next, seek bar) that keeps playing while you browse
- **Collection tracker** that saves albums with a status (Want to listen, Listening, Listened), a 1-5 star rating, and personal notes
- **Filter and sort** your collection by status, title, artist, or rating
- **Where to listen** links that open the album on Spotify, YouTube, or Apple Music
- **Saved locally** in your browser with `localStorage`, so there is no backend or login

## Tech stack

- [React 18](https://react.dev/) with hooks and the Context API
- [Vite](https://vitejs.dev/) for development and builds
- [iTunes Search API](https://performance-partners.apple.com/search-api) for album and track data
- Plain CSS (no UI library)

## Getting started

**Requirements:** [Node.js](https://nodejs.org/) 18 or newer.

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/album-tracker.git
cd album-tracker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open the URL Vite prints in the terminal (usually http://localhost:5173).

### Other scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |

## Project structure

```
src/
├── components/
│   ├── AlbumCard.jsx       # Album tile used in search and collection grids
│   ├── Navbar.jsx          # Top navigation
│   ├── Player.jsx          # Mini player bar
│   ├── Stars.jsx           # Star rating input
│   ├── StatusSelect.jsx    # Listening status buttons
│   └── TrackList.jsx       # Track list with play buttons
├── context/
│   ├── CollectionContext.jsx   # Saved albums (status, rating, notes)
│   └── PlayerContext.jsx       # Audio element, queue, and playback state
├── hooks/
│   └── useLocalStorage.js      # State that persists in localStorage
├── pages/
│   ├── Discover.jsx        # Search and results
│   ├── AlbumDetail.jsx     # Track list and save/rate controls
│   └── Collection.jsx      # Saved albums with filters
├── services/
│   └── itunes.js           # All API calls and link helpers
├── App.jsx                 # Page switching with useState (no router)
├── index.css
└── main.jsx
```

## How it works

- **Data:** `services/itunes.js` calls the iTunes Search and Lookup endpoints directly from the browser. Search returns albums, and lookup returns an album's tracks with preview URLs.
- **Playback:** `PlayerContext` owns a single `Audio` element. Clicking a track sets a queue and index, and the provider handles play/pause, next/previous, progress, and auto-advancing when a clip ends. Because it lives above the pages, playback continues as you navigate.
- **Collection:** `CollectionContext` stores saved albums in an object keyed by album ID and syncs it to `localStorage` through `useLocalStorage`.
- **Navigation:** Pages switch with a `useState` value in `App.jsx`. The Discover page stays mounted (hidden) so your search results are still there when you come back.

## Limitations

- Previews are **30 seconds**. That is the most the iTunes API provides, and full-song streaming is only available through licensed services such as Spotify or Apple Music.
- Your collection is stored in your browser only. Clearing site data removes it, and it does not sync between devices.
- Some tracks and albums have no preview available, and their play buttons are disabled.

## Roadmap

- [ ] Spotify embed for full-album playback when logged in to Spotify
- [ ] Shareable URLs with React Router
- [ ] Export and import the collection as JSON
- [ ] Song-level search
- [ ] Dark/light theme toggle

## Disclaimer

This is a personal learning project and is not affiliated with or endorsed by Apple, Spotify, or YouTube. Album data, artwork, and audio previews are provided by the iTunes Search API and belong to their respective owners.

## License

Released under the [MIT License](LICENSE). Add a `LICENSE` file to the repo, or change this section to the license you prefer.