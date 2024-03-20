import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router'; // Importer useRouter de Next.js
import SecureLayout from '../../../components/SecureLayout';

interface MovieDetails {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  genres: { id: number; name: string }[];
  trailer_link?: string;
  actors: { id: number; name: string }[];
  reviews: { id: number; author: string; content: string }[];
  recommendations: { id: number; title: string }[];
  isLiked: boolean;
}

const MovieDetails: React.FC = () => {
  const router = useRouter(); // Utiliser useRouter pour obtenir les paramètres de l'URL
  const { idMovie } = router.query; // Obtenez l'ID du film à partir des paramètres de l'URL
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  useEffect(() => {
    // Assurez-vous que idMovie est disponible avant de charger les détails du film
    if (idMovie) {
      fetchMovieDetails();
    }
  }, [idMovie]);

  const fetchMovieDetails = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token utilisateur depuis le localStorage
      const response = await fetch(`/api/movies/${idMovie}`, {
        headers: {
          Authorization: token ? `${token}` : '', // Inclure le token dans l'en-tête Authorization
        },
      });
      const data = await response.json();
      setMovieDetails(data.movieDetails);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };
  
  if (!movieDetails) {
    return <Typography>Loading...</Typography>;
  }

  const { title, overview, poster_path, genres, trailer_link, actors, reviews, recommendations, isLiked } = movieDetails;

  return (
    <SecureLayout>
      <div style={{ padding: '16px' }}>
        <Typography variant="h4" gutterBottom>{title}</Typography>
        <Typography variant="body1" gutterBottom>{overview}</Typography>
        
        <Typography variant="subtitle1" gutterBottom>Genres:</Typography>
        <Grid container spacing={1} style={{ marginBottom: '16px' }}>
          {genres.map(genre => (
            <Grid item key={genre.id}>
              <Button variant="outlined" size="small" style={{ marginRight: '8px', marginBottom: '8px' }}>{genre.name}</Button>
            </Grid>
          ))}
        </Grid>
        
        {poster_path && (
          <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} />
        )}

        {trailer_link && (
          <div style={{ marginTop: '16px' }}>
            <Typography variant="h5" gutterBottom>Bande-annonce</Typography>
            <iframe
              title="Bande-annonce"
              src={trailer_link}
              frameBorder="0"
              allow="fullscreen"
              style={{ width: '100%', height: '400px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            ></iframe>
          </div>
        )}

        <Typography variant="h5" gutterBottom>Acteurs</Typography>
        <ul>
          {actors.map(actor => (
            <li key={actor.id}>{actor.name}</li>
          ))}
        </ul>

        <Typography variant="h5" gutterBottom>Critiques</Typography>
        <ul>
          {reviews.map(review => (
            <li key={review.id} style={{ marginBottom: '16px' }}>
              <Typography variant="subtitle2" gutterBottom>{review.author}</Typography>
              <Typography variant="body2" gutterBottom>{review.content}</Typography>
            </li>
          ))}
        </ul>

        <Typography variant="h5" gutterBottom>Recommandations</Typography>
        <ul>
          {recommendations.map(recommendation => (
            <li key={recommendation.id}>{recommendation.title}</li>
          ))}
        </ul>
      </div>
    </SecureLayout>
  );
};

export default MovieDetails;
