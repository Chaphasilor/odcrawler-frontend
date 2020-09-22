const fetch = require(`node-fetch`);

exports.handler = function(event, context, callback) {

  event.body = JSON.parse(event.body);
  
  fetch(event.body.url, {
    method: `HEAD`,
  }).then(res => {

    return callback(null, {
      statusCode: res.status,
      body: res.ok,
    })
    
  }).catch(err => {

    return callback(err, {
      statusCode: 500,
      body: err.message,
    })
    
  })
  
}