const mongoose = require('mongoose');
const { Schema } = mongoose;

const WatchSchema = new mongoose.Schema({
  marque: {
    type: String,
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
    required: false
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
  description: {
    type: String,
    required: false
  },
  features: {
    type: [String],
    required: false,
    default: []
  },
  images: {
    type: [String],
    required: false,
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

module.exports = mongoose.model('Watch', WatchSchema);