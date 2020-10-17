export default class API {

  constructor(baseUrl, discoveryUrl) {

    this.baseUrl = baseUrl;
    this.apiEndpoint = `${this.baseUrl}/meili/indexes/links`;
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

  parseResult(rawResults) {

    let parsedResults = {
      query: rawResults.query,
      hits: this.parseHits(rawResults.hits),
      totalHits: rawResults.nbHits,
    }

    return parsedResults;
    
  }

  parseHits(rawHits) {
    return rawHits.map(hit => {
      return {
        id: hit.id,
        url: hit.url,
        highlights: [...new Set(hit._formatted.url.match(/(?<=<em>)(.*?)(?=<\/em>)/g))],
        size: hit.size || -1,
      }
    })
  }

  parseStats(rawStats) {

    let parsedStats = {
      totalIndexed: this.dotify(rawStats.numberOfDocuments),
      isIndexing: rawStats.isIndexing,
      types: rawStats.fieldsDistribution,
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

  search(query, offset = 0, limit = 20) {
    return new Promise((resolve, reject) => {

        fetch(this.apiEndpoint + `/search?q=${encodeURIComponent(query)}&offset=${encodeURIComponent(offset)}&limit=${encodeURIComponent(limit)}&attributesToHighlight=url`, {
          mode: 'cors',
          method: 'GET',
          headers: {
            'X-Meili-API-Key': this.apiKey,
          }
        })
        .then(response => {
          return response.json();
        })
        .then(result => {
          return resolve(this.parseResult(result));
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
      res = await fetch(this.baseUrl + `/stats.json`, {
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

}