const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Watch = require('../models/Watch');

// Protéger toutes les routes admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Route de test
router.get('/test', (req, res) => {
    res.json({ message: 'Admin routes working' });
});

// Obtenir tous les utilisateurs
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Supprimer un utilisateur
router.delete('/users/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir toutes les montres
router.get('/watches', async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const watches = await Watch.find()
            .populate({
                path: 'owner',
                select: 'username'
            })
            .populate({
                path: 'marque',
                model: 'Brand',
                select: 'name'
            })
            .sort({ createdAt: -1 });

        console.log('Watches après populate:', watches);

        res.json({ watches });
    } catch (error) {
        console.error('Error fetching watches:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer une montre
router.delete('/watches/:watchId', async (req, res) => {
    try {
        const watch = await Watch.findByIdAndDelete(req.params.watchId);
        if (!watch) {
            return res.status(404).json({ message: 'Montre non trouvée' });
        }
        res.json({ message: 'Montre supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour le rôle d'un utilisateur
router.patch('/users/:userId/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { role },
            { new: true }
        ).select('-password');
        
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 