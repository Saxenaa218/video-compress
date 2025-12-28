# AutoMart - Used Car Selling Platform

A full-stack used car marketplace built with Next.js, Prisma, and Tailwind CSS.

![AutoMart Homepage](https://github.com/user-attachments/assets/f538a83f-767f-46bb-b1dd-8d80b2be54e3)

## Features

- **Browse Cars**: View all available car listings with search and filter functionality
- **Search & Filter**: Filter cars by make, price range, year, and fuel type
- **Sell Your Car**: Easy-to-use form to list your car for sale
- **Car Details**: Detailed view of each car listing with specifications
- **Contact Seller**: Send inquiries directly to sellers
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Saxenaa218/video-compress.git
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
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── cars/      # Car CRUD endpoints
│   │   │   └── inquiries/ # Inquiry endpoints
│   │   ├── cars/[id]/     # Car detail page
│   │   ├── sell/          # Sell car page
│   │   └── page.tsx       # Homepage
│   ├── components/        # React components
│   │   ├── CarCard.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── SearchFilters.tsx
│   └── lib/
│       ├── prisma.ts      # Prisma client
│       └── types.ts       # TypeScript types
└── package.json
```

## API Endpoints

### Cars
- `GET /api/cars` - Get all cars (with optional filters)
- `POST /api/cars` - Create a new car listing
- `GET /api/cars/[id]` - Get a specific car
- `PUT /api/cars/[id]` - Update a car listing
- `DELETE /api/cars/[id]` - Delete a car listing

### Inquiries
- `POST /api/inquiries` - Submit an inquiry about a car

## Deployment

This application is configured for deployment on Vercel.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

## License

MIT
