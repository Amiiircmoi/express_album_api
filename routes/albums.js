const express = require('express');
const router = express.Router();

const Album = require('../models/album');

/**
 * 1. GET /album/:id
 *    Récupérer un album par son ID.
 *    - Utilise populate pour récupérer les photos liées à l'album.
 */
router.get('/album/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id).populate('photos');
        if (!album) {
            return res.status(404).json({ error: 'Album non trouvé' });
        }
        res.status(200).json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 2. POST /album
 *    Créer un nouvel album.
 */
router.post('/album', async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Le champ title est requis.' });
        }

        const newAlbum = await Album.create({ title, description });
        res.status(201).json(newAlbum);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 3. PUT /album/:id
 *    Mettre à jour un album existant.
 */
router.put('/album/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedAlbum = await Album.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true } // pour renvoyer l'album mis à jour
        );

        if (!updatedAlbum) {
            return res.status(404).json({ error: 'Album non trouvé' });
        }

        res.status(200).json(updatedAlbum);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 4. DELETE /album/:id
 *    Supprimer un album.
 */
router.delete('/album/:id', async (req, res) => {
    try {
        const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
        if (!deletedAlbum) {
            return res.status(404).json({ error: 'Album non trouvé' });
        }
        res.status(200).json({ message: 'Album supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 5. GET /albums
 *    Récupérer tous les albums, avec un filtrage sur le titre possible (?title=...)
 */
router.get('/albums', async (req, res) => {
    try {
        const { title } = req.query;
        let query = {};

        if (title) {
            // Recherche insensible à la casse sur le champ title
            query.title = { $regex: title, $options: 'i' };
        }

        const albums = await Album.find(query).populate('photos');
        res.status(200).json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
