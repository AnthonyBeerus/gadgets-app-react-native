import { NEO_THEME } from '../neobrutalism';

/**
 * Tests to verify design tokens match Brand Guidelines specification
 * @see .agent/skills/brand-guidelines/SKILL.md
 */
describe('NEO_THEME Design Tokens', () => {
  describe('Primary Brand Colors', () => {
    it('should have correct Deep Purple primary color', () => {
      expect(NEO_THEME.colors.primary).toBe('#6B46C1');
    });

    it('should have correct Vibrant Orange accent', () => {
      expect(NEO_THEME.colors.vibrantOrange).toBe('#FF6B35');
    });

    it('should have correct Electric Blue secondary', () => {
      expect(NEO_THEME.colors.electricBlue).toBe('#4A90E2');
    });
  });

  describe('Gem Economy Colors', () => {
    it('should have correct Gem Gold for currency/rewards', () => {
      expect(NEO_THEME.colors.gemGold).toBe('#F6AD55');
    });

    it('should have correct Gem Shine for highlights', () => {
      expect(NEO_THEME.colors.gemShine).toBe('#FBD38D');
    });
  });

  describe('Semantic Colors', () => {
    it('should have correct Success Green', () => {
      expect(NEO_THEME.colors.success).toBe('#48BB78');
    });

    it('should have correct Warning Orange', () => {
      expect(NEO_THEME.colors.warning).toBe('#ED8936');
    });

    it('should have correct Error Red', () => {
      expect(NEO_THEME.colors.error).toBe('#F56565');
    });

    it('should have correct Info Blue', () => {
      expect(NEO_THEME.colors.info).toBe('#4299E1');
    });
  });

  describe('Dark Mode Colors', () => {
    it('should have correct dark background color', () => {
      expect(NEO_THEME.colors.dark).toBe('#1A202C');
    });

    it('should have correct dark card background', () => {
      expect(NEO_THEME.colors.cardDark).toBe('#2D3748');
    });
  });

  describe('Border Configuration', () => {
    it('should have 3px neubrutalist borders', () => {
      expect(NEO_THEME.borders.width).toBe(3);
    });

    it('should have 0 border radius for hard edges', () => {
      expect(NEO_THEME.borders.radius).toBe(0);
    });
  });

  describe('Shadow Configuration', () => {
    it('should have CSS boxShadow format for hard shadow', () => {
      expect(NEO_THEME.shadows.hard).toBe('4px 4px 0px #1A202C');
    });

    it('should have legacy format available for migration', () => {
      expect(NEO_THEME.shadows.hardLegacy).toBeDefined();
      expect(NEO_THEME.shadows.hardLegacy.shadowOpacity).toBe(1);
      expect(NEO_THEME.shadows.hardLegacy.shadowRadius).toBe(0);
    });
  });
});
