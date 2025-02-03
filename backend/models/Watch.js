const mongoose = require('mongoose');
const { Schema } = mongoose;

const WatchSchema = new Schema({
  marque: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  modele: {
    type: String,
    required: true
  },
  annee: {
    type: Number,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['Neuf', 'Comme neuf', 'Bon état', 'Usage normal', 'À restaurer'],
    required: true
  },
  mouvement: {
    type: String,
    enum: ['Automatique', 'Quartz', 'Mécanique à remontage manuel', 'Autre'],
    required: true
  },
  description: String,
  features: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ajouter un index sur createdAt pour optimiser le tri
WatchSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Watch', WatchSchema);