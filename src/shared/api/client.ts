
export class ApiError extends Error {
    constructor(message: string, public status: number, public code?: string) {
      super(message);
      this.name = "ApiError";
    }
  }
  
  const getBaseUrl = () => {
    // In production, this would come from an environment variable.
    // For TDD purposes, we respect the process.env if set.
    return process.env.EXPO_PUBLIC_API_URL || (process.env.NODE_ENV === 'test' ? 'https://test-api.com' : undefined);
  };
  
  const fetchWithErrorHandling = async (path: string, options?: RequestInit) => {
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      throw new Error("EXPO_PUBLIC_API_URL is not defined");
    }
  
    const url = `${baseUrl}${path}`;
    const defaultHeaders = {
      "Content-Type": "application/json",
    };
  
    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    };
  
    try {
      const response = await fetch(url, config);
  
      if (!response.ok) {
        let errorMessage = "Request failed";
        let errorCode = undefined;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || errorMessage;
            errorCode = errorBody.code;
        } catch {
            // If json parse fails, use default message
        }
        
        throw new ApiError(errorMessage, response.status, errorCode);
      }
  
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error instanceof Error ? error.message : "Unknown error", 0);
    }
  };
  
  export const apiClient = {
    get: <T>(path: string, options?: RequestInit): Promise<T> => {
      return fetchWithErrorHandling(path, { ...options, method: "GET" });
    },
    post: <T>(path: string, body: unknown, options?: RequestInit): Promise<T> => {
      return fetchWithErrorHandling(path, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      });
    },
  };
