# Product Feature

This feature handles the display of individual product details.

## Structure

- `screens/`: Contains `ProductDetailsScreen.tsx`.
- `components/`: Contains product-specific components (e.g., `ProductVariants`, `ImageCarousel`).

## Usage

Accessed via `/product/[slug]`.
Displays product information, images, variants, and allows adding to cart.

## Dependencies

- `expo-router`
- Shared UI components (`StaticHeader`, `NeoButton`)
- `virtual-try-on` feature integration
