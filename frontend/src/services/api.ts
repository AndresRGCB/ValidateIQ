const API_BASE = '/api';

export interface SignupData {
  visitor_id: number;
  email: string;
  most_wanted_feature: string;
  marketing_consent: boolean;
  signup_source?: string;
  time_to_signup_seconds?: number;
}

export interface SignupResponse {
  success: boolean;
  position: number;
  spots_left: number;
  message: string;
}

export interface SignupCountResponse {
  count: number;
  spots_left: number;
}

export async function submitSignup(data: SignupData): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE}/signups/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to submit signup');
  }

  return response.json();
}

export async function getSignupCount(): Promise<SignupCountResponse> {
  const response = await fetch(`${API_BASE}/signups/count`);

  if (!response.ok) {
    throw new Error('Failed to get signup count');
  }

  return response.json();
}
