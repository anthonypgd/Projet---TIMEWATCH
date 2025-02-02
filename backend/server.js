const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/index');  // Import des routes

const app = express();

// Middleware de base
app.use(cors({
    origin: 'http://localhost:5173', // URL de votre frontend Vite
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Log toutes les requêtes
app.use((req, res, next) => {
    console.log('Requête reçue:', {
        method: req.method,
        path: req.path,
        headers: req.headers
    });
    next();
});

// Routes API
app.use('/api', routes);

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
        message: 'Erreur serveur', 
        error: err.message 
    });
});

module.exports = app; 