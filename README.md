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