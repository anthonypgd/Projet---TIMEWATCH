# TimeWatch - Votre Collection de Montres en Ligne

TimeWatch est une application web dédiée aux passionnés d'horlogerie, permettant de gérer et partager sa collection de montres.

## 🌟 Fonctionnalités

### Utilisateurs
- Création de compte et authentification sécurisée
- Publication de montres avec photos et descriptions détaillées
- Recherche avancée par marque, modèle, état ou type de mouvement
- Système de likes et d'interactions avec la communauté
- Profil personnalisé avec sa collection
- Interface responsive et intuitive

### Administration
- Dashboard administrateur complet
- Gestion des utilisateurs et des droits
- Administration des marques de montres
- Modération des publications

## 🛠 Technologies

### Frontend
- React.js avec Vite
- TailwindCSS pour le style
- React Router pour la navigation
- Context API pour la gestion d'état

### Backend
- Node.js & Express.js
- MongoDB avec Mongoose
- JWT pour l'authentification
- Middleware de sécurité personnalisé

## 📦 Installation

1. **Cloner le projet**
bash

git clone https://github.com/votre-username/timewatch.git
cd timewatch


2. **Installation des dépendances**
bash

-Backend-

cd backend
npm install

Frontend

cd ../timewatch
npm install

3. **Configuration**

Créez un fichier `.env` dans le dossier backend :
env

DATABASE_URL=votre_url_mongodb
JWT_SECRET=votre_secret_jwt
PORT=3002


Créez un fichier `.env` dans le dossier timewatch :
env

VITE_API_URL=http://localhost:3002


4. **Démarrage**
bash

-Backend-

cd backend
npm run start

-Frontend-

cd ../timewatch
npm run dev


## 🚀 Utilisation

### Compte Standard
1. Inscrivez-vous ou connectez-vous
2. Explorez la collection de montres
3. Ajoutez vos montres avec photos et descriptions
4. Interagissez avec la communauté via les likes

### Compte Administrateur
1. Accédez au dashboard admin
2. Gérez les utilisateurs et les marques
3. Modérez le contenu
4. Supervisez l'activité du site

## 🔒 Sécurité
- Authentification sécurisée par JWT
- Protection des routes sensibles
- Validation des données entrantes
- Gestion des rôles utilisateur/admin
- Middleware d'authentification personnalisé

## 📁 Structure du Projet
timewatch/
├── backend/
│ ├── models/ # Schémas MongoDB
│ ├── routes/ # Routes API
│ ├── middleware/ # Middlewares
│ └── config/ # Configuration
└── timewatch/
├── src/
│ ├── components/ # Composants React
│ ├── screens/ # Pages
│ ├── context/ # Context API
│ └── assets/ # Ressources


## 🌐 API Endpoints

### Authentification
- POST `/api/auth/register` - Inscription
- POST `/api/auth/login` - Connexion

### Montres
- GET `/api/watches` - Liste des montres
- POST `/api/watches/watch` - Ajouter une montre
- GET `/api/watches/:id` - Détails d'une montre
- DELETE `/api/watches/:id` - Supprimer une montre

### Administration
- GET `/api/admin/users` - Liste des utilisateurs
- GET `/api/admin/watches` - Gestion des montres
- GET `/api/admin/brands` - Gestion des marques

## 📱 Captures d'écran
[Ajoutez vos captures d'écran ici]

## 🤝 Contribution
Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License
Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## 📧 Contact
Pangaud - a.pangaud@cfa-insta.fr

Lien du projet: [https://github.com/anthonypgd/Projet---TIMEWATCH.git](https://github.com/anthonypgd/Projet---TIMEWATCH.git)