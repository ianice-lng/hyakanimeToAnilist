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
        try {
            const response = await axios.post(
                'https://graphql.anilist.co',
                {
                    query: `
          query {
            Viewer {
              id
              name
              about
              avatar {
                large
              }
                statistics {
                    anime {
                    count
                    }
                    manga {
                    count
                    }
                }
                favourites {
                    anime {
                    nodes {
                        title {
                        romaji
                        english
                        native
                        }
                        coverImage {
                        large
                        }
                    }
                    }
                }
                
            }
          }
        `,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );


            req.session.token = access_token;
            req.session.save((err) => {

                if (err) {
                    console.error('Erreur lors de la sauvegarde de la session:', err);
                    return res.status(500).send('Erreur de session');
                }
                console.log('Après sauvegarde:', req.session);
                res.redirect("http://localhost:8000/dashboard.html"); // Redirection une fois la session sauvegardée
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des données');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'échange du code');
    }
});

module.exports = router;
