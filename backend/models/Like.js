const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    watch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watch',
        required: true
    }
}, {
    timestamps: true
});

// Index unique pour empêcher les doublons
likeSchema.index({ user: 1, watch: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema); 