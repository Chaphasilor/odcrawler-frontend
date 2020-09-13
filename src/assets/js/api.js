export default class API {

  constructor(baseUrl) {

    this.baseUrl = baseUrl;
    this.apiEndpoint = `${this.baseUrl}/meili/indexes/links`;
    
  }

  parseResult(rawResults) {

    let parsedResults = {
      query: rawResults.query,
      hits: rawResults.hits,
    }

    return parsedResults;
    
  }

  parseStats(rawStats) {

    let parsedStats = {
      totalIndexed: rawStats.numberOfDocuments,
      isIndexing: rawStats.isIndexing,
      types: rawStats.fieldsDistribution,
    }

    return parsedStats;
    
  }

  search(query) {
    return new Promise((resolve, reject) => {

        fetch(this.apiEndpoint + `/search?q=${query}`, {
          mode: 'cors',
          method: 'GET',
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
      res = fetch(this.baseUrl + `/stats.json`, {
        mode: 'cors',
        method: 'GET',
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

}