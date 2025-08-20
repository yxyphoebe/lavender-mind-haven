/**
 * Environment detection utilities for Lovable test environment
 */

/**
 * Checks if current environment is Lovable test/preview environment
 * Based on hostname patterns like *.lovable.dev, *.sandbox.lovable.dev
 */
export const isLovableTestEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // Check for Lovable preview domains
  return (
    hostname.includes('.lovable.dev') ||
    hostname.includes('.sandbox.lovable.dev') ||
    hostname.includes('localhost')
  );
};

/**
 * Mock user data for "py" user in test environment
 */
export const getMockTestUser = () => ({
  id: 'e5145042-25e5-46f0-9113-483ac08026d6', // py user ID from database
  email: 'yxyphoebe@gmail.com',
  name: 'py',
  onboarding_completed: true,
  selected_therapist_id: 'therapist-1',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {
    name: 'py',
    email: 'yxyphoebe@gmail.com'
  },
  aud: 'authenticated',
  confirmation_sent_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  phone: '',
  role: 'authenticated'
});

/**
 * Mock session data for test environment
 */
export const getMockTestSession = () => {
  const user = getMockTestUser();
  return {
    access_token: 'mock-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'mock-refresh-token',
    user: user
  };
};