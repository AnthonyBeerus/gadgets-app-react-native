import { NEO_THEME } from './neobrutalism';

// Define the extended color type
type BaseColors = typeof NEO_THEME.colors;
type ThemeColors = BaseColors & {
  background: string;
  card: string;
  text: string;
  border: string;
};

// Define the full Theme type
export type Theme = Omit<typeof NEO_THEME, 'colors'> & {
  colors: ThemeColors;
  mode: 'light' | 'dark';
};

export const lightTheme: Theme = {
  ...NEO_THEME,
  mode: 'light',
  colors: {
    ...NEO_THEME.colors,
    background: '#FFFFFF', // White background
    card: '#FFFFFF',      // White cards
    text: '#000000',      // Black text
    border: NEO_THEME.colors.black,
  },
};

export const darkTheme: Theme = {
  ...NEO_THEME,
  mode: 'dark',
  colors: {
    ...NEO_THEME.colors,
    background: NEO_THEME.colors.dark,    // #1A202C
    card: NEO_THEME.colors.cardDark,      // #2D3748
    text: '#FFFFFF',                      // White text
    border: '#E2E8F0',                    // Light Gray for borders in dark mode
  },
};
