const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    jwt.verify(token, 'secret', (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalide' });
        req.user = user; // payload du token
        next();
    });
};

module.exports = authenticateJWT;
