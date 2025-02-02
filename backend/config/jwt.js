module.exports = {
    secret: process.env.JWT_SECRET,
    options: {
        expiresIn: '12h',
        algorithm: 'HS256',
        issuer: 'timewatch-api',  // Identifie l'application
        audience: 'timewatch-client'  // Identifie les clients autorisés
    }
}; 