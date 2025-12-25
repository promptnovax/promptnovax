import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    try {
        const subscriber = await prisma.subscriber.create({
            data: {
                email: email.toLowerCase(),
            },
        });

        return res.status(200).json(subscriber);
    } catch (error) {
        if (error.code === 'P2002') {
            // Unique constraint violation (email already exists)
            return res.status(409).json({ message: 'Email already registered' });
        }

        console.error('Request error', error);
        res.status(500).json({ error: 'Error creating subscriber', message: error.message });
    }
}
