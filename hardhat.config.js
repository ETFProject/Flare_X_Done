require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Validate and provide a default private key for testing
let PRIVATE_KEY = process.env.PRIVATE_KEY;

// Clean and validate private key
if (PRIVATE_KEY) {
  // Remove any whitespace
  PRIVATE_KEY = PRIVATE_KEY.trim();
  
  // Add 0x prefix if missing
  if (!PRIVATE_KEY.startsWith('0x')) {
    PRIVATE_KEY = '0x' + PRIVATE_KEY;
  }
  
  // Check if it's the placeholder value
  if (PRIVATE_KEY === "0xyour_wallet_private_key" || PRIVATE_KEY === "your_wallet_private_key") {
    PRIVATE_KEY = null;
  }
}

// Check if private key is valid (64 hex chars + 0x prefix = 66 chars)
if (!PRIVATE_KEY || PRIVATE_KEY.length !== 66) {
  console.log("⚠️  Warning: No valid PRIVATE_KEY found in .env file");
  console.log("   Using default test private key for local development");
  console.log("   For Coston2 deployment, please set a valid private key in .env");
  // This is Hardhat's first default account private key - safe for testing
  PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
} else {
  console.log("✅ Valid private key found, using your wallet for deployment");
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    coston2: {
      url: "https://coston2-api.flare.network/ext/C/rpc",
      accounts: [PRIVATE_KEY],
      chainId: 114,
    },
    coston: {
      url: "https://coston-api.flare.network/ext/C/rpc", 
      accounts: [PRIVATE_KEY],
      chainId: 16,
    },
  },
};

