# Instagram Clone

A full-featured Instagram clone built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and NextAuth.js.

## Features

- 🔐 **Authentication** - Sign up, login, and logout with secure credentials
- 📝 **Posts** - Create, view, like, and comment on posts
- 📷 **Image Upload** - Upload images for posts, stories, and profile pictures
- 👤 **User Profiles** - View profiles, edit bio, and see post grids
- 👥 **Follow System** - Follow and unfollow other users
- 📰 **Feed** - View posts from users you follow with infinite scroll
- 📖 **Stories** - Create and view ephemeral stories (24 hours)
- 💬 **Direct Messages** - Send and receive private messages
- 🔔 **Notifications** - Get notified about likes, comments, and new followers
- 🔍 **Search** - Find users by username or name
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
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

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser

### First Steps

1. Register a new account at `/register`
2. Login at `/login`
3. Start creating posts and following other users!

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── profile/[username] # User profile pages
│   ├── post/[postId]      # Individual post pages
│   ├── create/            # Create post/story page
│   ├── search/            # Search page
│   ├── messages/          # Direct messages
│   ├── notifications/     # Notifications page
│   ├── stories/           # Stories viewer
│   └── accounts/          # Account settings
├── components/            # Reusable React components
│   ├── layout/           # Layout components (Navbar, MainLayout)
│   ├── posts/            # Post-related components
│   └── stories/          # Story components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client instance
│   └── auth.ts           # NextAuth configuration
├── providers/            # React context providers
└── types/                # TypeScript type definitions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Posts
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[postId]` - Get single post
- `DELETE /api/posts/[postId]` - Delete post
- `POST /api/posts/[postId]/like` - Like post
- `DELETE /api/posts/[postId]/like` - Unlike post
- `GET /api/posts/[postId]/comments` - Get comments
- `POST /api/posts/[postId]/comments` - Add comment

### Users
- `GET /api/users/[username]` - Get user profile
- `PATCH /api/users/[username]` - Update profile
- `GET /api/users/[username]/posts` - Get user posts
- `POST /api/users/[username]/follow` - Follow user
- `DELETE /api/users/[username]/follow` - Unfollow user
- `GET /api/users/search` - Search users

### Stories
- `GET /api/stories` - Get stories
- `POST /api/stories` - Create story

### Messages
- `GET /api/messages` - Get conversations
- `GET /api/messages/[conversationId]` - Get messages
- `POST /api/messages/[conversationId]` - Send message

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications` - Mark as read

### Upload
- `POST /api/upload` - Upload image

## License

MIT
