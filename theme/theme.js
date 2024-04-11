// src/theme/theme.js

import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E50914', // Rouge Netflix
    },
    secondary: {
      main: '#000000', // Noir Netflix
    },
    background: {
      default: '#111111', // Fond sombre Netflix
    },
    text: {
      primary: '#FFFFFF', // Texte blanc Netflix
      secondary: '#808080', // Texte gris Netflix
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Police par défaut de Netflix
    h1: {
      color: '#E50914',
      fontSize: '3rem', // Taille de police titre principal
      fontWeight: 700, // Gras
      letterSpacing: '-0.01562em', // Espacement des lettres
      lineHeight: 1.167, // Hauteur de ligne
    },
    h2: {
      fontSize: '2.5rem', // Taille de police sous-titre
      fontWeight: 700,
      letterSpacing: '-0.00833em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2.125rem', // Taille de police titre secondaire
      fontWeight: 700,
      letterSpacing: '0em',
      lineHeight: 1.167,
    },
    body1: {
      fontSize: '1rem', // Taille de police du texte principal
      fontWeight: 400,
      letterSpacing: '0.00938em',
      lineHeight: 1.5,
    },
    body2: {
      color: 'white',
      fontSize: '0.875rem', // Taille de police du texte secondaire
      fontWeight: 400,
      letterSpacing: '0.01071em',
      lineHeight: 1.43,
    },
  },
});

export default theme;
