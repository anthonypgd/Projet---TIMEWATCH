const { Validator } = require('jsonschema');

// Fonctions de validation réutilisables
const validatePassword = (password) => {
    const requirements = [
        {
            test: password.length >= 8,
            message: 'Le mot de passe doit contenir au moins 8 caractères'
        },
        {
            test: /[A-Z]/.test(password),
            message: 'Le mot de passe doit contenir au moins une majuscule'
        },
        {
            test: /\d/.test(password),
            message: 'Le mot de passe doit contenir au moins un chiffre'
        },
        {
            test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            message: 'Le mot de passe doit contenir au moins un caractère spécial'
        }
    ];

    const failed = requirements.find(r => !r.test);
    return failed ? { isValid: false, message: failed.message } : { isValid: true };
};

// Schémas de validation
const schemas = {
    user: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
                minLength: 3,
                errorMessage: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
            },
            email: {
                type: 'string',
                format: 'email',
                errorMessage: 'L\'email n\'est pas valide'
            },
            password: {
                type: 'string',
                custom: validatePassword
            }
        },
        required: ['username', 'email', 'password']
    },
    watch: {
        type: 'object',
        properties: {
            marque: { type: 'string', minLength: 1 },
            modele: { type: 'string', minLength: 1 },
            prix: { type: 'number', minimum: 0 },
            condition: { 
                type: 'string',
                enum: ['Neuf', 'Comme neuf', 'Bon état', 'Usage normal', 'À restaurer']
            }
        },
        required: ['marque', 'modele', 'condition']
    }
};

// Fonction de validation générique
const validate = (data, schemaName) => {
    const validator = new Validator();
    const schema = schemas[schemaName];
    
    if (!schema) {
        throw new Error(`Schéma "${schemaName}" non trouvé`);
    }

    const result = validator.validate(data, schema);
    
    if (result.errors.length) {
        throw new Error(result.errors.map(error => 
            error.schema.errorMessage || error.message
        ).join('. '));
    }
    
    return true;
};

module.exports = {
    validate,
    validatePassword
}; 