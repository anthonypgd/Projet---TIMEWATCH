const express = require('express');
const router = express.Router();

// Import des routes
const authRoutes = require('./auth');
const watchRoutes = require('./watch');
const adminRoutes = require('./admin');
const commentRoutes = require('./comment');
const userRoutes = require('./user');
const brandRoutes = require('./brand');

// Montage des routes
router.use('/auth', authRoutes);
router.use('/watches', watchRoutes);
router.use('/admin', adminRoutes);  // Toutes les routes admin sont protégées
router.use('/comments', commentRoutes);
router.use('/user', userRoutes);
router.use('/brands', brandRoutes);

// Route de base
router.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

// Gestion des routes non trouvées
router.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route API non trouvée',
        path: req.originalUrl 
    });
});

module.exports = router;
