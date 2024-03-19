// index.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/auth.context';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from '../theme/theme'; // Importez votre thème
import Home from './ui/Home'; // Importez votre composant Home
import SecureLayout from '../components/SecureLayout';

const HomePage = () => {
  const { isAuthenticated } = useAuth(); // Utilisez le hook useAuth pour vérifier l'authentification
  const router = useRouter(); // Utilisez le hook useRouter pour gérer la navigation

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalise les styles */}
      <div style={{ backgroundColor: theme.palette.background.default, padding: '20px' }}>
        <SecureLayout>
        <Home /> {/* Rendez votre composant Home */}
        </SecureLayout>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;
