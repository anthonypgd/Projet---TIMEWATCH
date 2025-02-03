const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Comment = require('../models/Comment');
const Watch = require('../models/Watch');

// Créer un commentaire
router.post('/watch/:watchId', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const { watchId } = req.params;

        // Vérifier si la montre existe
        const watch = await Watch.findById(watchId);
        if (!watch) {
            return res.status(404).json({ message: 'Montre non trouvée' });
        }

        const newComment = new Comment({
            content,
            author: req.user.userId,
            watch: watchId
        });

        await newComment.save();

        // Populate l'auteur pour la réponse
        const populatedComment = await Comment.findById(newComment._id)
            .populate('author', 'username');

        res.status(201).json({ 
            message: 'Commentaire ajouté avec succès',
            comment: populatedComment
        });
    } catch (error) {
        console.error('Erreur création commentaire:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du commentaire' });
    }
});

// Obtenir les commentaires d'une montre
router.get('/watch/:watchId', authMiddleware, async (req, res) => {
    try {
        const comments = await Comment.find({ watch: req.params.watchId })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.json({ comments });
    } catch (error) {
        console.error('Erreur récupération commentaires:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
    }
});

// Supprimer un commentaire
router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }

        // Vérifier si l'utilisateur est l'auteur ou admin
        if (comment.author.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé à supprimer ce commentaire' });
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: 'Commentaire supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 