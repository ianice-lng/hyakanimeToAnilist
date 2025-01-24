const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
router.get('/api/user', async (req, res) => {
    const token = req.session.token;

    if (!token) {
        return res.status(401).send('Non authentifié');
    }

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
                    Authorization: `Bearer ${token}`,
                },
            }
        );


        res.cookie('access_token', token, {
            httpOnly: true, // Le cookie ne sera pas accessible via JavaScript (plus sécurisé)
            secure: false, // Utilise true si tu es en HTTPS
            maxAge: 24 * 60 * 60 * 1000, // Durée de vie (1 jour ici)
        });
        res.redirect("http://0.0.0.0:8000/dashboard.html");
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

module.exports = router;
