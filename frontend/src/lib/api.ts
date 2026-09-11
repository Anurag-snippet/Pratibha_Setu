const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pratibha-setu-backend.onrender.com/api';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message?: string; data?: T; errors?: any[] }> {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => ({
    success: false,
    message: 'An unexpected response was received from the server.',
  }));

  if (!response.ok) {
    throw new Error(result.message || `Request failed with status ${response.status}`);
  }

  return result;
}

export const api = {
  auth: {
    signup: (data: { name: string; email: string; password: string; role: string }) =>
      apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMe: () => apiRequest('/auth/me'),
    logout: () =>
      apiRequest('/auth/logout', {
        method: 'POST',
      }),
  },
};
