import fetch from 'node-fetch';

async function searchMovies(req, res) {
    try {
        // Vérifier si la méthode est GET
        if (req.method === 'GET') {
            // Jeton d'authentification
            const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGIzY2RkNWM1ODU3NjFjNzU3MWIxZDA1ODZmNzUxMiIsInN1YiI6IjY1ZjgwYjUyNTk0Yzk0MDE2MzM4M2RhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AyRQ1BEBDPs1Z90GPLJMW2s5FurB0pccQgIRDNggTRk";

            // Récupérer le terme de recherche depuis les paramètres de requête
            const searchTerm = req.query.searchTerm;

            // Vérifier si le terme de recherche est présent
            if (!searchTerm) {
                return res.status(400).json({ error: 'Search term is required' });
            }

            // Configuration de la requête HTTP
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // URL de l'API pour rechercher des films
            const url = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}`;

            // Effectuer la requête GET à l'API
            const response = await fetch(url, config);
            const responseData = await response.json();

            // Récupérer les données des films et les mapper avec l'interface Movie
            const movies = responseData.results.map((movie) => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                poster_path: movie.poster_path
            }));

            // Envoyer les films en réponse
            res.status(200).json({ movies });
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default searchMovies;
