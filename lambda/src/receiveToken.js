const civicSip = require('civic-sip-api');
const credentials = {
  appId: process.env.LAMBDA_CONFIG_CIVIC_APP_ID,
  prvKey: process.env.LAMBDA_CONFIG_CIVIC_PRIVATE_KEY,
  appSecret: process.env.LAMBDA_CONFIG_CIVIC_SECRET,
}
const civicClient = civicSip.newClient(credentials);

exports.handler = (event, context, callback) => {
  if (/options/i.test(event.httpMethod)) {
    callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : process.env.LAMBDA_CONFIG_CORS_ORIGIN,
        "Access-Control-Allow-Methods" : "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      },
      body: ''
    })
  } else if (/post/i.test(event.httpMethod)) {
    const body = JSON.parse(event.body)
  	const jwtToken = body.jwtToken

  	civicClient.exchangeCode(jwtToken)
  		.then((userData) => {

        const successResponse = {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": process.env.LAMBDA_CONFIG_CORS_ORIGIN
          },
          body: JSON.stringify(userData, null, 4),
          isBase64Encoded: false
      	};

        callback(null, successResponse);
      })
      .catch((error) => {
        console.log(error);
        callback(error);
      });
  } else {
    callback('Unknown method')
  }
};
