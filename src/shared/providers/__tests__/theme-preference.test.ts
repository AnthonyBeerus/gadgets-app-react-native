import { resolveIsDark } from '../theme-provider';

describe('theme preference resolution', () => {
  it('maps light/dark/system to isDark', () => {
    expect(resolveIsDark('light', 'dark')).toBe(false);
    expect(resolveIsDark('dark', 'light')).toBe(true);
    expect(resolveIsDark('system', 'dark')).toBe(true);
    expect(resolveIsDark('system', 'light')).toBe(false);
    expect(resolveIsDark('system', null)).toBe(false);
  });
});
