const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const callbackRouter = require('./routes/callback');
const userRouter = require('./routes/user');
const ajoutAnimeRouter = require('./routes/ajoutAnime');
require('dotenv').config();

const app = express();
app.use(cookieParser());
// Configuration des sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Utilise `secure: true` en production avec HTTPS
    })
);
app.use(cors({
    origin: 'http://votre-frontend-url.com', // Remplacez par l'URL de votre frontend
    credentials: true, // Autorise l'envoi des cookies
}));
// Utilisation des routes
app.use(callbackRouter);
app.use(userRouter);
app.use(ajoutAnimeRouter)

// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
