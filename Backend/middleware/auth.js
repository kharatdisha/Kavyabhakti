require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// ❌ Exit if JWT_SECRET is missing
if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in environment variables.');
    process.exit(1);
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    // ✅ Check if authHeader exists and starts with "Bearer "
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token missing.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach decoded token payload to req.admin
        req.admin = decoded;

        next(); // proceed to next middleware or route
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = { verifyToken, JWT_SECRET };