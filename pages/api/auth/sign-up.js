/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: Créez un nouveau compte utilisateur avec une adresse e-mail et un mot de passe.
 *     description: Crée un nouveau compte utilisateur en fournissant une adresse e-mail et un mot de passe.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Objet contenant les informations d'inscription de l'utilisateur.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: L'adresse e-mail de l'utilisateur.
 *             password:
 *               type: string
 *               description: Le mot de passe de l'utilisateur.
 *     responses:
 *       '201':
 *         description: Compte utilisateur créé avec succès. Retourne les informations de l'utilisateur et un token JWT.
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               description: Indique si la création du compte a réussi.
 *             user:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: L'adresse e-mail de l'utilisateur.
 *                   example: user@example.com
 *             token:
 *               type: string
 *               description: Le token JWT généré pour l'utilisateur.
 *       '400':
 *         description: Mauvaise requête. L'email ou le mot de passe est manquant.
 *       '409':
 *         description: Conflit. L'utilisateur avec cette adresse e-mail existe déjà.
 *       '500':
 *         description: Erreur interne du serveur. Échec de la création du compte utilisateur.
 */
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const clientPromise = MongoClient.connect(process.env.MONGODB_URI);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            const client = await clientPromise;
            const db = client.db('netflex-db');

            const existingUser = await db.collection('users').findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.collection('users').insertOne({ email, password: hashedPassword });

            return res.status(201).json({ success: true, message: 'User registered successfully' });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ error: 'Failed to register user' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
