import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Typography, ThemeProvider } from '@mui/material';
import fetch from 'node-fetch';
import { useAuth } from '../../contexts/auth.context';
import theme from '../../theme/theme';

const SignUpPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Utilisez le hook useAuth pour vérifier l'authentification

  // Redirigez l'utilisateur vers la page d'accueil s'il est déjà authentifié
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/ui/login');
      } else {
        setError(data.error || 'Failed to sign up');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Failed to sign up');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h1" gutterBottom>
          Netflex
        </Typography>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSignUp}>
          S'inscrire
        </Button>
        {error && <Typography variant="body2" color="error">{error}</Typography>}
      </div>
    </ThemeProvider>
  );
};

export default SignUpPage;
