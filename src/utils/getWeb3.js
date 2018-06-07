import Web3 from 'web3';

let getWeb3 = new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
        let results;
        let web3 = window.web3;

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider.
            web3 = new Web3(web3.currentProvider);
            let _networkName;
            web3.eth.net.getId().then((_networkId) => {
                web3.eth.getAccounts().then((_accounts) => {
                    switch (_networkId) {
                        case 1:
                            _networkName = "the MainNet";
                            break;
                        case 3:
                            _networkName = "the Ropsten";
                            break;
                        case 4:
                            _networkName = "the Rinkeby";
                            break;
                        case 42:
                            _networkName = "the Kovan";
                            break;
                        default:
                            _networkName = "an Unknown";
                    }

                    //console.log("NetworkId [" + _networkId + "] NetworkName [" + _networkName + "] accounts[" + _accounts.length + "]")

                    results = {
                        web3: web3,
                        networkId: _networkId,
                        networkName: _networkName,
                        accounts: _accounts.length
                    };
                    resolve(results);
                });
            });
        } else {
            // Fallback to localhost if no web3 injection. We've configured this to
            // use the development console's port by default.
            const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');

            web3 = new Web3(provider);

            web3.eth.getAccounts().then((_accounts) => {
                results = {
                    web3: web3,
                    network: web3.version.network,
                    accounts: _accounts.length
                };
                console.log('No web3 instance injected, using Local web3.');

                resolve(results);
            });
        }
    })
});

export default getWeb3
