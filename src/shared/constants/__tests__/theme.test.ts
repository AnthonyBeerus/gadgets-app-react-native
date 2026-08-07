import { lightTheme, darkTheme } from '../theme';
import { NEO_THEME } from '../neobrutalism';
import { colors } from '../../design-system/tokens';

describe('Theme Configuration', () => {
  describe('Light Theme', () => {
    it('should have mode "light"', () => {
      expect(lightTheme.mode).toBe('light');
    });

    it('should match NEO_THEME colors for base tokens', () => {
      expect(lightTheme.colors.primary).toBe(NEO_THEME.colors.primary);
    });

    it('should use quiet commerce canvas and ink', () => {
      expect(lightTheme.colors.background).toBe(colors.canvas);
      expect(lightTheme.colors.text).toBe(colors.ink);
      expect(lightTheme.colors.border).toBe(colors.border);
    });
  });

  describe('Dark Theme', () => {
    it('should have mode "dark"', () => {
      expect(darkTheme.mode).toBe('dark');
    });

    it('should have correct semantic colors', () => {
      expect(darkTheme.colors.background).toBe(colors.darkCanvas);
      expect(darkTheme.colors.text).toBe(colors.darkInk);
      expect(darkTheme.colors.white).toBe(colors.darkSurface);
      expect(darkTheme.colors.black).toBe(colors.darkInk);
    });

    it('should use dark border token', () => {
      expect(darkTheme.colors.border).toBe(colors.darkBorder);
    });
  });
});
