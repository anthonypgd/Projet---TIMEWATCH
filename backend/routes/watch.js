const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Watch = require('../models/Watch');
const Like = require('../models/Like');
const Brand = require('../models/Brand');

// Créer une montre
router.post('/watch', authMiddleware, async (req, res) => {
    try {
        // Vérifier l'authentification
        if (!req.user) {
            return res.status(401).json({ message: 'Token invalide' });
        }

        // Vérifier si la marque existe
        const brand = await Brand.findById(req.body.marque);
        if (!brand) {
            return res.status(404).json({ message: 'Marque non trouvée' });
        }

        const watchData = {
            ...req.body,
            owner: req.user.userId  // Ajouter l'ID de l'utilisateur
        };

        const newWatch = new Watch(watchData);
        const savedWatch = await newWatch.save();

        res.status(201).json({ 
            message: 'Montre ajoutée avec succès', 
            watch: savedWatch 
        });
    } catch (error) {
        console.error('Erreur création montre:', error);
        res.status(500).json({ message: error.message });
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
        const watches = await Watch.find()
            .populate('owner', 'username')
            .populate('marque', 'name')
            .sort({ createdAt: -1 });

        const userLikes = await Like.find({ user: req.user.userId })
            .select('watch');
        
        const likedWatchIds = new Set(userLikes.map(like => like.watch.toString()));

        const watchesWithLikeStatus = watches.map(watch => ({
            ...watch.toObject(),
            isLiked: likedWatchIds.has(watch._id.toString())
        }));

        res.status(200).json({ watches: watchesWithLikeStatus });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des montres' });
    }
});

// Récupérer les montres d'un utilisateur
router.get('/user/:user_id', authMiddleware, async (req, res) => {
    try {
        const watches = await Watch.find({ owner: req.params.user_id })
            .populate('owner', 'username email')
            .populate('marque', 'name')
            .sort({ createdAt: -1 });  // Tri par date de création décroissante

        // Log pour déboguer
        console.log('Watches après populate:', JSON.stringify(watches[0], null, 2));

        // Récupérer les likes de l'utilisateur connecté
        const userLikes = await Like.find({ user: req.user.userId })
            .select('watch');
        
        const likedWatchIds = userLikes.map(like => like.watch.toString());

        // Ajouter le statut "liked" à chaque montre
        const watchesWithLikeStatus = watches.map(watch => {
            const watchObj = watch.toObject();
            return {
                ...watchObj,
                isLiked: likedWatchIds.includes(watch._id.toString())
            };
        });

        res.status(200).json({ watches: watchesWithLikeStatus });
    } catch (error) {
        console.error('Erreur récupération montres:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route pour supprimer une montre
router.delete('/watch/:watch_id', authMiddleware, async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.watch_id);
        
        if (!watch) {
            return res.status(404).json({ error: 'Montre introuvable' });
        }

        // Vérifier si l'utilisateur est le propriétaire ou un admin
        if (watch.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Non autorisé à supprimer cette montre' });
        }

        await Watch.findByIdAndDelete(req.params.watch_id);
        
        // Supprimer aussi les likes associés
        await Like.deleteMany({ watch: watch._id });

        res.status(200).json({ message: 'Montre supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la montre' });
    }
});

// Route admin pour récupérer toutes les montres
router.get('/admin/watches', authMiddleware, async (req, res) => {
    try {
        const watches = await Watch.find()
            .populate('owner', 'username')
            .populate('marque', 'name')
            .sort({ createdAt: -1 });  // Tri par date de création décroissante

        res.json({ watches });
    } catch (error) {
        console.error('Error fetching watches:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;