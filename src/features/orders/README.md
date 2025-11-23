# Orders Feature

This feature handles the display of user orders and order details.

## Structure

- `screens/`: Contains the main screens for the feature.
  - `OrdersListScreen.tsx`: Displays a list of the user's orders.
  - `OrderDetailsScreen.tsx`: Displays detailed information about a specific order.

## Components

This feature primarily uses shared components and layout components.

## Usage

The feature is accessed via the `/orders` route (typically from the Profile screen or a tab).
Individual orders are accessed via `/orders/[slug]`.

## Dependencies

- `expo-router`: For navigation.
- `date-fns`: For date formatting.
- Shared API hooks (`getMyOrders`, `getMyOrder`).
- Shared UI components (`AnimatedHeaderLayout`, `StaticHeader`, `NeoView`, `NEO_THEME`).
