import React from 'react';
import { Grid, Typography, Box, ThemeProvider } from '@mui/material';
import MovieCatalogueWithPaginationAndSearch from '../../components/MoviesCatalogue';
import theme from '../../theme/theme'; // Importez le thème que nous avons défini
import Header from '../../components/Header';

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box p={3}>
        <Header></Header>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MovieCatalogueWithPaginationAndSearch />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
