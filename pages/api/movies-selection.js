import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

async function getTopLikedMovies(req, res) {
    try {
        // Se connecter à la base de données MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db("netflex-db");

        // Récupérer les films les plus likés à partir de la collection "likes"
        const topLikedMovies = await db.collection("likes").find().sort({ likeCounter: -1 }).limit(10).toArray();

        // Obtenir l'ID de l'utilisateur à partir du token JWT dans la requête
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

        // Récupérer les détails des films les plus likés à partir de l'API de The Movie Database en fonction de leurs IDs
        const moviesPromises = topLikedMovies.map(async (likedMovie) => {
            const url = `https://api.themoviedb.org/3/movie/${likedMovie.idTMDB}?api_key=${process.env.THEMOVIEDB_API_KEY}`;
            const response = await fetch(url);
            const movieData = await response.json();

            // Vérifier si l'utilisateur a déjà liké ce film
            const isLiked = user.likes ? user.likes.includes(movieData.id) : null;
            console.log('sjhfsujjf', isLiked)

            return {
                id: movieData.id,
                title: movieData.title,
                overview: movieData.overview,
                poster_path: movieData.poster_path,
                isLiked: isLiked // Ajouter la propriété isLiked à l'objet du film
            };
        });

        // Attendre que toutes les promesses pour récupérer les détails des films soient résolues
        const movies = await Promise.all(moviesPromises);

        // Fermer la connexion à la base de données MongoDB
        await client.close();

        // Envoyer les films les plus likés en réponse
        res.status(200).json({ movies });
    } catch (error) {
        console.error("Error fetching top liked movies:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default getTopLikedMovies;
