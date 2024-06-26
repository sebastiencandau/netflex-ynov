// SecureLayout.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/auth.context';

const SecureLayout = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/ui/login');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      {isAuthenticated && children}
    </>
  );
};

export default SecureLayout;
