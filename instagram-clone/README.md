# Instagram Clone - React Native App

A React Native Instagram clone built with Expo, featuring a modern UI and core Instagram-like functionality.

## Features

- **Home Feed**: View posts from users you follow with like, comment, and share functionality
- **Stories**: Story circles with Instagram-like gradient borders
- **Create Post**: Upload images from gallery or camera with captions, location tags, and user tags
- **Search/Explore**: Search for users and browse explore content
- **Friends/Social**: View following list, discover suggested users, and follow/unfollow functionality
- **Profile**: View your profile with stats (posts, followers, following), edit profile, and post grid
- **User Profiles**: View other users' profiles with follow/message options
- **Comments**: View and add comments on posts
- **Like Posts**: Double-tap or heart button to like/unlike posts

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React Navigation** - Navigation library (bottom tabs + stack navigator)
- **Expo Image Picker** - Image selection from gallery/camera
- **@expo/vector-icons** - Icon library (Ionicons)
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, comes with npx)

### Installation

1. Navigate to the instagram-clone directory:
   ```bash
   cd instagram-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Running the App

- **Web**: `npm run web`
- **iOS**: `npm run ios` (requires macOS with Xcode)
- **Android**: `npm run android` (requires Android Studio)

## Project Structure

```
instagram-clone/
├── App.js                    # Main app entry point
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── PostCard.js       # Individual post component
│   │   ├── StoryCircle.js    # Story avatar component
│   │   └── UserCard.js       # User list item component
│   ├── context/
│   │   └── AppContext.js     # Global state management
│   ├── data/
│   │   └── mockData.js       # Sample data for development
│   ├── navigation/
│   │   └── AppNavigator.js   # Navigation configuration
│   └── screens/
│       ├── HomeScreen.js     # Main feed screen
│       ├── SearchScreen.js   # Search and explore screen
│       ├── CreatePostScreen.js # New post creation screen
│       ├── FriendsScreen.js  # Friends and suggestions screen
│       ├── ProfileScreen.js  # User profile screen
│       ├── UserProfileScreen.js # Other users' profile screen
│       └── CommentsScreen.js # Post comments screen
├── assets/                   # App assets (icons, splash screen)
├── app.json                  # Expo configuration
└── package.json              # Dependencies
```

## Screenshots

The app features an Instagram-like design with:
- Clean white background with subtle borders
- Bottom tab navigation with familiar icons
- Story circles with gradient borders for active stories
- Like/comment/share action buttons on posts
- Following/Followers stats on profiles
- Modern card-based layouts

## Contributing

Feel free to contribute to this project by:
1. Forking the repository
2. Creating a feature branch
3. Committing your changes
4. Opening a pull request

## License

This project is for educational purposes only. Instagram is a trademark of Meta Platforms, Inc.
