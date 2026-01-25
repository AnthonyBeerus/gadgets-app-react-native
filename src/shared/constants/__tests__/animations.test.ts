import { DURATION, STAGGER, EASING, TIMING_CONFIG, SCROLL_THRESHOLDS, SCALE, OPACITY } from '../animations';

describe('Animation Constants', () => {
  describe('DURATION', () => {
    it('should export duration presets', () => {
      expect(DURATION.fast).toBe(150);
      expect(DURATION.normal).toBe(250);
      expect(DURATION.slow).toBe(400);
      expect(DURATION.header).toBe(200);
    });
  });

  describe('STAGGER', () => {
    it('should export stagger delays', () => {
      expect(STAGGER.fast).toBe(30);
      expect(STAGGER.normal).toBe(50);
      expect(STAGGER.slow).toBe(80);
    });
  });

  describe('EASING', () => {
    it('should export easing functions', () => {
      expect(typeof EASING.out).toBe('function');
      expect(typeof EASING.inOut).toBe('function');
      expect(typeof EASING.linear).toBe('function');
    });
  });

  describe('TIMING_CONFIG', () => {
    it('should export timing configs with duration and easing', () => {
      expect(TIMING_CONFIG.fast.duration).toBe(150);
      expect(TIMING_CONFIG.normal.duration).toBe(250);
      expect(TIMING_CONFIG.slow.duration).toBe(400);
      expect(TIMING_CONFIG.header.duration).toBe(200);
    });
  });

  describe('SCROLL_THRESHOLDS', () => {
    it('should export scroll threshold values', () => {
      expect(SCROLL_THRESHOLDS.largeTitleFadeStart).toBe(0);
      expect(SCROLL_THRESHOLDS.largeTitleFadeEnd).toBe(60);
      expect(SCROLL_THRESHOLDS.smallHeaderFadeStart).toBe(40);
      expect(SCROLL_THRESHOLDS.smallHeaderFadeEnd).toBe(80);
    });
  });

  describe('SCALE', () => {
    it('should export scale values', () => {
      expect(SCALE.pressed).toBe(0.97);
      expect(SCALE.normal).toBe(1);
      expect(SCALE.active).toBe(1.02);
    });
  });

  describe('OPACITY', () => {
    it('should export opacity values', () => {
      expect(OPACITY.hidden).toBe(0);
      expect(OPACITY.dimmed).toBe(0.5);
      expect(OPACITY.visible).toBe(1);
    });
  });
});
