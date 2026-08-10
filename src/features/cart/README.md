# Cart Feature

This feature handles the shopping cart functionality.

## Structure

- `screens/`: Contains `OrderSuccessScreen.tsx`. The bag lives at `/bag` (`features/discovery/screens/bag-screen.tsx`).
- `components/`: Contains cart item and summary components.
- `store/`: Contains `useCartStore` for state management.

## Usage

Accessed via the cart icon or `/cart` route.
Allows users to view added items, adjust quantities, and proceed to checkout.

## Dependencies

- `zustand` (for state management)
- Shared UI components
