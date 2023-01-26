const http = require(`http`);
const https = require(`https`);
const { performance } = require('perf_hooks');

const fetch = require(`node-fetch`);
const { curly } = require(`node-libcurl`);
const AbortController = require(`abort-controller`);

// const REQUEST_TIMEOUT = 9500;
const REQUEST_TIMEOUT = 4500;

const httpAgent = new http.Agent({
  rejectUnauthorized: false,
});
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// https://stackoverflow.com/a/57888548/5485777
const fetchTimeout = (url, ms, options = {}) => {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal, ...options });
  const timeout = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(timeout));
};

function encodeUriOnce(url, useURIComponent = false) {

  let decoder = useURIComponent ? decodeURIComponent : decodeURI
  while(url !== decoder(url)) {
    url = decoder(url);
  }

  return encodeURI(url);
  
}

function resolveLink(url) {

  let resolvedUrl = encodeUriOnce(url);
  let resolvedHeaders = {};

  if (url.includes(`driveindex.ga/`)) {
    resolvedUrl = resolvedUrl.replace(`driveindex.ga/`, `hashhackers.com/`);
    resolvedHeaders = {
      'referer': `hashhackers.com`,
    }
  }
  
  return {
    originalUrl: url,
    url: resolvedUrl,
    headers: resolvedHeaders,
  };
  
}

function checkLink(urlData) {
  return new Promise((resolve) => {
  
    const startTime = performance.now()
    urlData.url = encodeUriOnce(urlData.url);

    fetchTimeout(urlData.url, REQUEST_TIMEOUT, {
      method: `HEAD`,
      headers: urlData.headers,
      agent: function (_parsedURL) {
        return _parsedURL.protocol === 'https:' ? httpsAgent : httpAgent;
      }
    }).then(async res => {
  
      let contentLength = res.headers.get('Content-Length');
      // use libcurl fallback, supports getting Content-Length for 'chunked' encoding
      if (res.ok && contentLength === null) {
        console.info(`retrying with libcurl...`);
        try {
          console.log(`urlData.url:`, urlData.url)

          contentLength = await new Promise(async (resolve, reject) => {

            // make sure the curl request doesn't exceed the timeout
            setTimeout(() => {
              return reject(`timeout`)
            }, Math.floor(REQUEST_TIMEOUT - (performance.now() - startTime)))
            
            curlRes = await curly.head(urlData.url, {
              SSL_VERIFYPEER: false,
              SSL_VERIFYHOST: false,
            })
            return resolve(curlRes.headers[0][`Content-Length`])

          })

        } catch (err) {
          console.error(`Curl failed:`, err)
        }
      }
      
      return resolve({
        statusCode: res.status,
        isAlive: res.ok,
        sizeInBytes: contentLength === null ? NaN : Number(contentLength),
        url: urlData.originalUrl,
        checkedUrl: urlData.url,
        headers: urlData.headers,
      });
      
    }).catch(err => {
  
      console.warn(`Request failed:`, err);
      console.log(`urlData.url:`, urlData.url)
      
      return resolve({
        statusCode: 504, // gateway timeout
        isAlive: false,
        body: err.message,
        url: urlData.originalUrl,
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