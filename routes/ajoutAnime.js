const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const cookieParser = require('cookie-parser');


router.get('/test', async (req, res) => {
    const token = req.cookies.access_token;
    console.log(req.cookies)
    console.log("JE SUIS DANS LE TEST")
    if (!token) {
        console.error("t'es nul")
        return res.status(401).send('Non authentifié');
    }
    return console.log(token)
    const hyakanimeProgressResponse = await axios.get('https://api-v2.hyakanime.fr/progression/anime/16746569-c5ba-491d-a1c4-a8b8a68cf8c5');
    let nbrAnime = 0;
    setInterval(async () => {
    const hyakanimeProgress = await hyakanimeProgressResponse.data[nbrAnime]
        nbrAnime++;
    const hyakanimeResponse = await axios.get(`https://api-v2.hyakanime.fr/anime/${hyakanimeProgress.media.id}`);
    const hyakanimeInfo = await hyakanimeResponse.data[0]
    const idAnilist = await hyakanimeInfo.idAnilist;

    const progress = await hyakanimeProgress.progression.progression;
    let status = hyakanimeProgress.progression.status;
    console.log({
        "idAnilist": idAnilist,
        "progress": progress,
        "status": status,
        "title": hyakanimeInfo.title
    })

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