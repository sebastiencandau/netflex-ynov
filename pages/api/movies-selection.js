/**
 * @swagger
 * /api/movies-selection:
 *   get:
 *     summary: Obtenez les films les plus aimés.
 *     description: Récupère les films les plus aimés à partir de la base de données.
 *     components:
 *         securitySchemes:
 *           bearerAuth:            # arbitrary name for the security scheme
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT    # optional, arbitrary value for documentation purposes
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Jeton JWT pour l'authentification.
 *         required: true
 *     responses:
 *       '200':
 *         description: Succès de la récupération des films les plus aimés.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   description: Les films les plus aimés.
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
 *       '401':
 *         description: Non autorisé, jeton manquant ou invalide.
 *       '500':
 *         description: Erreur interne du serveur. Échec de la récupération des films les plus aimés.
 */
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { Console } from 'console';

async function getTopLikedMovies(req, res) {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db("netflex-db");


        const topLikedMovies = await db.collection("likes").find().sort({ likeCounter: -1 }).limit(10).toArray();

        const token = req.headers.authorization;
        console.log('AAAAAAAAAAAAAAAAAAAAAAA',token);

        let userId = null;
        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            userId = decodedToken.userId;
        }


        const userIdObject = new ObjectId(userId);
        
        const user = await db.collection("users").findOne({ _id: userIdObject });

        const moviesPromises = topLikedMovies.map(async (likedMovie) => {

            const url = `https://api.themoviedb.org/3/movie/${likedMovie.idTMDB}?api_key=${process.env.THEMOVIEDB_API_KEY}`;
            const response = await fetch(url);
            const movieData = await response.json();
            const isLiked = user.likes ? user.likes.includes(movieData.id) : null;

            return {
                id: movieData.id,
                title: movieData.title,
                overview: movieData.overview,
                poster_path: movieData.poster_path,
                isLiked: isLiked
            };
        });

        const movies = await Promise.all(moviesPromises);
        await client.close();

        res.status(200).json({ movies });
    } catch (error) {
        console.error("Error fetching top liked movies:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default getTopLikedMovies;
