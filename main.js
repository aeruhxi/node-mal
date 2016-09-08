'use strict';

const req = require('request');
const xml2js = require('xml2js');
const querystring = require('querystring');

// Utility function to replace spaces with underscore
function addUnderscore(str) {
  return str.replace(/ /, '_');
}

/**
 * Starting point
 */
class Mal{

  /**
   * @param {object} auth authorization containing username and password
   * @constructor
   * @private authorization
   * @private request
   * @private xmlBuilder
   * @private parseString
   */
  constructor(auth) {
    // Check if auth is passed
    if (!auth) throw 'Authorization not passed';

    // Encode authorization credentials to base64
    this.authorization
      = 'Basic ' + new Buffer(`${auth.username}:${auth.password}`)
          .toString('base64');

    // Define defaults for request
    this.request = req.defaults({
      headers: {
        'Authorization': this.authorization
      },
      baseUrl: 'https://myanimelist.net/api/'
    });

    // XML Builder
    this.xmlBuilder = new xml2js.Builder({
      rootName: 'entry',
      renderOpts: {'pretty': false}
    });

    // XML Parser
    this.parseString = (new xml2js.Parser({explicitArray: false})).parseString;


  }

  /**
   * Make a request
   *
   * @private
   * @param {String} meth method {POST|GET|DELETE}
   * @param {String} endpoint request url
   * @param {String} xmlData XML data in string
   * @return {Promise<String, Error>}
   */
  makeRequest(meth, endpoint, xmlData) {
    // Define option for request
    let requestOption = {
      url: endpoint,
      method: meth,
      headers: {
        'User-Agent': 'node-mal'
      }
    };

    // Add headers
    requestOption.headers['content-type']
      = (meth === 'get') ?
        'application/xml; charset=UTF-8' : 'application/x-www-form-urlencoded';

    // Add body for POST method
    if (meth === 'post')
      requestOption.body = querystring.stringify({data: xmlData});

    return new Promise((resolve, reject) => {
      this.request(requestOption, (err, response, body) => {
        if (err) reject(err);

        resolve(body);
      });
    });
  }

  /**
   * Verify account credentials
   *
   * @return {Promise<Object, Error>} user object
   */
  verifyCredentials() {
    return new Promise((resolve, reject) => {
      this.makeRequest('get', '/account/verify_credentials.xml')
        .then(content => this.parseString(content, (err, parsedData) => {
          if (err) return err;

          resolve(parsedData.user);
        }))
        .catch(reject);
    });
  }

  /**
   * Search manga or anime
   *
   * @param {String} type Entry type {anime|manga}
   * @param {String} name Search string
   * @return {Promise<Object, Error>} Array of search results
   */
  searchEntry(type, name) {
    if (!(type === 'anime'|| type === 'manga')) throw 'Invalid type';

    let endPoint = `/${type}/search.xml?q=${addUnderscore(name)}`;

    return new Promise((resolve, reject) => {
      this.makeRequest('get', endPoint)
        .then(content => this.parseString(content, (err, parsedData) => {
          if (err) return err;

          let entry = (type === 'anime')
            ? parsedData.anime.entry : parsedData.manga.entry;

          resolve(entry);
        }))
        .catch(reject);
    });
  }

  /**
   * Add manga or anime
   *
   * @param {String} type Entry type {anime|manga}
   * @param {String} id unique ID of anime/manga series
   * @param {Object} data Object containing anime/manga values
   * @return {Promise<String, Error>} String thrown is not of any use
   */
  addEntry(type, id, data) {
    if (!(type === 'anime'|| type === 'manga')) throw 'Invalid type';

    let endPoint = `/${type}list/add/${id}.xml`;

    let xmlData = this.xmlBuilder.buildObject(data);

    return this.makeRequest('post', endPoint, xmlData);
  }

  /**
   * Update manga or anime
   *
   * @param {String} type Entry type {anime|manga}
   * @param {String} id unique ID of anime/manga series
   * @param {Object} data Object containing anime/manga values
   * @return {Promise<String, Error>} String thrown is not of any further use
   */
  updateEntry(type, id, data) {
    if (!(type === 'anime'|| type === 'manga')) throw 'Invalid type';

    let endPoint = `/${type}list/update/${id}.xml`;

    let xmlData = this.xmlBuilder.buildObject(data);

    return this.makeRequest('post', endPoint, xmlData);
  }

  /**
   * Search manga or anime
   *
   * @param {String} type Entry type {anime|manga}
   * @param {String} id unique ID of anime/manga series
   * @return {Promise<String, Error>} String thrown is not of any further use
   */
  deleteEntry(type, id) {
    if (!(type === 'anime'|| type === 'manga')) throw 'Invalid type';

    let endPoint = `/${type}list/delete/${id}.xml`;

    return this.makeRequest('delete', endPoint);
  }

}

module.exports = Mal;
