let HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "1234", // Match any network id,
            gas: 4700000,
            gasPrice: 60 * 1000000000
        },
        debug: {
            host: "localhost",
            port: 9545,
            network_id: "*" // Match any network id
        },
        ganache: {
            host: "localhost",
            port: 9545,
            network_id: "5777"
        },
        rinkeby: {
            provider: function () {
                return new HDWalletProvider(process.env.RINKEBY_MNEMONIC, "https://rinkeby.infura.io/" + process.env.INFURA_API_KEY, 0);
            },
            gas: 6000000,
            gasPrice: 18000000000,
            network_id: "4"
        },
        mainnet: {
            host: "Needs to be configured",
            network_id: "1"
        }
    }
};
