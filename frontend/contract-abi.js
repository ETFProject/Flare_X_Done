// Contract configuration
const CONTRACT_CONFIG = {
    address: "0xC14d5D0e0f16036F54842E212e65E62aA46170bF",
    network: {
        name: "Coston2 Testnet",
        chainId: 114,
        rpcUrl: "https://coston2-api.flare.network/ext/C/rpc",
        explorerUrl: "https://coston2-explorer.flare.network",
        currency: {
            name: "C2FLR",
            symbol: "C2FLR",
            decimals: 18
        }
    }
};

// Contract ABI - XVerification
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_fdcHubAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_fdcVerificationAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "twitterId",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tweetId",
                "type": "string"
            }
        ],
        "name": "UserVerified",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tweetId",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "requestId",
                "type": "bytes32"
            }
        ],
        "name": "VerificationRequested",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "WEB2JSON_ATTESTATION_TYPE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fdcHub",
        "outputs": [
            {
                "internalType": "contract IFdcHub",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fdcVerification",
        "outputs": [
            {
                "internalType": "contract IFdcVerification",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserTwitterId",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "isUserVerified",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "tweetId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "expectedTwitterId",
                "type": "string"
            }
        ],
        "name": "requestVerification",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "requestIdToTweetId",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "requestIdToUser",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "restrictedFunction",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "revokeVerification",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "requestId",
                "type": "bytes32"
            },
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "bytes32",
                                "name": "attestationType",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "sourceId",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "messageIntegrityCode",
                                "type": "bytes32"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "bytes",
                                        "name": "abiEncodedData",
                                        "type": "bytes"
                                    }
                                ],
                                "internalType": "struct IWeb2Json.ResponseBody",
                                "name": "responseBody",
                                "type": "tuple"
                            }
                        ],
                        "internalType": "struct IWeb2Json.Response",
                        "name": "data",
                        "type": "tuple"
                    },
                    {
                        "internalType": "bytes32[]",
                        "name": "merkleProof",
                        "type": "bytes32[]"
                    }
                ],
                "internalType": "struct IWeb2Json.Proof",
                "name": "proof",
                "type": "tuple"
            }
        ],
        "name": "submitVerification",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userTwitterIds",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "verifiedUsers",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// External APIs
const EXTERNAL_APIS = {
    twitterIdLookup: "https://tweeterid.com/",
    fdcDataLayer: "https://ctn2-data-availability.flare.network/api-doc#/",
    web2JsonVerifier: "https://jq-verifier-test.flare.rocks/"
}; 