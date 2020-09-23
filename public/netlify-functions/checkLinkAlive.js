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
  resolvedUrl.replace(`driveindex.ga/`, `hashhackers.com`);
  
  return resolvedUrl;
  
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

  if (!parsedBody.url || parsedBody.url.length === 0) {
    return callback(null, {
      statusCode: 400,
      body: `You need to provide a valid url! Recieved ${parsedBody}, ${parsedBody.url}`,
    })
  }

  let urlToCheck = resolveLink(parsedBody.url);
  
  fetchTimeout(urlToCheck, 9500, {
    method: `HEAD`,
  }).then(res => {

    return callback(null, {
      statusCode: res.status,
      body: JSON.stringify({
        isAlive: res.ok,
        sizeInBytes: res.headers.get(`Content-Length`),
        checkedUrl: urlToCheck,
      })
    })
    
  }).catch(err => {

    return callback(err, {
      statusCode: 504, // gateway timeout
      body: err.message,
    })
    
  })
  
}