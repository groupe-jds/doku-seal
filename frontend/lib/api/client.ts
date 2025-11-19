import ky from 'ky';

// Base API client configuration
export const apiClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Add auth token from session
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          // Clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/signin';
          }
        }
      },
    ],
  },
});

// Helper for GET requests
export async function get<T>(url: string): Promise<T> {
  return apiClient.get(url).json<T>();
}

// Helper for POST requests
export async function post<T>(url: string, data?: unknown): Promise<T> {
  return apiClient.post(url, { json: data }).json<T>();
}

// Helper for PUT requests
export async function put<T>(url: string, data?: unknown): Promise<T> {
  return apiClient.put(url, { json: data }).json<T>();
}

// Helper for PATCH requests
export async function patch<T>(url: string, data?: unknown): Promise<T> {
  return apiClient.patch(url, { json: data }).json<T>();
}

// Helper for DELETE requests
export async function del<T>(url: string): Promise<T> {
  return apiClient.delete(url).json<T>();
}
