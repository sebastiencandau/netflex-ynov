// SecureLayout.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/auth.context';

const SecureLayout = ({ children }: any) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/ui/login');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      {/* Mettez ici la barre de navigation ou d'autres éléments communs */}
      {children}
      {/* Mettez ici le pied de page ou d'autres éléments communs */}
    </>
  );
};

export default SecureLayout;
