// index.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/auth.context';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from '../theme/theme';
import Home from './ui/Home';
import SecureLayout from '../components/SecureLayout';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div  style={{ backgroundColor: theme.palette.background.default, padding: '20px' }}>
        <SecureLayout>
        <Home />
        </SecureLayout>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;
