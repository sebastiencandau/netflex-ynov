import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Button, TextField } from '@mui/material';
import SecureLayout from './SecureLayout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import theme from '../theme/theme';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  likeCounter: number;
  isLiked: boolean; // Nouveau champ pour indiquer si le film est déjà liké par l'utilisateur
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
        url = `/api/search-movies?searchTerm=${encodeURIComponent(searchTerm.trim())}&page=${page}`;
      }

      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        headers: {
          Authorization: `${token}`
        }
      });

      const data = await response.json();

      const moviesWithLikes = await Promise.all(data.movies.map(async (movie: Movie) => {
        const likesResponse = await fetch(`/api/movies/${movie.id}/likes`);
        const likesData = await likesResponse.json();
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

  const handleLike = async (movieId: number) => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch(`/api/movies/${movieId}/likes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `${token}` : ''
        },
        body: JSON.stringify({ token: token })
      });
  
      if (!response.ok) {
        throw new Error('Failed to like the movie');
      }
  
      fetchMovies();
    } catch (error) {
      console.error('Error liking the movie:', error);
    }
  };

  const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }

  return (
    <SecureLayout>
      <div>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={10}>
            <TextField
              label="Recherchez un film"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: 'white' } }} // Style de l'étiquette en blanc
              inputProps={{ style: { color: 'white', borderColor: 'white' } }} // Style de l'entrée et de la bordure en blanc
              />
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
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
                      {truncateString(movie.title, 20)} {/* Limite de 20 caractères */}
                      </Typography>
                      <p></p>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <Typography variant="body1" color="text.secondary">
                        Likes: {movie.likeCounter}
                      </Typography>
                      {movie.isLiked ? (
                        <Typography variant="body1" color="text.secondary">
                          Liké
                        </Typography>
                        ) : (
                          <Button onClick={() => handleLike(movie.id)}>
                            <FavoriteIcon color="secondary" />
                          </Button>
                        )}
                      </div>
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
