require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validatePassword } = require('../utils/validators');

async function createAdmin() {
    try {
        // Se connecter à la base de données
        console.log('Connexion à la base de données...');
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connecté à la base de données');
        
        // Données de l'admin
        const password = 'Admin123@#';
        
        // Valider le mot de passe
        const validation = validatePassword(password);
        if (!validation.isValid) {
            throw new Error(validation.message);
        }

        const adminData = {
            username: 'admin',
            email: 'admin@timewatch.com',
            password: await bcrypt.hash(password, 10),
            role: 'admin'
        };

        // Vérifier si l'admin existe déjà
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Un admin existe déjà avec cet email');
            await mongoose.connection.close();
            process.exit(0);
        }

        console.log('Création de l\'admin...');
        const admin = new User(adminData);
        await admin.save();
        
        console.log('Admin créé avec succès!');
        console.log('Email:', adminData.email);
        console.log('Mot de passe:', password);
        console.log('⚠️  Notez bien ces identifiants!');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Erreur:', error.message);
        if (mongoose.connection) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

createAdmin(); 