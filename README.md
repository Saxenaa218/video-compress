# Markdown Editor

An in-browser markdown editor with live preview, document management, and export functionality. Built with Next.js, PostgreSQL, and Prisma.

![Markdown Editor Screenshot](https://github.com/user-attachments/assets/266af3a8-f906-4188-a1c1-581a32d8702f)

## Features

- **Live Preview**: Split-pane editor layout with real-time markdown rendering
- **Document Management**: Create, read, update, and delete markdown documents
- **Version History**: Track document changes with built-in versioning system
- **Export Options**: Export documents to HTML or PDF
- **Full-page Preview**: Toggle between edit and preview modes
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + S` - Save document
  - `Ctrl/Cmd + P` - Toggle preview mode
  - `Escape` - Exit full-screen preview
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Editor**: CodeMirror with markdown syntax highlighting
- **Markdown Rendering**: react-markdown with GFM support and code highlighting
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Export**: jsPDF and html2canvas for PDF generation

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

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

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/markdown_editor"
   ```

4. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Document
- `id` - Unique identifier
- `name` - Document name
- `content` - Markdown content
- `folderId` - Optional folder reference
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### DocumentVersion
- `id` - Unique identifier
- `documentId` - Reference to parent document
- `content` - Version content
- `version` - Version number
- `createdAt` - Creation timestamp

### Folder
- `id` - Unique identifier
- `name` - Folder name
- `parentId` - Optional parent folder reference
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## API Endpoints

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Create a new document
- `GET /api/documents/[id]` - Get a specific document
- `PUT /api/documents/[id]` - Update a document
- `DELETE /api/documents/[id]` - Delete a document
- `GET /api/documents/[id]/versions` - Get document version history

### Folders
- `GET /api/folders` - List all folders
- `POST /api/folders` - Create a new folder

### Export
- `POST /api/export` - Convert markdown to HTML

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── documents/
│   │   ├── export/
│   │   └── folders/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── MarkdownEditor.tsx
│   ├── MarkdownEditorPage.tsx
│   ├── MarkdownPreview.tsx
│   ├── Sidebar.tsx
│   └── VersionHistoryModal.tsx
└── lib/
    ├── prisma.ts
    └── types.ts
prisma/
└── schema.prisma
```

## License

MIT
