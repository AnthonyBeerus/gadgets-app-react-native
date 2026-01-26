
import { apiClient, ApiError } from '../client';

// Mock global fetch
global.fetch = jest.fn();

describe('apiClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    (global.fetch as jest.Mock).mockClear();
    process.env = { ...originalEnv, EXPO_PUBLIC_API_URL: 'https://test-api.com' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('get', () => {
    it('should perform GET request with correct URL', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' }),
      });

      const result = await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test-api.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should throw ApiError on failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not Found' }),
      });

      await expect(apiClient.get('/unknown')).rejects.toThrow(ApiError);
      await expect(apiClient.get('/unknown')).rejects.toThrow('Not Found');
    });

    it('should throw ApiError with status code', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Server Error' }),
        });
  
        try {
          await apiClient.get('/error');
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            if (error instanceof ApiError) {
                expect(error.status).toBe(500);
            }
        }
      });
  });

  describe('post', () => {
    it('should perform POST request with body', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const body = { name: 'test' };
      const result = await apiClient.post('/create', body);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test-api.com/create',
        expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(body),
        })
      );
      expect(result).toEqual({ success: true });
    });
  });
});
