const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /login
router.post('/login', (req, res) => {
    const { username, password } = req.query;

    console.log('Tentative de connexion avec:', username, password);
    // SOLUTION TEMPORAIRE DE TEST À REMPLACER PAR UN VÉRITABLE SYSTÈME D'AUTHENTIFICATION VIA BDD ET CHANGER LE SECRET
    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign(username, 'secret');
        return res.json({ token });
    }
    res.status(401).json({ error: 'Identifiants invalides' });
});

module.exports = router;
