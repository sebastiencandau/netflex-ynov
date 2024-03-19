import clientPromise from "/lib/mongodb";
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

    const idMovie = parseInt(req.query.idMovie, 10);

    const client = await clientPromise;
    const db = client.db("netflex-db");

    switch (req.method) {

        case "PATCH":

            const token = req.headers.authorization;
            console.log("token", token)
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            try {
                // Vérifier et décoder le token JWT
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

                console.log(decodedToken)

                const like = await db.collection("likes").findOne({ idTMDB: idMovie });
                let resMongo, data;

                if (like) {
                    resMongo = await db.collection("likes").updateOne(
                        { idTMDB: idMovie },
                        { $inc: { likeCounter: 1 } }
                    )
                    // Récupérer le nombre total de likes après l'incrémentation
                    const totalLikes = await db.collection("likes").findOne({ idTMDB: idMovie });

                    data = {
                        action: 'likeCounter incremented',
                        idMovie: idMovie,
                        matchedCount: resMongo.matchedCount,
                        modifiedCount: resMongo.modifiedCount,
                        totalLikes: totalLikes.likeCounter // Ajouter le nombre total de likes à la réponse
                    };
                    res.status(201).json({ status: 201, data: data });
                } else {
                    resMongo = await db.collection("likes").insertOne(
                        { idTMDB: idMovie, likeCounter: 0 }
                    )
                    data = {
                        action: 'likeCounter created',
                        idMovie: idMovie,
                        insertedId: resMongo.insertedId
                    }
                    res.status(201).json({ status: 201, data: data });
                }

            } catch (error) {
                console.error('Error verifying JWT token:', error);
                return res.status(401).json({ error: 'Unauthorized' });
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
