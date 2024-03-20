import clientPromise from "/lib/mongodb";
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';


/**
 * @swagger
 * /api/movies/{idMovie}/likes:
 *   patch:
 *     summary: Aimer un film.
 *     description: Aime un film spécifié par son ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idMovie:
 *                 type: integer
 *                 description: L'ID du film à aimer.
 *                 example: 123
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Film aimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                   description: Le code de statut de la réponse.
 *                 message:
 *                   type: string
 *                   example: Movie liked successfully
 *                   description: Message indiquant que le film a été aimé avec succès.
 *       '400':
 *         description: Mauvaise requête. L'ID du film ou le token est manquant.
 *       '401':
 *         description: Non autorisé. L'utilisateur n'est pas authentifié ou le token est invalide.
 *       '404':
 *         description: Non trouvé. L'utilisateur n'existe pas.
 *       '500':
 *         description: Erreur interne du serveur. Échec de l'aimer du film.
 *   get:
 *     summary: Obtenir le nombre de likes pour un film.
 *     description: Récupère le nombre total de likes pour un film spécifié par son ID.
 *     parameters:
 *       - in: query
 *         name: idMovie
 *         required: true
 *         description: L'ID du film pour lequel obtenir le nombre de likes.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Succès de la récupération du nombre de likes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                   description: Le code de statut de la réponse.
 *                 data:
 *                   type: object
 *                   properties:
 *                     likes:
 *                       type: object
 *                       description: Les données des likes pour le film spécifié.
 *       '400':
 *         description: Mauvaise requête. L'ID du film est manquant.
 *       '404':
 *         description: Non trouvé. Aucun like trouvé pour le film spécifié.
 *       '405':
 *         description: Méthode non autorisée. Seules les requêtes PATCH et GET sont autorisées.
 *     security:
 *       - bearerAuth: []
 */

export default async function handler(req, res) {

    const getUserIdFromToken = (token) => {
        if (!token) {
            return null;
        }
    
        try {
            // Vérifier et décoder le token JWT
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            // Extraire l'ID de l'utilisateur du token décodé
            const userId = decodedToken.userId;
            return userId;
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    };
    

    const idMovie = parseInt(req.query.idMovie, 10);

    const client = await clientPromise;
    const db = client.db("netflex-db");

    switch (req.method) {

        case "PATCH":
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const userId = getUserIdFromToken(token); // Obtenez l'ID de l'utilisateur à partir du token JWT
            if (!userId) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            try {
                // Convertir l'ID de l'utilisateur en ObjectId
                const userIdObject = new ObjectId(userId);
        
                // Recherchez l'utilisateur dans la collection en utilisant l'ObjectId
                const user = await db.collection("users").findOne({ _id: userIdObject });
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
        
                // Vérifier si l'utilisateur a déjà liké ce film
                if (user.likes && user.likes.includes(idMovie)) {
                    return res.status(400).json({ error: 'User already liked this movie' });
                }
        
                // Incrémenter le compteur de likes du film
                const movieLikeResponse = await db.collection("likes").updateOne(
                    { idTMDB: idMovie },
                    { $inc: { likeCounter: 1 } }
                );
        
                // Vérifier si le film existe dans la collection des likes
                if (movieLikeResponse.modifiedCount === 0) {
                    // Si le film n'existe pas, insérez-le avec un compteur de likes initialisé à 1
                    await db.collection("likes").insertOne({ idTMDB: idMovie, likeCounter: 1 });
                }
        
                // Ajouter l'ID du film dans le tableau des likes de l'utilisateur
                await db.collection("users").updateOne(
                    { _id: userIdObject },
                    { $push: { likes: idMovie } }
                );
        
                res.status(201).json({ status: 201, message: 'Movie liked successfully' });
            } catch (error) {
                console.error('Error liking the movie:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
            break;
        

        case "GET":

            const likes = await db.collection("likes").findOne({ idTMDB: idMovie });
            res.json({ status: 200, data: { likes: likes } });
            break;

        default:
            res.status(405).json({ status: 405, error: "Method Not Allowed" });
    }
}
