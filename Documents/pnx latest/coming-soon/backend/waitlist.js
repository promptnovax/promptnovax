// Node.js/Express Backend for Waitlist
// Install: npm install express mysql2 cors dotenv

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'pnx_waitlist'
};

// Create database connection pool
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database table
async function initDatabase() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS waitlist (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address VARCHAR(45),
                user_agent TEXT,
                status ENUM('pending', 'confirmed', 'notified') DEFAULT 'pending',
                INDEX idx_email (email),
                INDEX idx_created (created_at)
            )
        `);
        connection.release();
        console.log('Database initialized');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Waitlist endpoint
app.post('/api/waitlist', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        
        const connection = await pool.getConnection();
        
        // Check if email exists
        const [existing] = await connection.query(
            'SELECT id, status FROM waitlist WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            connection.release();
            return res.json({
                success: true,
                message: 'Email already registered',
                already_registered: true
            });
        }
        
        // Insert new email
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.get('user-agent') || '';
        
        await connection.query(
            'INSERT INTO waitlist (email, ip_address, user_agent) VALUES (?, ?, ?)',
            [email, ip_address, user_agent]
        );
        
        connection.release();
        
        // Optional: Send confirmation email
        // await sendConfirmationEmail(email);
        
        res.json({
            success: true,
            message: 'Successfully added to waitlist',
            already_registered: false
        });
        
    } catch (error) {
        console.error('Waitlist error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

// Get waitlist stats (optional, for admin)
app.get('/api/waitlist/stats', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [stats] = await connection.query(
            'SELECT COUNT(*) as total, COUNT(CASE WHEN status = "confirmed" THEN 1 END) as confirmed FROM waitlist'
        );
        connection.release();
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await initDatabase();
    console.log(`Waitlist API server running on port ${PORT}`);
});

