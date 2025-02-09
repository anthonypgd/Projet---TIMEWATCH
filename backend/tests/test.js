const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Test de création et vérification d'un utilisateur
async function testCreateAndVerifyUser() {
    try {
        // Connexion à la base de données
        await require('mongoose').connect(process.env.DATABASE_URL);
        
        // Données de test pour la création
        const newUserData = {
            username: 'testuser',
            email: 'test@test.com',
            password: await bcrypt.hash('TestPassword123!', 10),
            role: 'user'
        };

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ 
            $or: [
                { email: newUserData.email }, 
                { username: newUserData.username }
            ] 
        });

        if (existingUser) {
            console.log(' Un utilisateur existe déjà avec cet email ou username');
            return;
        }

        // Création et sauvegarde de l'utilisateur
        const savedUser = await new User(newUserData).save();
        console.log(' Utilisateur sauvegardé en BDD \n');

        // Test de vérification
        console.log(' Comparaison des données :');
        console.log('------------------------');
        console.log('Données envoyées :', {
            username: newUserData.username,
            email: newUserData.email,
            role: newUserData.role
        });
        console.log('Données en BDD :', {
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role
        });
        console.log('------------------------');
        console.log('Username identique :', savedUser.username === newUserData.username);
        console.log('Email identique :', savedUser.email === newUserData.email);
        console.log('Role identique :', savedUser.role === newUserData.role);

        // Nettoyage
        await User.deleteOne({ email: newUserData.email });
        console.log(' Nettoyage BDD effectué');

    } catch (error) {
        console.error(' Erreur :', error.message);
    } finally {
        await require('mongoose').connection.close();
        console.log(' Connexion BDD fermée');
    }
}

// Exécution du test
require('dotenv').config();
testCreateAndVerifyUser(); 