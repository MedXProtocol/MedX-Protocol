let HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config({silent: true});

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
                return new HDWalletProvider(process.env.RINKEBY_MNEMONIC, process.env.REACT_APP_RINKEBY_PROVIDER_URL, 0);
            },
            gas: 6000000,
            gasPrice: 10000000000,
            network_id: "4"
        },
        ropsten: {
          provider: function () {
              return new HDWalletProvider(process.env.ROPSTEN_MNEMONIC, process.env.REACT_APP_ROPSTEN_PROVIDER_URL, 0);
          },
          gas: 7000000,
          gasPrice: 10000000000,
          network_id: "3"
        },
        mainnet: {
            host: "Needs to be configured",
            network_id: "1"
        }
    }
};
