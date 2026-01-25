import { lightTheme, darkTheme } from '../theme';
import { NEO_THEME } from '../neobrutalism';

describe('Theme Configuration', () => {
  describe('Light Theme', () => {
    it('should have mode "light"', () => {
      expect(lightTheme.mode).toBe('light');
    });

    it('should match NEO_THEME colors for base tokens', () => {
      expect(lightTheme.colors.primary).toBe(NEO_THEME.colors.primary);
    });

    it('should have correct semantic colors', () => {
      expect(lightTheme.colors.background).toBe('#FFFFFF');
      expect(lightTheme.colors.text).toBe('#000000');
    });
  });

  describe('Dark Theme', () => {
    it('should have mode "dark"', () => {
      expect(darkTheme.mode).toBe('dark');
    });

    it('should have correct semantic colors', () => {
      expect(darkTheme.colors.background).toBe(NEO_THEME.colors.dark);
      expect(darkTheme.colors.text).toBe('#FFFFFF');
    });

    it('should have high contrast border', () => {
      expect(darkTheme.colors.border).toBe('#E2E8F0');
    });
  });
});
