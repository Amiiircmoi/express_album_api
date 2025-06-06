const dotenv = require('dotenv');
const fs = require('fs');

// Charge les variables d'environnement à partir du fichier .env.local s'il existe
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const helmet = require('helmet');
const cors = require('cors');

const express = require('express');
const mongoose = require('mongoose');

const http = require('http');
const https = require('https');
var privateKey = fs.readFileSync('./selfsigned.key', 'utf8');
var certificate = fs.readFileSync('./selfsigned.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

const app = express();

// Utilisation de helmet pour sécuriser les en-têtes HTTP
app.use(helmet()); // Configuration par défaut de helmet

// Utilisation de cors pour contrôler les requêtes cross-origin
app.use(cors({
  origin: '*', // Autorise pour l'instant toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  credentials: true // Autorise les cookies et les informations d'identification
}));

// Middleware pour parser le JSON (au lieu de body-parser)
app.use(express.json());

const rateLimit = require('express-rate-limit');

// Configure le rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure en millisecondes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  standardHeaders: true, // renvoie RateLimit-* headers
  legacyHeaders: false, // désactive les X-RateLimit-* headers
  handler: (req, res) => { // callback quand on dépasse la limite
    res.status(429).json({
      error: 'Trop de requêtes — attends une heure avant de réessayer'
    });
  },
});

// Applique le limiter à toutes les routes de l’API
app.use(limiter);

// Connexion à la base de données en utilisant la variable d'environnement
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Import des routes
const albumRoutes = require('./routes/albums');
const photoRoutes = require('./routes/photos');
const authRoutes = require("./routes/auth");
const pipelineRoutes = require('./routes/pipeline');

// Middleware d'authentification pour toutes les routes API
const authenticateJWT = require('./middlewares/auth');
app.use('/api', authenticateJWT);

// Utilisation des routes
app.use('/api', albumRoutes);
app.use('/api', photoRoutes);
app.use('/', authRoutes);
app.use('/api', pipelineRoutes);

// Démarrage du serveur
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
httpsServer.listen(8080);
console.log('HTTP Server running on port 8080');
