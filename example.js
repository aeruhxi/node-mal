const Mal = require('./main.js');
const auth = require('./auth.json');

let mal = new Mal(auth);
mal.verifyCredentials()
  .then(user => console.log(user.username + ' verified'));
