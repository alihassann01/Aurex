import api from './api';
import type { AuthResponse, LoginPayload, RegisterPayload, ProfileResponse } from '@/types';

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user: { id, name, email, role } }
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
  return data;
}

/**
 * POST /api/auth/register
 * Body: { name, email, password, role? }
 * Returns: { token, user: { id, name, email, role } }
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
  return data;
}

/**
 * GET /api/auth/profile
 * Headers: Authorization: Bearer <token>
 * Returns: { user } (full user doc minus password)
 */
export async function getProfile(): Promise<ProfileResponse> {
  const { data } = await api.get<ProfileResponse>('/api/auth/profile');
  return data;
}

/**
 * POST /api/auth/logout
 * Headers: Authorization: Bearer <token>
 * Returns: { message: 'Logged out successfully' }
 * Blacklists token on server
 */
export async function logoutUser(): Promise<void> {
  await api.post('/api/auth/logout');
}
