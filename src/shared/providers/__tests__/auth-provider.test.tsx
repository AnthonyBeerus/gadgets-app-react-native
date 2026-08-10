import React from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import AuthProvider, { useAuth } from '../auth-provider';
import { supabase } from '../../lib/supabase';

const mockToken = [
  'header',
  Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 600, role: 'authenticated' })).toString('base64url'),
  'signature',
].join('.');
const mockGetToken = jest.fn();

jest.mock('@clerk/expo', () => ({
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'user_clerk_1',
    getToken: mockGetToken,
    signOut: jest.fn(),
  }),
  useUser: () => ({
    user: {
      fullName: 'Muse Creator',
      imageUrl: null,
      primaryEmailAddress: { emailAddress: 'creator@example.com' },
    },
  }),
}));

jest.mock('../../lib/supabase', () => ({
  setSupabaseAccessTokenProvider: jest.fn(),
  supabase: {
    rpc: jest.fn(),
    from: jest.fn(),
  },
}));

function Status() {
  const { mounting, session } = useAuth();
  return <Text>{mounting ? 'preparing' : session ? 'ready' : 'error'}</Text>;
}

describe('AuthProvider profile preparation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    mockGetToken.mockResolvedValue(mockToken);
  });

  it('loads the profile once even when Clerk returns a new getToken function identity', async () => {
    const profile = { id: 'profile-1', clerk_user_id: 'user_clerk_1', role: 'CREATOR' };
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: profile, error: null });
    (supabase.from as jest.Mock).mockImplementation((table: string) => ({
      select: () => ({
        eq: () => table === 'users'
          ? { single: async () => ({ data: profile, error: null }) }
          : { maybeSingle: async () => ({ data: null, error: null }) },
      }),
    }));

    const screen = render(<AuthProvider><Status /></AuthProvider>);
    await waitFor(() => expect(screen.getByText('ready')).toBeTruthy());
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 40)); });

    expect(supabase.rpc).toHaveBeenCalledTimes(1);
  });

  it('leaves preparation and exposes recovery when Clerk token loading stalls', async () => {
    jest.useFakeTimers();
    mockGetToken.mockImplementation(() => new Promise(() => undefined));

    const screen = render(<AuthProvider><Status /></AuthProvider>);
    await act(async () => {
      jest.advanceTimersByTime(10001);
      await Promise.resolve();
    });

    expect(screen.getByText('error')).toBeTruthy();
    jest.useRealTimers();
  });
});
