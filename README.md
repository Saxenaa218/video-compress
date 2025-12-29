# Testimonial - Video Testimonial Collection Platform

A modern web application that allows users to create topics and collect video testimonials with star ratings from their customers.

## Features

- **User Authentication**: Secure login and registration using NextAuth.js
- **Topic Management**: Create, view, and delete topics for collecting testimonials
- **Shareable Links**: Generate unique links for each topic to share with customers
- **Video Recording**: Customers can record video testimonials directly in their browser
- **Star Ratings**: 1-5 star rating system for testimonials
- **Text Testimonials**: Written feedback along with video testimonials
- **Dashboard**: View all topics and testimonials in one place

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js with credentials provider
- **Database**: MongoDB with Mongoose ODM
- **Video Recording**: MediaRecorder API

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance (local or MongoDB Atlas)

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

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/testimonial
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. **Sign Up/Sign In**: Create an account or log in to your existing account
2. **Create a Topic**: From the dashboard, create a new topic for collecting testimonials
3. **Share the Link**: Copy the unique review link and share it with your customers
4. **Collect Testimonials**: Customers can visit the link to:
   - Record a video testimonial
   - Add a star rating (1-5 stars)
   - Write a text testimonial
5. **View Testimonials**: Access all collected testimonials from your dashboard

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── topics/          # Topics CRUD endpoints
│   │   └── testimonials/    # Testimonials endpoints
│   ├── auth/                # Auth pages (signin, signup)
│   ├── dashboard/           # User dashboard
│   ├── review/[slug]/       # Public review submission page
│   └── topics/[id]/         # Topic details & testimonials view
├── components/
│   ├── providers/           # Context providers
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utility functions
├── models/                  # Mongoose models
└── types/                   # TypeScript type definitions
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_URL` | The base URL of your application |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js session encryption |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deploy on Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com).

1. Push your code to a Git repository
2. Import your repository to Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy!

## License

MIT
