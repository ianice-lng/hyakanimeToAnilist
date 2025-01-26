const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const cookieParser = require('cookie-parser');


router.post('/ajout', async (req, res) => {
    const token = req.session.token;
    console.log('Token dans la session:', token);
    const body = req.body;

    if (!token) {
        console.error("t'es nul")
        return res.status(401).send('Non authentifié');
    }
    console.log("azy je suis trop le goat")
    const hyakanimeProgressResponse = await axios.get('https://api-v2.hyakanime.fr/progression/anime/16746569-c5ba-491d-a1c4-a8b8a68cf8c5');
    let nbrAnime = 350;
    const intervalId = setInterval(async () => {
    const hyakanimeProgress = await hyakanimeProgressResponse.data[nbrAnime]
        nbrAnime++;
        if(hyakanimeProgressResponse.data.length === nbrAnime){
            clearInterval(intervalId)
        }
    const hyakanimeResponse = await axios.get(`https://api-v2.hyakanime.fr/anime/${hyakanimeProgress.media.id}`);
    const hyakanimeInfo = await hyakanimeResponse.data[0]
    const idAnilist = await hyakanimeInfo.idAnilist;

    const progress = await hyakanimeProgress.progression.progression;
    let status = hyakanimeProgress.progression.status;


    switch (status){
        case 1:
            status = "CURRENT"
            break;
        case 2:
            status = "PLANNING"
            break;
        case 3:
            status = "COMPLETED"
            break;
        case 4:
            status = "PAUSED"
            break;
        case 5:
            status = "DROPPED"
            break;
    }

        console.log({
            "idAnilist": idAnilist,
            "progress": progress,
            "status": status,
            "title": hyakanimeInfo.title
        })

    //await addAnimeToAnilist(idAnilist, token, progress, status)
    }, 1000);


    res.json({"status": "encours"})
});

module.exports = router;
//CODE POUR AJOUTER A LA LISTE ANILIST

async function addAnimeToAnilist(id, token, progress, status) {
    const mutation = `
  mutation ($listEntryId: Int, $mediaId: Int, $status: MediaListStatus, $progress: Int) {
    SaveMediaListEntry(id: $listEntryId, mediaId: $mediaId, status: $status, progress: $progress) {
      id
      status
      progress
    }
  }
`;
    const variables = {
        mediaId: id,
        status: status,
        progress: progress,
    };


    fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
            query: mutation,
            variables,
        }),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data (data.data.SaveMediaListEntry)
        })
        .catch(error => {
            console.error(error);
        });
}
