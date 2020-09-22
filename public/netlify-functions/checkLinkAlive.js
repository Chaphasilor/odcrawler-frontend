const fetch = require(`node-fetch`);

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
  
  fetch(parsedBody.url, {
    method: `HEAD`,
  }).then(res => {

    return callback(null, {
      statusCode: res.status,
      body: `from .then: ${res.ok}`,
    })
    
  }).catch(err => {

    return callback(err, {
      statusCode: 500,
      body: `from .catch: ${err.message}`,
    })
    
  })
  
}