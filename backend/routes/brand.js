const router = require('express').Router();
const Brand = require('../models/Brand');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Routes publiques
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 });
        res.json({ brands });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Routes admin
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
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

router.patch('/:brandId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
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

router.delete('/:brandId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Marque non trouvée' });
        }
        res.json({ message: 'Marque supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 