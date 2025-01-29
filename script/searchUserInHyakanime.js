


async function searchUserInHyakanime() {
    const searchBarUser = document.getElementById('searchBarUser');
    const searchResult = document.getElementById('searchResult');
    searchResult.innerHTML = '';
    const searchString = searchBarUser.value;
    const response = await fetch(`https://api-v2.hyakanime.fr/search/user/${searchString}`);
    const data = await response.json();
    data.map((user) => {
        const li = document.createElement('li')
        li.className = 'card';
        li.innerHTML = `
                    <img src="${user.photoURL}" class="avatar" alt="avatar">
                    <h5 class="username">${user.username.length <= 11? user.username : `${user.username.slice(0, 11)}...`}</h5>
        `
        li.addEventListener('click', () => {
            searchResult.innerHTML = '';
            searchResult.appendChild(li);
            selectUser(user);
        })

        searchResult.appendChild(li);
    })
}
async function selectUser(user) {
    const userAnimeList = document.getElementById('userAnimeList');
    userAnimeList.innerHTML = '';
    const button =  document.getElementById("transferToAniList")
    button.onclick = () => {
        console.log(user.uid);
        ajoutListAnime(user.uid);
    }
    const response = await fetch(`https://api-v2.hyakanime.fr/progression/anime/${user.uid}`);
    let data = await response.json();
    data.reverse();
    data.map((anime) => {
        let status = anime.progression.status;
        let title = anime.media.title !== undefined ? anime.media.title : anime.media.romanji;
        if(title === ""){
            title = "Titre inconnu"
        }
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
        const li = document.createElement('li');
        li.className = 'card anime';
        li.innerHTML = `
                   <img src="${anime.media.image}" alt="Image de l'anime">
                    <div class="info">
                        <h3>${title.length <= 10 ?  title : `${title.slice(0, 10)}...` }</h3>
                        <p>${anime.progression.progression}/${anime.media.NbEpisodes === null ? "0" : anime.media.NbEpisodes} épisodes<br>${status}</p>
                    </div>
                `
        userAnimeList.appendChild(li);
})


}

function ajoutListAnime(uid) {

    fetch('http://localhost:3000/ajout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uid }),
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
}
