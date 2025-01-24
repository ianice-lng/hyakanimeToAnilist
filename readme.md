# Voici le code du site pour transferer sa liste hyakanime à anilist
Il est possible de le tester en local avec un serveur nodejs 
Pour cela il faut installer nodejs et npm
```bash
npm install
```
Il faut creer un fichier .env à la racine du projet avec les variables suivantes
```
SESSION_SECRET=ma-super-cle-secrete
CLIENT_ID=mon-client-id-anilist
CLIENT_SECRET=mon-client-secret-anilist
```
Ensuite plus qu'a lancer le main.js
```bash
node main.js
```
Et lancer le fichier index.html dans un navigateur
