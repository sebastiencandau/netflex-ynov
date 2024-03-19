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

            // Vérifiez si l'utilisateur existe déjà dans la base de données
            const existingUser = await db.collection('users').findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash du mot de passe avant de l'enregistrer dans la base de données
            const hashedPassword = await bcrypt.hash(password, 10);

            // Si l'utilisateur n'existe pas, créez un nouvel utilisateur avec le mot de passe crypté
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
