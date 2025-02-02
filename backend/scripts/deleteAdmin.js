require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function deleteAdmin() {
    try {
        console.log('Connexion à la base de données...');
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connecté à la base de données');

        // Supprimer l'admin
        const result = await User.deleteOne({ email: 'admin@timewatch.com' });

        if (result.deletedCount > 0) {
            console.log('Admin supprimé avec succès');
        } else {
            console.log('Aucun admin trouvé');
        }

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

deleteAdmin(); 