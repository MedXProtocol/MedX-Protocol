import RegistryContract from '../../build/contracts/Registry.json';
import PLCRVotingContract from '../../build/contracts/PLCRVoting.json';
import TokenContract from '../../build/contracts/MedXToken.json';
import ListingVerifierContract from '../../build/contracts/ListingVerifier.json';
import contract from 'truffle-contract';
import getWeb3 from './getWeb3';
import { downloadJson } from './storage-util';

let ethConfig = {

    web3: null,
    registryInstance: null,
    PLCRVotingInstance: null,
    selectedAccount: null,
    MEDXTokenInstance: null,
    verifierInstance: null,

    getWeb3Instance: async function () {
        if (!this.web3) {
            this.web3 = await getWeb3Object();
            return this.web3;
        }
        else
            return this.web3;
    },

    getRegistryInstance: async function () {
        if (!this.registryInstance) {
            const registry = contract(RegistryContract);
            registry.setProvider((await this.getWeb3Instance()).currentProvider);
            this.registryInstance = await registry.deployed();
            return this.registryInstance;
        }
        else
            return this.registryInstance;
    },

    getPLCRVotingInstance: async function () {
        if (!this.PLCRVotingInstance) {
            const PLCRVoting = contract(PLCRVotingContract);
            PLCRVoting.setProvider((await this.getWeb3Instance()).currentProvider);
            this.PLCRVotingInstance = await PLCRVoting.deployed();
            return this.PLCRVotingInstance;
        }
        else
            return this.PLCRVotingInstance;
    },

    getMEDXTokenInstance: async function () {
        if (!this.MEDXTokenInstance) {
            const MEDXToken = contract(TokenContract);
            MEDXToken.setProvider((await this.getWeb3Instance()).currentProvider);
            this.MEDXTokenInstance = await MEDXToken.deployed();
            return this.MEDXTokenInstance;
        }
        else
            return this.MEDXTokenInstance;
    },

    getVerifierInstance: async function () {
        if (!this.verifierInstance) {
            const verifier = contract(ListingVerifierContract);
            verifier.setProvider((await this.getWeb3Instance()).currentProvider);
            this.verifierInstance = await verifier.deployed();
            return this.verifierInstance;
        }
        else
            return this.verifierInstance;
    },

    getAccountInstance: async function () {
        if (!this.web3)
            await this.getWeb3Instance();
        const _accounts = await this.web3.eth.getAccounts();
        this.selectedAccount = _accounts[0];
        return this.selectedAccount;
    },

    //this function hydrates all of the instance/address/account data that is needed to make web3 calls
    ready: async function () {
        await this.getWeb3Instance();
        await this.getRegistryInstance();
        await this.getPLCRVotingInstance();
        await this.getMEDXTokenInstance();
        await this.getVerifierInstance();
        await this.getAccountInstance();
        return;
    }
};


export async function apply(documentHash, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.registryInstance.apply(ethConfig.web3.utils.sha3(documentHash), fromTokenDecimal(20), documentHash, { from: ethConfig.selectedAccount });
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function revealVote(pollID, voteOption, salt, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.PLCRVotingInstance.revealVote(parseInt(pollID), parseInt(voteOption), parseInt(salt), {from: ethConfig.selectedAccount, gas: 120000});
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function claimVoterReward(pollID, salt, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.registryInstance.claimVoterReward(parseInt(pollID), parseInt(salt), {from: ethConfig.selectedAccount});
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function updateStatus(listingHash, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.registryInstance.updateStatus(listingHash, { from: ethConfig.selectedAccount, gas:300000 });
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function commitVote(pollID, voteChoice, salt, numTokens, callback) {
    await ethConfig.ready();
    try {
        //get the previous poll ID for sorting purposes
        let previousPollID = await ethConfig.PLCRVotingInstance.getInsertPointForNumTokens(ethConfig.selectedAccount, fromTokenDecimal(numTokens), {from: ethConfig.selectedAccount});

        //let packedHashValue = web3.sha3(web3.toHex(voteChoice) + web3.toHex(salt), { encoding: "hex" });
        //let packedHashValue = web3.utils.soliditySha3(voteChoice, salt);
        //let packedHashValue = keccak256(voteChoice, salt);
        let packedHashValue = ethConfig.web3.utils.soliditySha3(parseInt(voteChoice), parseInt(salt));


        const result = await ethConfig.PLCRVotingInstance.commitVote(pollID, packedHashValue, fromTokenDecimal(numTokens), previousPollID, {from: ethConfig.selectedAccount});
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function verify(listingHash, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.verifierInstance.verify(listingHash, { from: ethConfig.selectedAccount });
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function challenge(listingHash, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.registryInstance.challenge(listingHash, "", { from: ethConfig.selectedAccount });
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function requestVotingRights(_numTokens, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.MEDXTokenInstance.approveAndCall(ethConfig.PLCRVotingInstance.address, fromTokenDecimal(_numTokens), '', {from: ethConfig.selectedAccount});
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function withdrawVotingRights(_numTokens, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.PLCRVotingInstance.withdrawVotingRights(fromTokenDecimal(_numTokens), {from: ethConfig.selectedAccount});
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function approveRegistryAllowance(_numTokens, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.MEDXTokenInstance.approve(ethConfig.registryInstance.address, fromTokenDecimal(_numTokens), { from: ethConfig.selectedAccount });
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function increaseRegistryAllowance(_numTokens, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.MEDXTokenInstance.increaseApproval(ethConfig.registryInstance.address, fromTokenDecimal(_numTokens), { from: ethConfig.selectedAccount });
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function decreaseRegistryAllowance(_numTokens, callback) {
    await ethConfig.ready();
    try {
        const result = await ethConfig.MEDXTokenInstance.decreaseApproval(ethConfig.registryInstance.address, fromTokenDecimal(_numTokens), { from: ethConfig.selectedAccount });
        await waitForTxComplete(result.tx, callback);
    } catch (error) {
        callback(error, "");
    }
}

export async function getAllPolls(callback) {
    await ethConfig.ready();

    let highestPollNonce = await ethConfig.PLCRVotingInstance.pollNonce({ from: ethConfig.selectedAccount });

    let lastBlock = await ethConfig.web3.eth.getBlock('latest');
    let lastBlockTime = lastBlock.timestamp;

    let polls = [];
    for (let i = 1; i <= highestPollNonce; i++) {
        try {
            let poll = await getPoll(i);
            poll.timeCalled = lastBlockTime;
            polls.push(poll);
        }
        catch (e) {
            console.log("error: could not load poll with id " + i);
        }
    }
    callback(polls);
    return polls;
}

export async function getPoll(counter) {
    await ethConfig.ready();

    let pollData = await ethConfig.PLCRVotingInstance.pollMap(counter, { from: ethConfig.selectedAccount });

    //uint commitEndDate;     /// expiration date of commit period for poll
    //uint revealEndDate;     /// expiration date of reveal period for poll
    //uint voteQuorum;	      /// number of votes required for a proposal to pass
    //uint votesFor;		      /// tally of votes supporting proposal
    //uint votesAgainst;      /// tally of votes countering proposal

    let poll = {
        pollID: counter,
        commitEndDate: pollData[0],
        revealEndDate: pollData[1],
        voteQuorum: pollData[2],
        votesFor: pollData[3],
        votesAgainst: pollData[4]
    };

    //Note: numTokens is an indicator of whether the user has submitted a vote
    poll.numTokens = await ethConfig.PLCRVotingInstance.getNumTokens(ethConfig.selectedAccount, counter, { from: ethConfig.selectedAccount });
    if (poll.numTokens > 0) //only if the user has voted
        poll.hasBeenRevealed = await ethConfig.PLCRVotingInstance.hasBeenRevealed(ethConfig.selectedAccount, counter, { from: ethConfig.selectedAccount });
    poll.revealPeriodActive = await ethConfig.PLCRVotingInstance.revealPeriodActive(counter, { from: ethConfig.selectedAccount });
    poll.commitPeriodActive = await ethConfig.PLCRVotingInstance.commitPeriodActive(counter, { from: ethConfig.selectedAccount });
    poll.pollEnded = await ethConfig.PLCRVotingInstance.pollEnded(counter, { from: ethConfig.selectedAccount });

    let persistedPoll = JSON.parse(localStorage.getItem("vote" + poll.pollID));
    if (persistedPoll && poll.pollEnded && poll.hasBeenRevealed && poll.numTokens > 0) {
        //Do a calculation to determine the number of tokens due based on localStorage data
        let isPassed = (100 * parseInt(poll.votesFor) > parseInt(poll.voteQuorum) * (parseInt(poll.votesFor) + parseInt(poll.votesAgainst)));
        if ((isPassed && persistedPoll.voteChoice == 1) || (!isPassed && persistedPoll.voteChoice == 0))
            poll.voterHasReward = true;
        else
            poll.voterHasReward = false;
        //poll.voterReward = await ethConfig.registryInstance.voterReward(ethConfig.selectedAccount, poll.pollID, persistedPoll.salt);
    }

    if (poll.pollEnded && poll.hasBeenRevealed && poll.numTokens > 0) {
        let poorlyNamedCanClaimReward = await ethConfig.registryInstance.voterCanClaimReward(poll.pollID, ethConfig.selectedAccount);
        poll.voterCanClaimReward = !poorlyNamedCanClaimReward;
    }
    return poll;
}

export async function getListingbyHash(listingHash, callback) {
    await ethConfig.ready();

    /* What a listing looks like */
    //0 listing hash -- not stored on chain in the struct
    //1 uint applicationExpiry; // Expiration date of apply stage
    //2 bool whitelisted;       // Indicates registry status
    //3 address owner;          // Owner of Listing
    //4 uint unstakedDeposit;   // Number of tokens in the listing not locked in a challenge
    //5 uint challengeID;       // Corresponds to a PollID in PLCRVoting
    //6 data/ipfshash

    let registryData = await ethConfig.registryInstance.listings(listingHash, { from: ethConfig.selectedAccount });

    let registryEntry = {
        listingHash: listingHash,
        applicationExpiry: registryData[0],
        whitelisted: registryData[1],
        owner: registryData[2],
        unstakedDeposit: registryData[3],
        challengeID: registryData[4],
        ipfsHash: registryData[5],
    };

    //Go get the challenge data
    if (registryEntry.challengeID) {
        //uint rewardPool;        // (remaining) Pool of tokens to be distributed to winning voters
        //address challenger;     // Owner of Challenge
        //bool resolved;          // Indication of if challenge is resolved
        //uint stake;             // Number of tokens at stake for either party during challenge
        //uint totalTokens;       // (remaining) Number of tokens used in voting by the winning side
        //mapping(address => bool) voterCanClaimReward; // Indicates whether a voter has claimed a reward yet

        let lastChallengeData = await ethConfig.registryInstance.challenges(registryEntry.challengeID, { from: ethConfig.selectedAccount });
        registryEntry.challenge = {
            rewardPool: lastChallengeData[0],
            challenger: lastChallengeData[1],
            resolved: lastChallengeData[2],
            stake: lastChallengeData[3],
            totalTokens: lastChallengeData[4]
        };

        if (!registryEntry.challenge.resolved && registryEntry.challengeID > 0) {
            let unresolvedPoll = await getPoll(registryEntry.challengeID);
            registryEntry.poll = unresolvedPoll;
        }
    }

    //Go get the IPFS data
    let hashedData = await downloadJson(registryEntry.ipfsHash);
    hashedData = hashedData.toString('utf8');
    hashedData = JSON.parse(hashedData);
    registryEntry.application = {
        firstName: hashedData.firstName,
        lastName: hashedData.lastName,
        medSchoolDiplomaDocHash: hashedData.medSchoolDiplomaDocHash,
        residencyDiplomaDocHash: hashedData.residencyDiplomaDocHash,
        medLicenseDocHash: hashedData.medLicenseDocHash,
        specialtyCertificateDocHash: hashedData.specialtyCertificateDocHash,
        medLicenseExpirationDate: hashedData.medLicenseExpirationDate,
        medLicenseNumber: hashedData.medLicenseNumber,
        medLicenseLocation: hashedData.medLicenseLocation,
        specialtyCertificteLocation: hashedData.specialtyCertificteLocation,
        medSchoolName: hashedData.medSchoolName,
        residencyProgram: hashedData.residencyProgram,
        specialty: hashedData.specialty,
        prescribesNumber: hashedData.prescribesNumber,
        additionalInformation: hashedData.additionalInformation,
        officePhone: hashedData.officePhone,
        officeAddress: hashedData.officeAddress,
        languagesSpoken: hashedData.languagesSpoken,
    };

    if (callback)
        callback(registryEntry);
    return registryEntry;
}

export async function getAllListings(callback) {
    await ethConfig.ready();

    /* What a listing looks like */
    //0 TBD listing hash
    //1 uint applicationExpiry; // Expiration date of apply stage
    //2 bool whitelisted;       // Indicates registry status
    //3 address owner;          // Owner of Listing
    //4 uint unstakedDeposit;   // Number of tokens in the listing not locked in a challenge
    //5 uint challengeID;       // Corresponds to a PollID in PLCRVoting
    //6 TBD Hash

    let registryEntryHashes = await ethConfig.registryInstance.getAllListings(0, { from: ethConfig.selectedAccount });
    let lastBlock = await ethConfig.web3.eth.getBlock('latest');
    let lastBlockTime = lastBlock.timestamp;

    let registryEntries = [];
    for (let i = 0; i < registryEntryHashes.length; i++) {
        try {
            let registryEntry = await getListingbyHash(registryEntryHashes[i], null);
            registryEntry.timeCalled = lastBlockTime;
            registryEntries[i] = registryEntry;
        }
        catch(e) {
            console.log("error: could not load listing with hash " + registryEntryHashes[i]);
        }
    }

    if (callback)
        callback(registryEntries);
    return registryEntries;

}

export async function getSelectedAccount(callback) {
    const web3 = await getWeb3Object();
    const _accounts = await web3.eth.getAccounts();
    if(callback)
        callback(_accounts[0]);
    return _accounts[0];
}

export async function getSelectedAccountBalance() {
    await ethConfig.ready();
    const result = await ethConfig.MEDXTokenInstance.balanceOf.call(ethConfig.selectedAccount);
    return toTokenDecimal(result.toNumber());
}

export async function getRegistryContactAllowance() {
    await ethConfig.ready();
    const result = await ethConfig.MEDXTokenInstance.allowance(ethConfig.selectedAccount, ethConfig.registryInstance.address);
    return toTokenDecimal(result.toNumber());
}

export async function getVotingTokensBalance() {
    await ethConfig.ready();
    const result = await ethConfig.PLCRVotingInstance.voteTokenBalance(ethConfig.selectedAccount);
    return toTokenDecimal(result.toNumber());
}

export function fromTokenDecimal(tokenAmount) {
    return tokenAmount * 10 ** 18;
}

export function toTokenDecimal(tokenAmount) {
    return tokenAmount / 10 ** 18;
}

async function getWeb3Object() {
    console.log("getting web3 object...");
    const web3Result = await getWeb3;
    return web3Result.web3;
}

async function waitForTxComplete(txHash, callback) {
    await ethConfig.ready();
    console.log("TX Hash [" + txHash + "]");

    ethConfig.web3.eth.getTransactionReceipt(txHash, function (error, result) {
        if (error !== null) {
            console.log(error);
            callback(error, result);
            return;
        }

        if (result !== null) {
            callback(null, result);
            return;
        }
        console.log("Waiting for tx to be mined....");
        setTimeout(function () {
            waitForTxComplete(txHash, callback);
        }, 5000);
    });
}