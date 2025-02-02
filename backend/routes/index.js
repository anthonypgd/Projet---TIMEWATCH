const express = require('express');
const router = express.Router();

// Import des routes
const authRoutes = require('./auth');
const watchRoutes = require('./watch');
const adminRoutes = require('./admin');
const commentRoutes = require('./comment');
const userRoutes = require('./user');

// Montage des routes
router.use('/auth', authRoutes);
router.use('/watches', watchRoutes);
router.use('/admin', adminRoutes);
router.use('/comments', commentRoutes);
router.use('/user', userRoutes);

// Ne garder ici que les routes qui ne sont pas déjà définies individuellement
router.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

// Gestion des routes non trouvées dans /api
router.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route API non trouvée',
        path: req.originalUrl 
    });
});

module.exports = router;
