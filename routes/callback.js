const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('Code manquant');
    }

    try {
        const response = await axios.post('https://anilist.co/api/v2/oauth/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:3000/callback',
            code: code
        });

        const { access_token } = response.data;
        // Stocke le token dans la session ou base de données
        req.session.token = access_token;
        res.redirect('/api/user'); // Redirection vers une page sécurisée
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'échange du code');
    }
});

module.exports = router;
