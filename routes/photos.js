const express = require('express');
const router = express.Router();

const Album = require('../models/album');
const Photo = require('../models/photo');

/**
 * 1. GET /album/:idalbum/photos
 *    Récupérer toutes les photos d'un album.
 */
router.get('/album/:idalbum/photos', async (req, res) => {
    try {
        // On peuple l'album pour récupérer toutes ses photos
        const album = await Album.findById(req.params.idalbum).populate('photos');
        if (!album) {
            return res.status(404).json({ error: 'Album non trouvé' });
        }
        res.status(200).json(album.photos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 2. GET /album/:idalbum/photo/:idphotos
 *    Récupérer une photo spécifique d'un album.
 */
router.get('/album/:idalbum/photo/:idphotos', async (req, res) => {
    try {
        const photo = await Photo.findOne({
            _id: req.params.idphotos,
            album: req.params.idalbum
        });
        if (!photo) {
            return res.status(404).json({ error: 'Photo non trouvée pour cet album' });
        }
        res.status(200).json(photo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 3. POST /album/:idalbum/photo
 *    Ajouter une nouvelle photo à un album.
 */
router.post('/album/:idalbum/photo', async (req, res) => {
    try {
        const { title, url, description } = req.body;

        // Vérifier si l'album existe
        const album = await Album.findById(req.params.idalbum);
        if (!album) {
            return res.status(404).json({ error: 'Album non trouvé' });
        }

        // Vérifier les champs obligatoires
        if (!title || !url) {
            return res.status(400).json({ error: 'title et url sont requis' });
        }

        // Créer la photo
        const newPhoto = await Photo.create({
            title,
            url,
            description,
            album: album._id
        });

        // Mettre à jour la liste de photos dans l'album
        album.photos.push(newPhoto._id);
        await album.save();

        res.status(201).json(newPhoto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 4. PUT /album/:idalbum/photo/:idphotos
 *    Mettre à jour une photo existante dans un album.
 */
router.put('/album/:idalbum/photo/:idphotos', async (req, res) => {
    try {
        const { title, url, description } = req.body;

        // Vérifier si la photo appartient bien à l'album
        let photo = await Photo.findOne({
            _id: req.params.idphotos,
            album: req.params.idalbum
        });
        if (!photo) {
            return res.status(404).json({ error: 'Photo non trouvée pour cet album' });
        }

        // Mettre à jour les champs
        if (title !== undefined) photo.title = title;
        if (url !== undefined) photo.url = url;
        if (description !== undefined) photo.description = description;

        // Sauvegarder les modifications
        photo = await photo.save();

        res.status(200).json(photo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 5. DELETE /album/:idalbum/photo/:idphotos
 *    Supprimer une photo d'un album.
 */
router.delete('/album/:idalbum/photo/:idphotos', async (req, res) => {
    try {
        // Vérifier si la photo existe et appartient à l'album
        const photo = await Photo.findOne({
            _id: req.params.idphotos,
            album: req.params.idalbum
        });
        if (!photo) {
            return res.status(404).json({ error: 'Photo non trouvée pour cet album' });
        }

        // Supprimer la photo
        await photo.deleteOne();

        // Retirer la référence de la photo dans l'album
        const album = await Album.findById(req.params.idalbum);
        if (album) {
            album.photos = album.photos.filter(
                (photoId) => photoId.toString() !== req.params.idphotos
            );
            await album.save();
        }

        res.status(200).json({ message: 'Photo supprimée avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
