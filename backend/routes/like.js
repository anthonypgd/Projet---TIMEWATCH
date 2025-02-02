const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Like = require('../models/Like');
const Watch = require('../models/Watch');

// Route pour vérifier si une montre est likée
router.get('/check/:watchId', authMiddleware, async (req, res) => {
    try {
        const like = await Like.findOne({
            user: req.user.userId,
            watch: req.params.watchId
        });
        res.json({ liked: !!like });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification du like' });
    }
});

// Route pour liker/unliker
router.post('/toggle/:watchId', authMiddleware, async (req, res) => {
    try {
        const watchId = req.params.watchId;
        const userId = req.user.userId;

        const watch = await Watch.findById(watchId);
        if (!watch) {
            return res.status(404).json({ message: 'Montre non trouvée' });
        }

        const existingLike = await Like.findOne({ user: userId, watch: watchId });

        if (existingLike) {
            // Retirer le like
            await Like.deleteOne({ _id: existingLike._id });
            // Décrémenter le compteur
            await Watch.findByIdAndUpdate(watchId, { $inc: { likesCount: -1 } });
            res.json({ message: 'Like retiré', liked: false });
        } else {
            // Ajouter le like
            const newLike = new Like({
                user: userId,
                watch: watchId
            });
            await newLike.save();
            // Incrémenter le compteur
            await Watch.findByIdAndUpdate(watchId, { $inc: { likesCount: 1 } });
            res.json({ message: 'Montre likée', liked: true });
        }
    } catch (error) {
        console.error('Erreur like:', error);
        res.status(500).json({ message: 'Erreur lors du like' });
    }
});

// Route pour obtenir les montres likées par l'utilisateur
router.get('/user/likes', authMiddleware, async (req, res) => {
    try {
        const likes = await Like.find({ user: req.user.userId })
            .populate({
                path: 'watch',
                populate: { path: 'owner', select: 'username' }
            });

        const watches = likes.map(like => like.watch);
        res.json({ watches });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des likes' });
    }
});

module.exports = router; 