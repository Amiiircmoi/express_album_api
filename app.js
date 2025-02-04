const dotenv = require('dotenv');
const fs = require('fs');

// Charge les variables d'environnement à partir du fichier .env.local s'il existe
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const express = require('express');
const mongoose = require('mongoose');

const app = express();

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

// Utilisation des routes
app.use('/api', albumRoutes);
app.use('/api', photoRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
