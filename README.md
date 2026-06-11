# MusicBridge
This project's original goal was to build a web app, where anyone can create, modify and publish playlists that are compatible with both Apple Music and Spotify.

However apple requires a yearly payment for API requests, and so it was decided with great regret that it will only be a web app, where users can sign up, create and customize their profile and add playlists.

The context of this project is the `Full Stack Web Developpment` course given at the HES-SO_Valais_Wallis by Mr. Guillaume Zufferey.

# Setup

## Start backend server
`node backend/server.js`

## Start backend server
`cd frontend`\
To launch locally\
`npm run dev`
To launch on an open port\
`npm run dev-remote`

## Setup mongodb validations
`node db/setupValidation.js`    

## Run tests
`npm test`

# Navigation tutorial
The welcome page contains three buttons, the logo which brings you to the homepage where all users who have created an account appear.
You can click on this even if you are not logged in so you visit as a guest.

The sign up section requires a unique nickname and email. The email must be the right format. The password must be at least 3
characters long.\
Once signed up, you are redirected to your homepage, where only you can modify it and you can logout here too.

The login requires either your email or nickname and your password and brings you to your homepage too.

Editing your page means bio, favorite genres, profile picture and you can add create new playlists.

When clicking on playlists, this brings you to the playlist's homepage. If you are the owner, you can edit it, meaning it's
name, profile picture and you can add songs by searching for it first.

If you click on the image of a song, it will bring you to the spotify page and start playing the song in a new window.

When on your homepage, you can access the main homepage with all the users by clicking on the logo once again.\
Here you can visit other peoples profiles and view their playlists. If they created a playlist that is private, only they can see it.

That is all for the tour. I hope you like my app :)

## Project requirements:
### Thème libre, contraintes fonctionnelles et technologiques  
#### Login/Logout
- User accounts that have their playlists (public/private).

- They can create, delete, modify them.
- They can view other user playlists based on the viewability.
- Can create links for theiry playlists as read only (unique url for each user and playlist).

#### Stockage de données (base de données) 
- Accounts -> _id, nickname, email, bio, fav_genre, pfp, playlists_list 

- Playlists -> PL_id, name, pfp, songs_fk, viewability(pub/unl/pri) 

<!-- ![](notes/1/db_diagram.png) -->

#### Architecture client/serveur, transport des données avec GraphQL 
- Viewing, modifying and adding playlists. 

#### Accès à des données externes via une API (en principe REST) 
- Spotify API
- Create playlists with songs available on Spotify
- Through API gather -> pfp, name, album, artist, duration 

### Frameworks et outils 

##### Front-End: Vite.js, React, HTML, CSS 
Profiles, playlist modification and all users main menu.

##### Back-End: Express.js, Node.js, GraphQL 
Handles the interface updates, the entire DB and API calls. 

# Notes
#### Exam test test.js
in backend/ => run `node test.js` => new terminal => `curl -X GET http://localhost:3000/test` => check node terminal for 3 logs.
#### Auth tutorial
Got a great tutorial from this website: `https://supertokens.com/blog/building-a-login-screen-with-react-and-bootstrap`
