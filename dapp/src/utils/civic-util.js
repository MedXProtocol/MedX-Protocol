const civicSip = require('civic-sip-api');

const civicClient = civicSip.newClient({
    appId: 'HJZgzIcTM',
    appSecret: APP_SECRET,
    prvKey: PRV_KEY,
});

civicClient.exchangeCode(jwtToken)
    .then((userData) => {
        // store user data and userId as appropriate
        console.log('userData = ', JSON.stringify(userData, null, 4));
    }).catch((error) => {
    console.log(error);
});