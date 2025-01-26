const express = require('express');
const session = require('express-session')
const callbackRouter = require('./routes/callback');
const ajoutAnimeRouter = require('./routes/ajoutAnime');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
    origin: 'http://localhost:8000', // Autorise uniquement cette origine
    credentials: true, // Permet d'envoyer les cookies avec les requêtes
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Passez à true si vous utilisez HTTPS
        httpOnly: true, // Empêche l'accès aux cookies via JavaScript
        sameSite: 'Lax', // Permet le partage des cookies entre origines
        maxAge: 24 * 60 * 60 * 1000 * 3, // Exemple : expiration du cookie après 3 jours
    },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisation des routes
app.use(callbackRouter);
app.use(ajoutAnimeRouter)

// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
