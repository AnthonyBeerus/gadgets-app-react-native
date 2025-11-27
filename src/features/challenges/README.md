# Challenges Feature

## Overview
The Challenges feature allows users to participate in brand-sponsored content creation challenges to win rewards. Users can browse active challenges, filter them, view details, and submit entries.

## Structure
```
challenges/
├── components/
│   ├── challenge-card.tsx      # Card component for challenge list
│   └── FilterChip.tsx           # Filter chip component
├── screens/
│   ├── ChallengeDetailsScreen.tsx       # Full challenge details
│   ├── ChallengeEntryScreen.tsx         # Entry submission form
│   ├── ChallengesExploreScreen.tsx      # Main browse/filter screen
│   ├── ChallengesLeaderboardScreen.tsx  # Leaderboard (placeholder)
│   └── ChallengesMyEntriesScreen.tsx    # User's entries (placeholder)
├── store/
│   └── challenge-store.ts       # Zustand state management
├── types/
│   └── challenge.ts             # TypeScript definitions
└── README.md
```

## Features
- **Browse Challenges**: View all available challenges with filtering
- **Filter System**: Filter by Free/Premium/AI Allowed/Ending Soon
- **Challenge Details**: View requirements, rewards, and deadlines
- **Entry Submission**: Submit content with AI tool integration
- **Monetization**: Gem-based premium challenges and AI tools

## Dependencies
- `shared/components/ui`: Uses `NeoView` and other shared UI components
- `shared/constants`: Uses `NEO_THEME` for styling
- `shared/context`: Uses `CollapsibleTabContext` for animated headers
- `zustand`: State management

## State Management
The feature uses Zustand for state management (`challenge-store.ts`):
- `challenges`: Array of challenge objects
- `loading`: Loading state for async operations
- `fetchChallenges()`: Fetch challenges (currently mocked)

## Integration
App routes are in `src/app/challenges/` and `src/app/(shop)/challenges/` which serve as connectors to the feature screens.
