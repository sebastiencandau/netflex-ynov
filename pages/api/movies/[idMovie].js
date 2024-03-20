/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     summary: Obtenez les détails étendus d'un film.
 *     description: Récupère les détails étendus d'un film à partir de l'API The Movie Database.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         description: L'ID du film à récupérer.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       '200':
 *         description: Succès de la récupération des détails du film.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movieDetails:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: L'ID du film.
 *                     title:
 *                       type: string
 *                       description: Le titre du film.
 *                     overview:
 *                       type: string
 *                       description: La description du film.
 *                     poster_path:
 *                       type: string
 *                       description: Le chemin de l'affiche du film.
 *                     trailer_link:
 *                       type: string
 *                       description: Le lien de la bande-annonce du film (s'il est disponible).
 *                     genres:
 *                       type: array
 *                       description: Les genres du film.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: L'ID du genre.
 *                           name:
 *                             type: string
 *                             description: Le nom du genre.
 *                     actors:
 *                       type: array
 *                       description: Les acteurs du film.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: L'ID de l'acteur.
 *                           name:
 *                             type: string
 *                             description: Le nom de l'acteur.
 *                     reviews:
 *                       type: array
 *                       description: Les critiques du film.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: L'ID de la critique.
 *                           author:
 *                             type: string
 *                             description: L'auteur de la critique.
 *                           content:
 *                             type: string
 *                             description: Le contenu de la critique.
 *                     recommendations:
 *                       type: array
 *                       description: Les recommandations de films similaires.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: L'ID du film recommandé.
 *                           title:
 *                             type: string
 *                             description: Le titre du film recommandé.
 *                     isLiked:
 *                       type: boolean
 *                       description: Indique si l'utilisateur a aimé ce film.
 *       '400':
 *         description: Mauvaise requête. L'ID du film est manquant ou invalide.
 *       '500':
 *         description: Erreur interne du serveur. Échec de la récupération des détails du film.
 */
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import clientPromise from "/lib/mongodb";
import fetch from 'node-fetch';
import { ObjectId } from 'mongodb';
import { Console } from 'console';

async function getMovieDetails(req, res) {
    try {
        // Se connecter à la base de données MongoDB
        const client = await clientPromise;
        const db = client.db("netflex-db");

        // Récupérer l'ID du film à partir des paramètres de requête
        const idMovie = parseInt(req.query.idMovie, 10);


        // Obtenir les détails du film à partir de l'API The Movie Database
        const movieDetailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${idMovie}?api_key=${process.env.THEMOVIEDB_API_KEY}&append_to_response=credits,reviews,recommendations`);
        const movieDetailsData = await movieDetailsResponse.json();


        // Obtenir l'ID de l'utilisateur à partir du token JWT dans la requête
        const token = req.headers.authorization;
        console.log(token)
        let userId = null;
        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            userId = decodedToken.userId;
        }

        console.log(userId);

        // Convertir l'ID de l'utilisateur en ObjectId
        const userIdObject = new ObjectId(userId);
        const tata = await db.collection('users').findOne(new ObjectId('65f827f542c72be4e6c0e52e'));
        console.log(userIdObject);

        // Recherchez l'utilisateur dans la collection en utilisant l'ObjectId
        const user = await db.collection("users").findOne({ _id: userIdObject });

        console.log(userIdObject, user)
        // Vérifier si l'utilisateur a déjà liké ce film
        const isLiked = user.likes ? user.likes.includes(idMovie) : false;
        console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')

        // Fermer la connexion à la base de données MongoDB
        await client.close();

        // Retourner les détails étendus du film
        res.status(200).json({ 
            movieDetails: {
                id: movieDetailsData.id,
                title: movieDetailsData.title,
                overview: movieDetailsData.overview,
                poster_path: movieDetailsData.poster_path,
                trailer_link: movieDetailsData.trailer_link, // Vous devrez ajouter cela si vous avez les liens de bande-annonce dans votre base de données ou l'API TMDb
                genres: movieDetailsData.genres,
                actors: movieDetailsData.credits.cast,
                reviews: movieDetailsData.reviews.results,
                recommendations: movieDetailsData.recommendations.results,
                isLiked: isLiked
            }
        });
    } catch (error) {
        console.error("Error fetching movie details:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default getMovieDetails;
