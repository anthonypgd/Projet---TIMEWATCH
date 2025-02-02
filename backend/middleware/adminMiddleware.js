const adminMiddleware = (req, res, next) => {
    console.log('Admin Middleware - User:', {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    });
    
    if (req.user && req.user.role === 'admin') {
        console.log('Admin access granted');
        next();
    } else {
        console.log('Admin access denied - Role:', req.user?.role);
        res.status(403).json({ message: 'Accès refusé : droits administrateur requis' });
    }
};

module.exports = adminMiddleware; 