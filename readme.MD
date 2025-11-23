# Project Muse (formerly Ultimate Gadgets Mobile App)

Welcome to the Ultimate Gadgets Mobile App! This is a comprehensive, multi-mall e-commerce platform built with React Native, Expo, and Supabase. It goes beyond simple shopping by offering a multi-location experience, AI-powered virtual try-on, service bookings, and event ticketing.

## 🚀 Key Features

### 🏆 Challenges & UGC
- **Brand Challenges**: Participate in challenges set by businesses to create content.
- **User Generated Content**: Create and submit content to fulfill brand needs.
- **Rewards**: Earn recognition and rewards for winning submissions.

### 🏢 Multi-Mall Experience
- **Multiple Locations**: Switch between different shopping environments like "Molapo Crossing" (Physical Mall) and "Indie Marketplace" (Online Sellers).
- **Context-Aware**: The entire app experience (shops, products, services) adapts to the selected location.

### 🛍️ Advanced Shopping
- **Shop Discovery**: Browse shops with advanced filtering (Categories, Features like Delivery/Collection).
- **Premium Search**: Find products and brands instantly.
- **Interactive Feed**: TikTok-style product discovery feed with social interactions (Like, Save, AI Help).

### 🤖 AI & Innovation
- **Virtual Try-On**: Visualize products on yourself using **Google Gemini AI** (via Vercel AI SDK).
- **AI Assistance**: Smart help for product queries.

### 📅 Services & Events
- **Service Booking**: Book appointments for services (Tech Support, Beauty, etc.) directly with shops.
- **Event Ticketing**: Discover and buy tickets for events hosted at the malls.

### 💳 E-Commerce Essentials
- **Secure Payments**: Integrated Stripe checkout.
- **Order Management**: Track orders and view history.
- **Cart System**: Robust cart with inventory management.

## 🛠️ Tech Stack

- **Framework**: React Native (Expo Managed Workflow)
- **Navigation**: Expo Router (File-based routing)
- **State Management**: Zustand (Client state) & TanStack Query (Server state)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: Vercel AI SDK + Google Gemini
- **Payments**: Stripe React Native SDK

## 📂 Project Structure

- **`src/app`**: Navigation routes (Expo Router). Main flow in `(shop)`.
- **`src/features`**: Complex feature logic.
  - `challenges`, `events`, `profile`, `services`, `orders`
  - `product`, `shop-details`, `cart`, `location-selector`
  - `virtual-try-on`, `appointments`
- **`src/components`**: Reusable UI components.
- **`src/store`**: Global state stores (Zustand).
- **`src/api`**: Data fetching logic (Supabase & React Query).
- **`src/providers`**: Context providers (Auth, Toast, Stripe).

## 🏁 Getting Started

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/laribright/gadgets-app-react-native.git
    cd gadgets-app-react-native
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**
    - Rename `.env.example` to `.env.local` and fill in the required keys:
        - `EXPO_PUBLIC_SUPABASE_URL`
        - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
        - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
        - `GEMINI_API_KEY` (for Virtual Try-On)

4.  **Run the Development Server:**
    ```bash
    npm start
    ```

## 📚 Documentation

- [Virtual Try-On Implementation](VIRTUAL_TRYON_EXPLANATION.md)
- [Malls Feature Guide](MALLS_IMPLEMENTATION.md)
- [Vercel AI SDK Integration](REFACTORED_TO_VERCEL_AI_SDK.md)

## 🎥 Course Video

Watch the full course on YouTube: [Fullstack Gadgets App: React Native Expo & NextJs Admin](https://youtu.be/26opRFPU0a8)
