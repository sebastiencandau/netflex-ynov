/**
 * @swagger
 * /api/search-movies:
 *   get:
 *     summary: Recherche de films.
 *     description: Recherche des films en fonction d'un terme de recherche.
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         required: true
 *         description: Le terme de recherche pour les films.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Le numéro de la page pour la pagination.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Succès de la recherche de films.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   description: Les films correspondant au terme de recherche.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: L'ID du film.
 *                       title:
 *                         type: string
 *                         description: Le titre du film.
 *                       overview:
 *                         type: string
 *                         description: La description du film.
 *                       poster_path:
 *                         type: string
 *                         description: Le chemin de l'affiche du film.
 *                       isLiked:
 *                         type: boolean
 *                         description: Indique si l'utilisateur a aimé ce film.
 *                 total_pages:
 *                   type: integer
 *                   description: Le nombre total de pages de résultats.
 *       '400':
 *         description: Mauvaise requête. Le terme de recherche est manquant.
 *       '405':
 *         description: Méthode non autorisée. Seules les requêtes GET sont autorisées.
 *       '500':
 *         description: Erreur interne du serveur. Échec de la recherche de films.
 */
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

async function searchMovies(req, res) {
    try {

        // Se connecter à la base de données MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db("netflex-db");

        // Vérifier si la méthode est GET
        if (req.method === 'GET') {
            // Jeton d'authentification
            const apiToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGIzY2RkNWM1ODU3NjFjNzU3MWIxZDA1ODZmNzUxMiIsInN1YiI6IjY1ZjgwYjUyNTk0Yzk0MDE2MzM4M2RhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AyRQ1BEBDPs1Z90GPLJMW2s5FurB0pccQgIRDNggTRk";
            // Récupérer le terme de recherche depuis les paramètres de requête
            const {searchTerm, page} = req.query;

            // Vérifier si le terme de recherche est présent
            if (!searchTerm) {
                return res.status(400).json({ error: 'Search term is required' });
            }

            // Configuration de la requête HTTP
            const config = {
                headers: {
                    Authorization: `Bearer ${apiToken}`
                }
            };

            // URL de l'API pour rechercher des films
            const url = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&page=${page}`;

            // Effectuer la requête GET à l'API
            const response = await fetch(url, config);
            const responseData = await response.json();

            const token = req.headers.authorization;
            let userId = null;
            if (token) {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                userId = decodedToken.userId;
            }
    
            // Convertir l'ID de l'utilisateur en ObjectId
            const userIdObject = new ObjectId(userId);
            
            // Recherchez l'utilisateur dans la collection en utilisant l'ObjectId
            const user = await db.collection("users").findOne({ _id: userIdObject });

            // Récupérer les données des films et les mapper avec l'interface Movie
            const movies = responseData.results.map((movie) => {
                
                const isLiked = user.likes ? user.likes.includes(movie.id): null;
                
                return {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                poster_path: movie.poster_path,
                isLiked
            }});

            // Envoyer les films en réponse
            res.status(200).json({ movies, total_pages: responseData.total_pages });
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default searchMovies;