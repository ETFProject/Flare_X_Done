// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@flarenetwork/flare-periphery-contracts/coston2/IFdcHub.sol";
import "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

contract XVerification is Ownable {
    IFdcHub public fdcHub;
    IFdcVerification public fdcVerification;
    
    mapping(address => bool) public verifiedUsers;
    mapping(address => string) public userTwitterIds;
    mapping(bytes32 => address) public requestIdToUser;
    mapping(bytes32 => string) public requestIdToTweetId;
    
    // Web2Json attestation type for FDC
    bytes32 public constant WEB2JSON_ATTESTATION_TYPE = bytes32("Web2Json");

    event VerificationRequested(address indexed user, string tweetId, bytes32 requestId);
    event UserVerified(address indexed user, string twitterId, string tweetId);

    constructor(address _fdcHubAddress, address _fdcVerificationAddress) Ownable(msg.sender) {
        fdcHub = IFdcHub(_fdcHubAddress);
        fdcVerification = IFdcVerification(_fdcVerificationAddress);
    }

    // Request FDC attestation for an X post
    function requestVerification(string memory tweetId, string memory expectedTwitterId) external payable {
        // Construct Web2Json request for Twitter API
        string memory apiUrl = string(abi.encodePacked(
            "https://api.x.com/2/tweets/",
            tweetId,
            "?tweet.fields=author_id"
        ));
        
        // Create the Web2Json request body
        IWeb2Json.RequestBody memory requestBody = IWeb2Json.RequestBody({
            url: apiUrl,
            httpMethod: "GET",
            headers: "{}",
            queryParams: "{}",
            body: "{}",
            postProcessJq: ".data.author_id",
            abiSignature: "(string)"
        });
        
        // Calculate Message Integrity Code (MIC) - hash of expected response
        bytes memory expectedResponse = abi.encode(expectedTwitterId);
        bytes32 messageIntegrityCode = keccak256(expectedResponse);

        // Create the complete request
        IWeb2Json.Request memory request = IWeb2Json.Request({
            attestationType: WEB2JSON_ATTESTATION_TYPE,
            sourceId: bytes32("TWITTER"),
            messageIntegrityCode: messageIntegrityCode,
            requestBody: requestBody
        });

        // Encode the request and submit to FdcHub
        bytes memory encodedRequest = abi.encode(request);
        fdcHub.requestAttestation{value: msg.value}(encodedRequest);

        // Generate a unique request ID for tracking
        bytes32 requestId = keccak256(abi.encodePacked(
            msg.sender, 
            tweetId, 
            expectedTwitterId, 
            block.timestamp
        ));

        requestIdToUser[requestId] = msg.sender;
        requestIdToTweetId[requestId] = tweetId;
        
        emit VerificationRequested(msg.sender, tweetId, requestId);
    }

    // Submit FDC response to verify user
    function submitVerification(
        bytes32 requestId,
        IWeb2Json.Proof calldata proof
    ) external {
        require(requestIdToUser[requestId] != address(0), "Invalid request ID");
        address user = requestIdToUser[requestId];
        string memory tweetId = requestIdToTweetId[requestId];

        // Verify FDC attestation using Merkle proof
        require(fdcVerification.verifyJsonApi(proof), "FDC verification failed");
        
        // Ensure the response is for our request
        require(proof.data.attestationType == WEB2JSON_ATTESTATION_TYPE, "Wrong attestation type");
        require(proof.data.sourceId == bytes32("TWITTER"), "Wrong source ID");

        // Decode the Twitter author ID from the response
        string memory twitterAuthorId = abi.decode(proof.data.responseBody.abiEncodedData, (string));

        // Store the verification
        verifiedUsers[user] = true;
        userTwitterIds[user] = twitterAuthorId;
        
        // Clean up
        delete requestIdToUser[requestId];
        delete requestIdToTweetId[requestId];

        emit UserVerified(user, twitterAuthorId, tweetId);
    }

    // Check if a user is verified
    function isUserVerified(address user) external view returns (bool) {
        return verifiedUsers[user];
    }
    
    // Get the verified Twitter ID for a user
    function getUserTwitterId(address user) external view returns (string memory) {
        require(verifiedUsers[user], "User not verified");
        return userTwitterIds[user];
    }

    // Example dapp function requiring verification
    function restrictedFunction() external view returns (string memory) {
        require(verifiedUsers[msg.sender], "User not verified");
        return string(abi.encodePacked("Access granted! Your Twitter ID: ", userTwitterIds[msg.sender]));
    }
    
    // Allow users to revoke their verification
    function revokeVerification() external {
        require(verifiedUsers[msg.sender], "User not verified");
        verifiedUsers[msg.sender] = false;
        delete userTwitterIds[msg.sender];
    }
}