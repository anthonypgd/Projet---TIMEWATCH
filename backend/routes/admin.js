const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Watch = require('../models/Watch');

// Route de test
router.get('/test', (req, res) => {
    res.json({ message: 'Admin routes working' });
});

// Routes admin protégées
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Récupérer tous les utilisateurs sauf le mot de passe
        const users = await User.find().select('-password');
        console.log('Users found:', users); // Debug
        
        if (!users || users.length === 0) {
            console.log('No users found'); // Debug
            return res.json({ users: [] });
        }
        
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message });
    }
});

// Supprimer un utilisateur
router.delete('/users/:userId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        // Supprimer aussi toutes les montres de l'utilisateur
        await Watch.deleteMany({ owner: req.params.userId });
        res.json({ message: 'Utilisateur et ses montres supprimés avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// Obtenir toutes les montres
router.get('/watches', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Récupérer toutes les montres avec les infos du propriétaire
        const watches = await Watch.find().populate('owner', 'username email');
        console.log('Watches found:', watches); // Debug
        
        if (!watches || watches.length === 0) {
            console.log('No watches found'); // Debug
            return res.json({ watches: [] });
        }
        
        res.json({ watches });
    } catch (error) {
        console.error('Error fetching watches:', error);
        res.status(500).json({ message: error.message });
    }
});

// Supprimer une montre
router.delete('/watches/:watchId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const watch = await Watch.findByIdAndDelete(req.params.watchId);
        if (!watch) {
            return res.status(404).json({ message: 'Montre non trouvée' });
        }
        res.json({ message: 'Montre supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// Vérifier que les vérifications admin utilisent req.user.role
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }
    next();
};

module.exports = router; 