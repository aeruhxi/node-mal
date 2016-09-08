const Mal = require('./main.js');
const auth = require('./auth.json');

let mal = new Mal(auth);

// Verify account credentials
mal.verifyCredentials()
  .then(user => console.log(user.username + ' verified'))
  .catch(err => console.error(err));

// Search for anime or manga
mal.searchEntry('manga', 'Naruto')
  .then(animes => {
    for (let anime of animes) {
      console.log(anime.title);
    }
  })
  .catch(err => console.error(err));

// Defining anime values
let animeValues = {
  episode: 10,
  status: 1,
  score: 6
};

// Add anime or manga to your list with anime values
mal.addEntry('anime', '32370', animeValues)
  .then(() => console.log('Anime added successfully'))
  .catch(err => console.error(err));

// Update anime or manga in your lise with anime values
mal.updateEntry('anime', '32370', animeValues)
  .then(() => console.log('Anime updated successfully'))
  .catch(err => console.error(err));

// Delete anime or manga entry in your list
mal.deleteEntry('manga', '78523')
  .then(() => console.log('Manga deleted successfully'))
  .catch(err => console.error(err));
