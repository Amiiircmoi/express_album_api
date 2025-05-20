# Exercices - Création de ressources API
TP réalisé dans le cadre du cours API & Web Services.

## Installation
Node & npm sont nécessaires pour lancer le projet.

```bash
npm install
```

## Configuration

Copier .env en .env.local et configurer les variables d'environnement.

## Lancer le projet

```bash
npm start
```

## Tester l'API avec Postman

Importer le fichier `tests.postman_collection.json` dans Postman pour tester les différentes routes de l'API.
Il est préférable de lancer les requêtes dans l'ordre affiché sur Postman pour éviter les erreurs.
Pensez à modifier les identifiants des requêtes pour correspondre à ceux de votre base de données.

## Auth JWT
L'API utilise le JWT pour l'authentification. Un token est généré lors de la connexion et doit être inclus dans les en-têtes des requêtes pour accéder aux routes protégées.
Pour se connecter, utilisez les identifiants suivants : admin / admin sur la route `/login`.

## Validation des données
Un exemple de validation des données est fourni dans le fichier `src/middlewares/validation.js`. Il est mis en pratique sur la route de création d'album.

## Rate Limiting

Une limitation d'utilisation est mise en place pour éviter les abus. Si un utilisateur effectue plus de 100 requêtes en moins de 1 heure, il sera bloqué et un message lui sera affiché.

## HTTPS

L'API est configurée pour fonctionner en HTTPS. Pour cela il suffit d'utiliser le port 8080 au lieu du port 3000 et bien sûr d'utiliser https://localhost:8080 dans Postman ou tout autre client HTTP.