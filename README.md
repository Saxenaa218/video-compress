# FeedbackFlow - Customer Feedback & Survey Tools

A powerful platform to gather customer feedback and analyze results, similar to SurveyMonkey or Typeform. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Create Surveys**: Build professional surveys with multiple question types
  - Rating scales (1-5 stars)
  - NPS (Net Promoter Score) 0-10
  - Multiple choice (single selection)
  - Checkboxes (multiple selections)
  - Short text answers
  - Long text/textarea responses

- **Collect Responses**: Share surveys and collect responses in real-time
  - Required and optional questions
  - Form validation
  - Optional respondent email collection

- **Analyze Results**: View detailed analytics and insights
  - Response counts and distributions
  - Average scores for rating questions
  - Bar chart visualizations
  - Text response listings

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── surveys/       # Survey CRUD API routes
│   │   └── responses/     # Response submission API
│   ├── surveys/
│   │   ├── create/        # Survey creation page
│   │   ├── respond/[id]/  # Take survey page
│   │   └── results/[id]/  # Survey analytics page
│   ├── page.tsx           # Home/landing page
│   └── layout.tsx         # Root layout
├── lib/
│   └── store.ts           # In-memory data store
└── types/
    └── survey.ts          # TypeScript type definitions
```

## API Endpoints

### Surveys
- `GET /api/surveys` - List all surveys
- `POST /api/surveys` - Create a new survey
- `GET /api/surveys/[id]` - Get a specific survey
- `GET /api/surveys/[id]?analytics=true` - Get survey with analytics
- `PUT /api/surveys/[id]` - Update a survey
- `DELETE /api/surveys/[id]` - Delete a survey

### Responses
- `GET /api/responses?surveyId=[id]` - Get responses for a survey
- `POST /api/responses` - Submit a survey response

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **UUID** - Unique identifier generation

## Sample Data

The application comes with two pre-configured sample surveys:
1. Customer Satisfaction Survey
2. Website Feedback Form

These can be used to test the functionality right away.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
