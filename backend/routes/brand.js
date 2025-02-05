const router = require('express').Router();
const Brand = require('../models/Brand');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Route GET pour récupérer toutes les marques
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 });
        res.json({ brands });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Créer une nouvelle marque (admin seulement)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const brand = new Brand({
            name: req.body.name,
            description: req.body.description,
            country: req.body.country,
            logo: req.body.logo
        });

        const savedBrand = await brand.save();
        res.status(201).json({ brand: savedBrand });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Mettre à jour une marque (admin seulement)
router.patch('/:brandId', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const brand = await Brand.findByIdAndUpdate(
            req.params.brandId,
            { $set: req.body },
            { new: true }
        );

        if (!brand) {
            return res.status(404).json({ message: 'Marque non trouvée' });
        }

        res.json({ brand });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer une marque (admin seulement)
router.delete('/:brandId', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const brand = await Brand.findByIdAndDelete(req.params.brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Marque non trouvée' });
        }

        res.json({ message: 'Marque supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route GET pour récupérer toutes les marques (admin seulement)
router.get('/admin/brands', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 });
        res.json({ brands });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 