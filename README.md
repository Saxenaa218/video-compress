# Bookmark Manager

A full-stack bookmark manager application built with Next.js, featuring advanced filtering, tag system, and search functionality.

## Features

- **Add bookmarks** with title, description, URL, and tags
- **View all bookmarks** with details (favicon, title, URL, description, tags, view count, last visited, date added)
- **Search bookmarks** by title with debouncing
- **Filter by tags** - single or multiple tag filtering
- **View and manage archived bookmarks**
- **Pin/unpin bookmarks** to keep important ones at the top
- **Edit bookmark details**
- **Copy URLs to clipboard**
- **Sort** by recently added, recently visited, or most visited
- **Toggle light/dark themes**
- **Automatic favicon fetching** for new bookmarks
- **URL metadata extraction** - auto-fill title and description from URL

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Features**: Many-to-many tag relationships, view count tracking, archive/pin status

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd video-compress
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── bookmarks/      # Bookmark CRUD endpoints
│   │   ├── tags/           # Tag management endpoints
│   │   └── metadata/       # URL metadata extraction
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BookmarkCard.tsx    # Individual bookmark display
│   ├── BookmarkModal.tsx   # Add/Edit bookmark modal
│   ├── EmptyState.tsx      # Empty state display
│   ├── Header.tsx          # App header with theme toggle
│   ├── SearchBar.tsx       # Search and sort controls
│   └── TagFilter.tsx       # Tag filtering component
├── hooks/
│   ├── useBookmarks.ts     # Bookmark state management
│   ├── useDebounce.ts      # Debounce utility hook
│   └── useTheme.ts         # Theme management hook
├── lib/
│   └── prisma.ts           # Prisma client singleton
└── types/
    └── index.ts            # TypeScript type definitions
```

## Database Schema

The application uses SQLite with Prisma ORM featuring:

- **Bookmark**: id, title, description, url, favicon, isPinned, isArchived, viewCount, lastVisited, createdAt, updatedAt
- **Tag**: id, name, color, createdAt
- **BookmarkTag**: Many-to-many relationship between bookmarks and tags

## API Endpoints

### Bookmarks
- `GET /api/bookmarks` - List bookmarks with filtering, sorting, and search
- `POST /api/bookmarks` - Create a new bookmark
- `GET /api/bookmarks/[id]` - Get a bookmark (also increments view count)
- `PUT /api/bookmarks/[id]` - Update a bookmark
- `DELETE /api/bookmarks/[id]` - Delete a bookmark

### Tags
- `GET /api/tags` - List all tags with bookmark counts
- `POST /api/tags` - Create a new tag
- `PUT /api/tags/[id]` - Update a tag
- `DELETE /api/tags/[id]` - Delete a tag

### Metadata
- `POST /api/metadata` - Extract title, description, and favicon from a URL

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
