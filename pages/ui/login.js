import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Typography, Link, ThemeProvider } from '@mui/material';
import { useAuth } from '../../contexts/auth.context';
import fetch from 'node-fetch';
import theme from '../../theme/theme'; // Importez votre thème MUI

const SignInPage = () => {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth(); // Utilisez le hook useAuth pour vérifier l'authentification

  // Redirigez l'utilisateur vers la page d'accueil s'il est déjà authentifié
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('/api/auth/log-in', {
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
        const { user, token } = data;
        login(user, token);
        router.push('/');
      } else {
        setError(data.error || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Failed to sign in');
    }
  };

  return (
    <ThemeProvider theme={theme}> {/* Enveloppez le contenu avec le thème MUI */}
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
        <Button variant="contained" color="primary" onClick={handleSignIn}>
          Se connecter
        </Button>
        {error && <Typography variant="body2" color="error">{error}</Typography>}
        <p></p>
        <Typography variant="body2">
          Vous n'avez pas de compte? <Link href="/ui/signup">S'inscrire</Link>
        </Typography>
      </div>
    </ThemeProvider>
  );
};

export default SignInPage;
