pragma solidity ^0.4.24;

/**
 * @title Listing Verification
 * @dev Track verifications for listings in the physician registry
 * @author - Shane van Coller
 */

contract ListingVerifier {

    mapping(bytes32 => uint256) public listingVerifiedCount;
    event VerificationIncremented(address indexed verifier, bytes32 listingVerified, uint256 date);

    /**
     * @dev Empty constructor
     */
    constructor () public {}

    /**
     * @dev Function to increment the count of verifications for a given listing
     * @param _listing The listing to verify
     */
    function verify(bytes32 _listing) public {
        listingVerifiedCount[_listing] += 1;
        emit VerificationIncremented(msg.sender, _listing, now);
    }
}
