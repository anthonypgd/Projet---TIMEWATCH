const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        console.log('Headers reçus:', req.headers);
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        // Vérifier si le token commence déjà par "Bearer"
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        console.log('Token extrait:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token décodé:', decoded);
        
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        return res.status(401).json({ message: 'Token invalide' });
    }
};

module.exports = authMiddleware;