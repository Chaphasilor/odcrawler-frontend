const fetch = require(`node-fetch`);
const AbortController = require(`abort-controller`);

// https://stackoverflow.com/a/57888548/5485777
const fetchTimeout = (url, ms, options = {}) => {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal, ...options });
  const timeout = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(timeout));
};

function resolveLink(url) {

  let resolvedUrl = url;
  let resolvedHeaders = {};

  if (url.includes(`driveindex.ga/`)) {
    resolvedUrl = resolvedUrl.replace(`driveindex.ga/`, `hashhackers.com/`);
    resolvedHeaders = {
      'referer': `hashhackers.com`,
    }
  }
  
  return {
    url: resolvedUrl,
    headers: resolvedHeaders,
  };
  
}

function checkLink(urlData) {
  return new Promise((resolve) => {
  
    fetchTimeout(urlData.url, 9500, {
      method: `HEAD`,
      headers: urlData.headers,
    }).then(res => {
  
      return resolve({
        statusCode: res.status,
        isAlive: res.ok,
        sizeInBytes: Number(res.headers.get(`Content-Length`)),
        checkedUrl: urlData.url,
        headers: urlData.headers,
      });
      
    }).catch(err => {
  
      return resolve({
        statusCode: 504, // gateway timeout
        body: err.message,
      });
      
    })
  
  })
  
}

exports.handler = function(event, context, callback) {

  if (event.httpMethod !== `POST`) {
    return callback(null, {
      statusCode: 405,
      body: `Method not allowed!`,
    })
  }
  
  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (err) {
    return callback(err, {
      statusCode: 500,
      body: err.message,
    })
  }

  if (!parsedBody.urls || parsedBody.urls.length === 0) {
    return callback(null, {
      statusCode: 400,
      body: `You need to provide at least one valid url! Received ${parsedBody}, ${parsedBody.url}`,
    })
  }

  let responseBody = {
    results: new Array(parsedBody.urls.length),
  }

  let requests = [];
  for (let i = 0; i < parsedBody.urls.length; i++) {

    const urlToCheck = parsedBody.urls[i];
    
    let resolvedUrlData = resolveLink(urlToCheck);
    requests.push(checkLink(resolvedUrlData).then(result => {
      responseBody.results[i] = result;
    }))
    
  }

  Promise.all(requests).then(() => {

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(responseBody),
    });
    
  })
  
}