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

// Connexion à la base de données en utilisant la variable d'environnement
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Import des routes
const albumRoutes = require('./routes/albums');
const photoRoutes = require('./routes/photos');
const authRoutes = require("./routes/auth");

// Middleware d'authentification pour toutes les routes API
const authenticateJWT = require('./middlewares/auth');
app.use('/api', authenticateJWT);

// Utilisation des routes
app.use('/api', albumRoutes);
app.use('/api', photoRoutes);
app.use('/', authRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
