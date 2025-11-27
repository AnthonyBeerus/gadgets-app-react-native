import { renderHook, act } from '@testing-library/react-native';
import { useChallengeStore } from '../challenge-store';

describe('useChallengeStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useChallengeStore());
    act(() => {
      result.current.challenges = [];
      result.current.loading = false;
      result.current.error = null;
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useChallengeStore());
    
    expect(result.current.challenges).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch challenges successfully', async () => {
    const { result } = renderHook(() => useChallengeStore());
    
    await act(async () => {
      await result.current.fetchChallenges();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.challenges.length).toBeGreaterThan(0);
    expect(result.current.challenges[0]).toHaveProperty('id');
    expect(result.current.challenges[0]).toHaveProperty('title');
    expect(result.current.challenges[0]).toHaveProperty('ai_allowed');
  });

  it('should set loading to true during fetch', async () => {
    const { result } = renderHook(() => useChallengeStore());
    
    let loadingDuringFetch = false;
    
    const fetchPromise = act(async () => {
      const promise = result.current.fetchChallenges();
      // Check loading state immediately after calling fetch
      loadingDuringFetch = result.current.loading;
      await promise;
    });

    await fetchPromise;
    
    // Loading should have been true at some point
    expect(loadingDuringFetch).toBe(true);
    // Loading should be false after completion
    expect(result.current.loading).toBe(false);
  });

  it('should populate challenges with correct structure', async () => {
    const { result } = renderHook(() => useChallengeStore());
    
    await act(async () => {
      await result.current.fetchChallenges();
    });

    const challenge = result.current.challenges[0];
    
    // Validate challenge structure
    expect(challenge).toHaveProperty('id');
    expect(challenge).toHaveProperty('title');
    expect(challenge).toHaveProperty('description');
    expect(challenge).toHaveProperty('brand_name');
    expect(challenge).toHaveProperty('reward');
    expect(challenge).toHaveProperty('deadline');
    expect(challenge).toHaveProperty('participants_count');
    expect(challenge).toHaveProperty('image_url');
    expect(challenge).toHaveProperty('requirements');
    expect(challenge).toHaveProperty('status');
    expect(challenge).toHaveProperty('type');
    expect(challenge).toHaveProperty('ai_allowed');
    
    // Validate types
    expect(typeof challenge.id).toBe('number');
    expect(typeof challenge.title).toBe('string');
    expect(typeof challenge.ai_allowed).toBe('boolean');
    expect(Array.isArray(challenge.requirements)).toBe(true);
  });
});
