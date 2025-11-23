# Challenges Feature

## Overview
The Challenges feature allows users to participate in brand-sponsored content creation challenges to win rewards. Users can browse active challenges, view details, and submit their entries.

## Structure
- `components/`: UI components specific to challenges (e.g., `ChallengeCard`)
- `screens/`: Screen components (e.g., `ChallengesScreen`)
- `store/`: State management for challenges (Zustand)
- `types/`: TypeScript definitions
- `api/`: API integration (currently mocked in store)

## Dependencies
- `shared/components/ui`: Uses `NeoView` and other shared UI components
- `shared/constants`: Uses `NEO_THEME` for styling

## Testing
Run tests using `npm test` (tests to be implemented).
