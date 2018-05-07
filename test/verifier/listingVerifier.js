/* eslint-env mocha */
/* global web3 assert contract artifacts */
const listingVerifierArtifact = artifacts.require('./ListingVerifier');
const registryArtifact = artifacts.require('./Registry');
const tokenArtifact = artifacts.require('./MedXToken');
const votingArtifact = artifacts.require('./PLCRVoting');

let listingVerifier;
let registry;
let token;
let voting;

contract('ListingVerifier', (accounts) => {
    const [_deployer, _account1, _account2] = accounts;

    beforeEach(async () => {
        listingVerifier = await listingVerifierArtifact.new();
        registry = await registryArtifact.deployed();
        token = await tokenArtifact.deployed();
        voting = await votingArtifact.deployed();
    });

    describe('Function: verify', async () => {
        it("should verify listing", async () => {
            const listingHash = web3.sha3("Listing");
            let listingVerifyCount = await listingVerifier.listingVerifiedCount(listingHash);
            assert.equal(listingVerifyCount, 0, "Verification count should be 0");

            await listingVerifier.verify(listingHash, {from: _account1});

            listingVerifyCount = await listingVerifier.listingVerifiedCount(listingHash);
            assert.equal(listingVerifyCount, 1, "Incorrect verification count");

            const listingHash1 = web3.sha3("Listing1");
            let listingVerifyCount1 = await listingVerifier.listingVerifiedCount(listingHash1);
            assert.equal(listingVerifyCount1, 0, "Verification count should be 0");

            await listingVerifier.verify(listingHash1, {from: _account1});

            listingVerifyCount1 = await listingVerifier.listingVerifiedCount(listingHash1);
            assert.equal(listingVerifyCount1, 1, "Incorrect verification count");
            assert.equal(listingVerifyCount, 1, "Incorrect verification count");

            await listingVerifier.verify(listingHash, {from: _account1});

            listingVerifyCount = await listingVerifier.listingVerifiedCount(listingHash);
            assert.equal(listingVerifyCount, 2, "Incorrect verification count");
            assert.equal(listingVerifyCount1, 1, "Incorrect verification count");

        });
        it("should test array return", async () => {
            const listingHash = web3.sha3("Listing");
            await registry.apply(listingHash, web3.toWei(1), "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG", {from: _account2});
            console.log(await registry.getAllListings());
            console.log(await registry.allListings(0));
            const retreivedlistingHash = await registry.allListings(0);
            console.log("Initial hash [" + listingHash + "] retreived hash [" + retreivedlistingHash + "]");
            assert.equal(retreivedlistingHash, listingHash, "Incorrect listing retrieved");
            const listing = await registry.listings(retreivedlistingHash);
            console.log("IPFS Hash [" + listing + "]");
        });

        it("should transfer tokens on behalf of user", async () => {
            const listingHash = web3.sha3("Listing2");
            console.log("Before: " + web3.fromWei(await token.allowance(_account2, registryArtifact.address)));
            await registry.apply(listingHash, web3.toWei(1), "", {from: _account2});
            console.log("After: " + web3.fromWei(await token.allowance(_account2, registryArtifact.address)));
        });

        it("should use approve and call to request Voting rights", async () => {
            console.log("Voting Token before: " + await voting.voteTokenBalance(_account1));
            await token.approveAndCall(voting.address, 20, '', {from: _account1});
            console.log("Voting tokens after: " + await voting.voteTokenBalance(_account1));
        });
    });
});
