const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const Watch = require('../models/Watch');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); // ODM pour MongoDB
const jwt = require('jsonwebtoken');  // Bibliothèque pour les tokens

// Obtenir les informations de l'utilisateur
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Obtenir les montres d'un utilisateur
router.get('/watches', authMiddleware, async (req, res) => {
    try {
        const watches = await Watch.find({ owner: req.user.userId });
        res.json({ watches });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des montres' });
    }
});

// Mettre à jour le profil utilisateur
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { username, email } = req.body;

        // Vérifier si le nouvel email ou username n'est pas déjà utilisé
        const existingUser = await User.findOne({
            $and: [
                { _id: { $ne: req.user.userId } },
                { $or: [{ email }, { username }] }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'Cet email ou nom d\'utilisateur est déjà utilisé' 
            });
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { username, email },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({ 
            message: 'Profil mis à jour avec succès',
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
    }
});

// Mettre à jour le mot de passe
router.put('/password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Récupérer l'utilisateur avec le mot de passe
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier l'ancien mot de passe
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe
        await User.findByIdAndUpdate(req.user.userId, {
            password: hashedPassword
        });

        res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe' });
    }
});

module.exports = router;