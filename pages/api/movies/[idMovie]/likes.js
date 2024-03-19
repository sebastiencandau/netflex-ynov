import clientPromise from "/lib/mongodb";
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';


/**
 * @swagger
 * /api/movies/{idMovie}/likes:
 *   get:
 *     summary: Get the number of likes for a specific movie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success. Returns the number of likes for the movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idTMDB:
 *                   type: integer
 *                   description: The ID of the movie.
 *                 likeCounter:
 *                   type: integer
 *                   description: The number of likes for the movie.
 *               example:
 *                 idTMDB: 12345
 *                 likeCounter: 10
 *       404:
 *         description: Not found. The movie with the specified ID does not exist.
 *       405:
 *         description: Method Not Allowed. The method specified in the request is not allowed for the endpoint.
 *   patch:
 *     summary: Increment the like counter for a specific movie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token for user authentication.
 *             required:
 *               - token
 *     responses:
 *       201:
 *         description: Success. The like counter for the movie is incremented.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The status code of the response.
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     action:
 *                       type: string
 *                       description: The action performed.
 *                       example: likeCounter incremented
 *                     idMovie:
 *                       type: integer
 *                       description: The ID of the movie.
 *                     matchedCount:
 *                       type: integer
 *                       description: The number of documents matched by the update operation.
 *                     modifiedCount:
 *                       type: integer
 *                       description: The number of documents modified by the update operation.
 *                   example:
 *                     action: likeCounter incremented
 *                     idMovie: 12345
 *                     matchedCount: 1
 *                     modifiedCount: 1
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       404:
 *         description: Not found. The movie with the specified ID does not exist.
 *       405:
 *         description: Method Not Allowed. The method specified in the request is not allowed for the endpoint.
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
