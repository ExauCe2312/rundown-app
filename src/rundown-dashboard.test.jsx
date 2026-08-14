import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RundownDashboard from './rundown-dashboard';
import * as AuthContext from './AuthContext';
import * as SupabaseClient from './supabaseClient';

// Mock the AuthContext hook
vi.mock('./AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the supabaseClient
vi.mock('./supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      updateUser: vi.fn(),
    },
  },
}));

describe('RundownDashboard', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock useAuth to return a logged-in user
    AuthContext.useAuth.mockReturnValue({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' },
      },
      logout: vi.fn(),
      loading: false,
    });

    // Mock supabase.from().select() to return empty contents
    SupabaseClient.supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
      insert: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    });
  });

  it('should render the dashboard with the user greeting', async () => {
    render(
      <BrowserRouter>
        <RundownDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Bienvenue/)).toBeInTheDocument();
    });
  });

  it('should display the user name in the greeting', async () => {
    render(
      <BrowserRouter>
        <RundownDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Look specifically in the h1 greeting, not the sidebar
      const h1 = screen.getByText(/Bienvenue/);
      expect(h1).toHaveTextContent('Test User');
    });
  });

  it('should render the "Bureau" tab by default', async () => {
    render(
      <BrowserRouter>
        <RundownDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Prochaines publications/)).toBeInTheDocument();
    });
  });

  it('should show "Aucune publication planifiée" when no contents exist', async () => {
    render(
      <BrowserRouter>
        <RundownDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Aucune publication planifiée/)).toBeInTheDocument();
    });
  });
});
