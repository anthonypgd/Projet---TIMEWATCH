const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Watch = require('../models/Watch');
const Like = require('../models/Like');

// Créer une montre
router.post('/watch', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        const watchData = req.body;
        const newWatch = new Watch({
            ...watchData,
            owner: req.user.userId
        });

        const savedWatch = await newWatch.save();
        res.status(201).json({ 
            message: 'Montre ajoutée avec succès', 
            watch: savedWatch 
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la montre' });
    }
});

// Récupérer une montre spécifique
router.get('/watch/:watch_id', authMiddleware, async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.watch_id)
            .populate('owner', 'username');
        
        if (!watch) {
            return res.status(404).json({ error: 'Montre introuvable' });
        }

        // Vérifier si l'utilisateur a liké cette montre
        const isLiked = await Like.exists({
            user: req.user.userId,
            watch: watch._id
        });

        res.status(200).json({ 
            watch,
            isLiked: !!isLiked
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la montre' });
    }
});

// Récupérer toutes les montres
router.get('/watches', authMiddleware, async (req, res) => {
    try {
        const watches = await Watch.find().populate('owner', 'username');
        
        // Récupérer les likes de l'utilisateur connecté
        const userLikes = await Like.find({ user: req.user.userId })
            .select('watch');
        
        const likedWatchIds = userLikes.map(like => like.watch.toString());

        // Ajouter le statut "liked" à chaque montre
        const watchesWithLikeStatus = watches.map(watch => ({
            ...watch.toObject(),
            isLiked: likedWatchIds.includes(watch._id.toString())
        }));

        res.status(200).json({ watches: watchesWithLikeStatus });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des montres' });
    }
});

// Supprimer une montre
router.delete('/watch/:watch_id', authMiddleware, async (req, res) => {
    try {
        const watch = await Watch.findByIdAndDelete(req.params.watch_id);
        if (!watch) {
            return res.status(404).json({ error: 'Montre introuvable' });
        }
        res.status(200).json({ message: 'Montre supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la montre' });
    }
});

// Récupérer les montres d'un utilisateur
router.get('/user/:user_id', authMiddleware, async (req, res) => {
    try {
        const watches = await Watch.find({ owner: req.params.user_id });
        res.status(200).json({ watches });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des montres' });
    }
});

module.exports = router;