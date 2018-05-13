const civicSip = require('civic-sip-api');
const _appId = process.env.appId;
const _privateKey = process.env.pvtKey;
const _secret = process.env.secret;

exports.handler = (event, context, callback) => {
	const body = JSON.parse(event.body);
	
	console.log("Received Token [" + body.jwtToken + "]");
	const civicClient = civicSip.newClient({
	  appId: _appId,
	  prvKey: _privateKey,
	  appSecret: _secret,
	});

	civicClient.exchangeCode(body.jwtToken)
		.then((userData) => {	        
	        console.log('userData = ', JSON.stringify(userData, null, 4));
            const successResponse = {
		        "statusCode": 200,
		        "headers": {"Content-Type": "*/*","Access-Control-Allow-Origin": "*"},
		        "body": JSON.stringify(userData, null, 4),
		        "isBase64Encoded": false
		    };

	        callback(null, successResponse);
	    })
	    .catch((error) => {
	        console.log(error);
	        callback(error);
	    });	
};