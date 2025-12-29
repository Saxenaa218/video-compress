# Quiz Application

A modern, interactive quiz application built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

### ✅ Implemented Features

- **📝 Quiz Interface**: Clean and intuitive interface displaying questions, answer choices, and progress indicators
- **🎯 Interactive Quizzes**: Users can select answers with immediate visual feedback
- **📊 Progress Tracking**: Real-time progress bar and question navigation
- **⏱️ Timer Feature**: Countdown timer for timed quizzes with automatic submission on timeout
- **🎲 Question Randomization**: Questions are randomized for each quiz attempt
- **🔀 Shuffled Answer Options**: Answer options are shuffled to prevent memorization
- **📈 Results Page**: 
  - Displays quiz score, percentage, and time spent
  - Shows correct vs incorrect answers
  - Provides detailed explanations for each question
- **📱 Review Answers**: 
  - Expandable section to review all questions and answers
  - Highlights correct and incorrect answers
  - Shows explanations for better learning
- **🔗 Social Media Sharing**: 
  - Share quiz results on Twitter, Facebook, and LinkedIn
  - Pre-formatted sharing messages with scores
- **🎨 Modern UI**: 
  - Gradient backgrounds
  - Responsive design for all screen sizes
  - Dark mode support
  - Smooth transitions and animations

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI**: React 19.2.3
- **Build Tool**: Turbopack

## Project Structure

```
video-compress/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page listing all quizzes
│   ├── quiz/[id]/         # Dynamic quiz route
│   │   └── page.tsx       # Individual quiz page
│   └── results/           # Results page
│       └── page.tsx       # Quiz results and review
├── components/            # React components
│   └── QuizInterface.tsx  # Main quiz interface component
├── data/                  # Quiz data
│   └── quiz.json         # Quiz questions and answers
├── lib/                   # Utility functions
│   └── quiz-utils.ts     # Quiz helper functions
├── types/                 # TypeScript type definitions
│   └── quiz.ts           # Quiz-related types
└── public/               # Static assets
```

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

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Available Quizzes

The application comes with two sample quizzes:

1. **General Knowledge Quiz**: 10 questions, 5 minutes
2. **Science Quiz**: 5 questions, 4 minutes

## Adding New Quizzes

To add a new quiz, edit the `data/quiz.json` file:

```json
{
  "quizzes": [
    {
      "id": 3,
      "title": "Your Quiz Title",
      "description": "Quiz description",
      "timeLimit": 300,
      "questions": [
        {
          "id": 1,
          "question": "Your question?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": 0,
          "explanation": "Explanation of the correct answer"
        }
      ]
    }
  ]
}
```

## Features in Detail

### Quiz Taking Experience

1. **Question Navigation**: 
   - Next/Previous buttons
   - Direct navigation via numbered buttons
   - Visual indicators for answered questions

2. **Timer**: 
   - Countdown display in MM:SS format
   - Color changes when time is running low
   - Auto-submit when timer reaches zero

3. **Answer Selection**:
   - Radio button style interface
   - Visual feedback on selection
   - Ability to change answers before moving forward

### Results and Review

1. **Score Summary**:
   - Percentage score
   - Number of correct answers
   - Time spent on quiz
   - Pass/fail indicator

2. **Answer Review**:
   - All questions with selected and correct answers
   - Color-coded feedback (green for correct, red for incorrect)
   - Detailed explanations for each question

3. **Social Sharing**:
   - One-click sharing to major social platforms
   - Pre-formatted messages with scores

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is open source and available under the MIT License.

## Screenshots

### Home Page
![Home Page](https://github.com/user-attachments/assets/be9ebb02-055c-4706-892c-ecca35e3ee65)

### Quiz Interface
![Quiz Interface](https://github.com/user-attachments/assets/ed9cec12-4d9d-431c-88e9-e241f52f9cea)

### Results Page
![Results Page](https://github.com/user-attachments/assets/8b9b5119-44e1-4c8c-a96c-87d8e379adcb)

### Review Answers
![Review Answers](https://github.com/user-attachments/assets/c366f55e-d404-45e7-bb23-236540119acd)

