// __tests__/ui/index.ui.test.js

import { render, screen } from '@testing-library/react';
import HomePage from '../../pages/index';
import { AuthProvider } from '../../contexts/';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('HomePage component', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  test('renders home page with title when authenticated', () => {
    render(
      <AuthProvider value={{ isAuthenticated: true }}>
        <HomePage />
      </AuthProvider>
    );

    expect(screen.getByText('Netflex')).toBeInTheDocument();
  });

  test('renders home page without title when not authenticated', () => {
    render(
      <AuthProvider value={{ isAuthenticated: false }}>
        <HomePage />
      </AuthProvider>
    );

    expect(screen.queryByText('Netflex')).toBeNull();
  });

  test('redirects to login page when not authenticated', () => {
    const useRouter = jest.fn();
    useRouter.mockReturnValueOnce({ push: jest.fn() });
    jest.mock('next/router', () => ({
      useRouter,
    }));

    render(
      <AuthProvider value={{ isAuthenticated: false }}>
        <HomePage />
      </AuthProvider>
    );

    expect(useRouter().push).toHaveBeenCalledWith('/ui/login');
  });

  test('does not redirect when authenticated', () => {
    const useRouter = jest.fn();
    useRouter.mockReturnValueOnce({ push: jest.fn() });
    jest.mock('next/router', () => ({
      useRouter,
    }));

    render(
      <AuthProvider value={{ isAuthenticated: true }}>
        <HomePage />
      </AuthProvider>
    );

    expect(useRouter().push).not.toHaveBeenCalled();
  });
});
