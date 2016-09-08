# node-mal

Simple node.js wrapper for [MyAnimeList REST API](https://myanimelist.net/modules.php?go=api)

## Dependencies
* request
* xml2js

## Authentication
As MyAnimeList API requires authentication, you need to add username and password in `auth.json` to use this wrapper
```json
{
  "username": "",
  "password": ""
}
```

## Usage
Interact with MAL's official API as easily as this
```js
const Mal = require('./main.js');
const auth = require('./auth.json');  // JSON file for authentication

let mal = new Mal(auth);

// Verfify username and password
mal.verifyCredentials()
  .then(user => console.log(user.username + ' verified'))
  .catch(err => console.error(err));

// Anime value
let animeValues = {
  episode: 10,
  status: 1,
  score: 6
};

// Add anime to your list
mal.addEntry('anime', '32370', animeValues)
  .then(() => console.log('Anime added successfully'))
  .catch(() => console.log('Failed: Anime was not added'));
```

More examples [here](https://github.com/AbsoluteZero273/node-mal/blob/master/examples/example.js)<br>
For more properties of anime values, check [MAL API page](https://myanimelist.net/modules.php?go=api#animevalues). 

## Methods

### verifyCredentials
Verify user credentials
```js
mal.verifyCredentials()
```
### searchEntry
Search for anime/manga
```js
// type is 'anime' or 'manga'
// name of anime/manga
mal.searchEntry(type, name)
```

### addEntry
Add anime/manga to your list
```js
mal.addEntry(type, id, data)
```

### updateEntry
Update anime/manga in your list. Takes same parameter as
```js
mal.updateEntry(type, id, data)
```

### deleteEntry
Delete anime/manga from your list
```js
mal.deleteEntry(type, id)
```
