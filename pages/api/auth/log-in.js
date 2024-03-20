/**
 * @swagger
 * /api/auth/log-in:
 *   post:
 *     summary: Connectez-vous avec un email et un mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'adresse e-mail de l'utilisateur.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Le mot de passe de l'utilisateur.
 *     responses:
 *       200:
 *         description: Connexion réussie. Retourne les informations de l'utilisateur et un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indique si la connexion a réussi.
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: L'adresse e-mail de l'utilisateur.
 *                       example: user@example.com
 *                 token:
 *                   type: string
 *                   description: Le token JWT généré pour l'utilisateur.
 *       400:
 *         description: Mauvaise requête. L'email ou le mot de passe est manquant.
 *       401:
 *         description: Non autorisé. L'email ou le mot de passe est incorrect.
 *       500:
 *         description: Erreur interne du serveur. Échec de la connexion.
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const clientPromise = MongoClient.connect(process.env.MONGODB_URI);
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            const client = await clientPromise;
            const db = client.db('netflex-db');

            const user = await db.collection('users').findOne({ email });

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ success: true, user: { email: user.email }, token });
        } catch (error) {
            console.error('Error logging in:', error);
            return res.status(500).json({ error: 'Failed to log in' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
