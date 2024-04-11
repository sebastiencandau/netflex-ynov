import { render, screen } from '@testing-library/react';
import Index from '../../pages/index';
import { useAuth } from '../../contexts/auth.context';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');
useRouter.mockImplementation(() => ({
  pathname: '/',
  ...moreRouterData
}));
jest.mock('../../contexts/auth.context');

describe('Index', () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  //mock fetch
global.fetch = jest.fn(() =>
Promise.resolve({
    json: () => Promise.resolve({ data: { results: [], page: 1, total_pages: 1 } }),
})
);

  it('redirects to sign-in page if user is not authenticated', () => {
    // Mocking isAuthenticated to return false
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn().mockReturnValue(false),
      login: jest.fn(), // You can mock login as well if needed
    });

    render(<Index />);

    expect(useRouter().push).toHaveBeenCalledWith('/ui/login');
  });

  it('does not redirect if user is authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn().mockReturnValue(true),
      login: jest.fn(),
    });

    render(<Index />);

    // Vérifier que useRouter().push n'est pas appelé
    expect(useRouter().push).not.toHaveBeenCalled();
  });

});