import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Button, TextField } from '@mui/material';
import SecureLayout from './SecureLayout';
import theme from '../theme/theme';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  likeCounter: number; // Nouveau champ pour le nombre de likes
}

const MovieCatalogue = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchMovies();
  }, [page, searchTerm]);

  const fetchMovies = async () => {
    try {
      let url = `/api/movies-selection`;

      if (searchTerm.trim() !== '') {
        url = `/api/search-movies?searchTerm=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      // Mettre à jour les données des films avec le nombre de likes
      const moviesWithLikes = await Promise.all(data.movies.map(async (movie: Movie) => {
        const likesResponse = await fetch(`/api/movies/${movie.id}/likes`);
        const likesData = await likesResponse.json();
        // Vérifier si la réponse est null, alors définir le nombre de likes à 0
        movie.likeCounter = likesData.data.likes ? likesData.data.likes.likeCounter : 0;
        return movie;
      }));

      setMovies(moviesWithLikes);
      setTotalPages(data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleSearch = () => {
    setPage(1);
    setMovies([]);
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleLike = async (movieId: number) => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch(`/api/movies/${movieId}/likes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `${token}` : ''
        },
        body: JSON.stringify({ token: token }) // Envoyer le token dans le corps de la requête
      });
  
      if (!response.ok) {
        throw new Error('Failed to like the movie');
      }
  
      // Rafraîchir la liste des films après avoir liké
      fetchMovies();
    } catch (error) {
      console.error('Error liking the movie:', error);
    }
  };

  return (
    <SecureLayout>
      <div>
        <Grid container spacing={2} alignItems="center"> {/* Alignement vertical des éléments */}
          <Grid item xs={10}> {/* Prend la moitié de la largeur de la grille */}
            <TextField
              label="Recherchez un film"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={1}> {/* Prend un quart de la largeur de la grille */}
            <Button variant="contained" color="primary" onClick={handleSearch} fullWidth> {/* Utilisez fullWidth pour que le bouton prenne toute la largeur */}
              Rechercher
            </Button>
          </Grid>
        </Grid>
        <h2>{searchTerm.trim() === '' ? 'Les films les plus likés' : `Résultats pour: ${searchTerm}`}</h2>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid container spacing={2}>
              {movies && movies.map((movie) => (
                <Grid key={movie.id} item xs={12} sm={6} md={4} lg={3}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="400"
                      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <CardContent>
                      <Typography variant="h4" color={theme.palette.primary.main} component="div">
                        {movie.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {movie.overview}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Likes: {movie.likeCounter} {/* Afficher le nombre de likes */}
                      </Typography>
                      {/* Bouton "like" */}
                      <Button variant="contained" color="secondary" onClick={() => handleLike(movie.id)}>
                        Like
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {page < totalPages && (
              <Button variant="contained" color="primary" onClick={handleLoadMore}>
                Load More
              </Button>
            )}
          </>
        )}
      </div>
    </SecureLayout>
  );
};

export default MovieCatalogue;
