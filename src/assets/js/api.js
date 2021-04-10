export default class API {

  constructor(baseUrl, discoveryUrl) {

    this.baseUrl = baseUrl;
    this.apiEndpoint = `${this.baseUrl}/links`;
    this.discoveryEndpoint = discoveryUrl;
    this.apiKey = process.env.VUE_APP_API_KEY;

  }

  formatBytes(bytes, decimals = 2) {

    if (bytes === 0) return `0 B`;
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [`B`, `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ` ` + sizes[i];

  }
  
  dotify(number) {

    let reversedNumberAsString = String(number).split(``).reverse().join(``);
    let dotifiedNumber = ``;
    for (let i = 0; i < reversedNumberAsString.length; i++) {
      dotifiedNumber = `${reversedNumberAsString.charAt(i)}${(i%3===0 && i!=0) ? `.` : ``}${dotifiedNumber}`;
    }
    return dotifiedNumber;
    
  }

  parseResult(rawResults, query, searchOptions) {

    let parsedResults = {
      hits: this.parseHits(rawResults.hits.hits, searchOptions),
      totalHits: rawResults.hits.total.value,
      query,
    }

    return parsedResults;
    
  }

  parseHits(rawHits, searchOptions) {
    return rawHits.map(hit => {
      return {
        id: hit._id,
        score: hit._score,
        url: hit._source.url,
        filename: hit._source.filename,
        // highlights: [...new Set(hit.highlight.url[0].match(/(?<=<em>).*?(?=<\/em>)/g))],
        highlights: {
          apply: searchOptions.filenameOnly ? `filename` : `url`,
          strings: hit.highlight ?
            [...new Set(hit.highlight[searchOptions.filenameOnly ? `filename` : `url`][0].match(/<em>(.*?)<\/em>/g))].map(highlight => highlight.slice(4,-5)) : 
            [],
        },
        size: hit._source.size || -1,
        meta: {
          statusCode: undefined,
          isAlive: undefined,
          sizeInBytes: undefined,
          url: undefined,
          checkedUrl: undefined,
          headers: undefined,
        }
      }
    })
  }

  parseStats(rawStats) {

    let parsedStats = {
      totalIndexed: this.dotify(rawStats.indices.links.primaries.docs.count),
      isIndexing: true, //TODO find out how to check if ES is indexing, or remove
    }

    return parsedStats;
    
  }

  parseDumpInfo(rawDumpInfo) {

    let parsedDumpInfo = {
      url: rawDumpInfo.url,
      numberOfLinks: this.dotify(rawDumpInfo.links),
      size: this.formatBytes(rawDumpInfo.size, 0),
      created: new Date(rawDumpInfo.created),
    }

    return parsedDumpInfo;
    
  }

  /**
   * 
   * @param {String} query The search query
   * @param {Number} offset The amount of results to skip
   * @param {Number} limit The page size
   * @param {Object} [options] Advanced search options
   * @param {Boolean} [options.filenameOnly] Only search filename?
   * @param {Boolean} [options.matchPhrase] Use (exact) phrase matching instead of regular matching?
   * @param {Object} [options.extensions] Manage file extensions of search results
   * @param {String} [options.extensions.mode="off"] What to do with these extensions (include or exclude)
   * @param {Array<String>} [options.extensions.list] Array of extensions that will be included/excluded
   */
  // eslint-disable-next-line no-unused-vars
  search(query, offset = 0, limit = 20, options = {}) {
    return new Promise((resolve, reject) => {

      options.filenameOnly = options.filenameOnly || false;
      options.matchPhrase = options.matchPhrase || false;
      options.extensions = options.extensions || {};
      options.extensions.mode = options.extensions.mode || `off`;
      options.extensions.list = options.extensions.list || [];
      // remove leading dots
      options.extensions.list = options.extensions.list.map(x => {
        if (x[0] === `.`) {
          return x.slice(1)
        } else {
          return x
        }
      })
      console.log(`options.extensions.list:`, options.extensions.list)
      // hopefully temporary workaround until `extension` field is changed to be case-insensitive in Elasticsearch
      options.extensions.list = [...options.extensions.list, ...options.extensions.list.map(x => x.toLowerCase()), ...options.extensions.list.map(x => x.toUpperCase())]
      

      let requestBody = {
        size: limit,
        from: offset,
        highlight: {
          fields: {
            url: {},
            filename: {},
          }
        }
      }

      let searchField;
      if (options.filenameOnly) {
        searchField = {
          filename: query, // search filename field
        }
      } else {
        searchField = {
          url: query, // search url field
        }
      }

      requestBody.query = {
        bool: {
          must: [
            options.matchPhrase ? { match_phrase: searchField } : { match: searchField },
          ],
          should: [
            options.matchPhrase ? { match_phrase: { filename: query } } : { match: { filename: query } }  // make results that include the query in the filename have a higher score when searching the url field
          ],
          must_not: [],
        }
      }

      let filterTerm = {
        terms: {
          extension: options.extensions.list
        },
      }
      
      if (options.extensions.mode === `include`) {
        requestBody.query.bool.must.push(filterTerm)
      } else if (options.extensions.mode === `exclude`) {
        requestBody.query.bool.must_not.push(filterTerm)
      }

      console.log(`requestBody:`, requestBody);
      
      fetch(`${this.apiEndpoint}/_search`, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      .then(response => {
        return response.json();
      })
      .then(result => {
        return resolve(this.parseResult(result, query, options));
      })
      .catch(err => {
        console.warn(`Failed to fetch results:`, err);
        return reject(`Couldn't fetch results!`);
      })
    
    })
  }

  async retrieveStats() {

    let res, stats;

    try {
      res = await fetch(`${this.apiEndpoint}/_stats/docs,store,indexing,search`, {
        mode: 'cors',
        method: 'GET',
        headers: {
          // 'X-Meili-API-Key': this.apiKey,
        }
      })
    } catch (err) {
      console.warn(err);
      throw new Error(`Couldn't retrieve stats`);
    }

    try {
      stats = await res.json()
    } catch (err) {
      console.warn(err);
      throw new Error(`Error while parsing the stats, the server didn't respond with a valid json string!`);
    }

    return this.parseStats(stats);
    
  }

  async retrieveDumpInfo() {

    let res, dumpInfo;

    try {
      res = await fetch(this.discoveryEndpoint + `/dump.json`, {
        mode: 'cors',
        method: 'GET',
        headers: {
          // 'X-Meili-API-Key': this.apiKey,
        }
      })
    } catch (err) {
      console.warn(err);
      throw new Error(`Couldn't retrieve dump info`);
    }

    try {
      dumpInfo = await res.json()
    } catch (err) {
      console.warn(err);
      throw new Error(`Error while parsing the dump info, the server didn't respond with a valid json string!`);
    }

    return this.parseDumpInfo(dumpInfo);
    
  }

  async checkLinks(urls) {

    let res;

    try {
      res = await fetch(`/.netlify/functions/checkLinkAlive`, {
        method: `POST`,
        body: JSON.stringify({
          urls,
        })
      })
    } catch (err) {

      throw new Error(`Couldn't check if links are alive: ${err.message}`)

    }

    if ([502, 504].includes(res.status)) {
      return false;
    }

    let body = {};
    try {
      body = await res.json();
    } catch (err) {
      throw new Error(`Couldn't parse JSON from response body!`)
    }

    if (!body.results) {
      throw new Error(`Received invalid response format while trying to check links`)
    }

    // body.results = []
    // urls.forEach(url => {
    //   body.results.push({
    //     statusCode: 500,
    //     isAlive: false,
    //     sizeInBytes: 153749821,
    //     url: url,
    //     checkedUrl: 'https://two.hashhackers.com/0:/Star.Wars.Resistance.S01.720p.x265-MeGusta/Star.Wars.Resistance.S01E08.720p.HEVC.x265-MeGusta.mkv',
    //     headers: { referer: 'hashhackers.com' }
    //   })
    // })

    return body.results;
    
  }
  
}