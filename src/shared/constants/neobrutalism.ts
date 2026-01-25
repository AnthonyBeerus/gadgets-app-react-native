/**
 * Muse Brand Design Tokens
 * @see .agent/skills/brand-guidelines/SKILL.md
 */
export const NEO_THEME = {
  colors: {
    // Nuvia Brand Colors (Pastel Pop)
    primary: "#A78BFA",           // Lilac Purple (Brand Primary)
    secondary: "#FCD34D",         // Soft Yellow (Golden Blush)
    accent: "#F472B6",            // Cotton Candy Pink
    mint: "#6EE7B7",              // Lime Bloom/Mint
    sky: "#7DD3FC",               // Sky Drift Blue

    // UI Colors
    dark: "#1A202C",              // Primary Text / Blacks
    black: "#000000",             // Borders & Shadows
    white: "#FFFFFF",             // Pure White
    background: "#F5F3FF",        // Very light lilac tint background
    backgroundLight: "#FFFFFF",   // Cards
    
    // Semantic
    success: "#4ADE80",
    warning: "#FBBF24",
    error: "#F87171",
    info: "#60A5FA",

    // Legacy Aliases (mapped to new palette)
    vibrantOrange: "#F472B6",     // Mapped to Pink
    electricBlue: "#7DD3FC",      // Mapped to Sky
    gemGold: "#FCD34D",
    gemShine: "#FEF3C7",
    grey: "#9CA3AF",
    greyLight: "#F3F4F6",
    lightGray: "#F3F4F6",
    midGray: "#9CA3AF",
    cardDark: "#1F2937",
    red: "#F87171",
    yellow: "#FCD34D",
    blue: "#60A5FA",
    pink: "#F472B6",
  },
  pastels: [
    "#A78BFA", // Lilac
    "#FCD34D", // Yellow
    "#F472B6", // Pink
    "#6EE7B7", // Mint
    "#7DD3FC", // Blue
    "#FDBA74", // Orange
  ],
  borders: {
    width: 2,           // Slightly cleaner border (2px vs 3px)
    radius: 16,         // Rounded corners (Nuvia Style)
    circle: 9999,
  },
  shadows: {
    // CSS boxShadow format
    hard: "4px 4px 0px #000000",
    hardSmall: "2px 2px 0px #000000",
    soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    // Native
    hardLegacy: {
      shadowColor: "#000",
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    softLegacy: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  fonts: {
    // Body text - Inter (UI utility)
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    black: "Inter_700Bold", // Alias for legacy compatibility
    // Display fonts - Poppins (Personality/Headlines)
    displaySemibold: "Poppins_600SemiBold",
    displayBold: "Poppins_700Bold",
    displayBlack: "Poppins_900Black",
  },
};
