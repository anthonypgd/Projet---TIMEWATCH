// src/app.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authMiddleware = require("./middleware/authMiddleware");
const apiRouter = require("./routes");
const likeRoutes = require('./routes/like');
const watchRoutes = require('./routes/watch');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');
const adminRoutes = require('./routes/admin');
const brandRoutes = require('./routes/brand');

const app = express();

// Augmenter la limite de taille pour les requêtes
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const mongoURI = process.env.DATABASE_URL || "mongodb://localhost:27017/timewatch";

// Connexion à la base de données
mongoose
  .connect(mongoURI)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log(`Database connection error: ${error.message}`));

// Routes - définir chaque route individuellement
app.use('/api/auth', authRoutes);
app.use('/api/watches', watchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);  // Ajout explicite de la route des likes
app.use('/api/admin', adminRoutes);
app.use('/api/brands', brandRoutes);

// Autres routes via apiRouter si nécessaire
app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
