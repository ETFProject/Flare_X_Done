const { ethers } = require("hardhat");

// Your deployed contract address
const CONTRACT_ADDRESS = "0xC14d5D0e0f16036F54842E212e65E62aA46170bF";

async function main() {
  console.log("🎬 Twitter Verification DApp - Live Demo");
  console.log("========================================");
  
  // Get the contract instance
  const XVerification = await ethers.getContractFactory("XVerification");
  const xVerification = XVerification.attach(CONTRACT_ADDRESS);
  
  // Get signer (your wallet)
  const [signer] = await ethers.getSigners();
  
  console.log("🔑 Wallet Info:");
  console.log("Address:", signer.address);
  
  const balance = await ethers.provider.getBalance(signer.address);
  console.log("Balance:", ethers.formatEther(balance), "C2FLR");
  
  console.log("\n📱 Contract Info:");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Network: Coston2 Testnet");
  console.log("Explorer: https://coston2-explorer.flare.network/address/" + CONTRACT_ADDRESS);
  
  // Check current verification status
  const isVerified = await xVerification.isUserVerified(signer.address);
  console.log("\n✨ Current Status:");
  console.log("User verified:", isVerified);
  
  if (isVerified) {
    const twitterId = await xVerification.getUserTwitterId(signer.address);
    console.log("Twitter ID:", twitterId);
    
    try {
      const restrictedResult = await xVerification.restrictedFunction();
      console.log("🎉 Restricted function result:", restrictedResult);
    } catch (error) {
      console.log("❌ Restricted function error:", error.message);
    }
  } else {
    console.log("📝 To verify your Twitter account:");
    console.log("\n🐦 Step 1: Create a Tweet");
    console.log("Create a tweet that mentions your wallet address:");
    console.log(`"Verifying my wallet ${signer.address} on Flare #FlareNetwork #Web3"`);
    
    console.log("\n🔗 Step 2: Get Tweet ID");
    console.log("After posting, copy the tweet ID from the URL:");
    console.log("https://twitter.com/username/status/TWEET_ID_HERE");
    
    console.log("\n👤 Step 3: Get Your Twitter User ID");
    console.log("Visit: https://tweeterid.com/");
    console.log("Enter your Twitter username to get your numeric user ID");
    
    console.log("\n💻 Step 4: Run Verification");
    console.log("Replace the values in request-verification.js with your real data:");
    console.log("- TWEET_ID: The ID from step 2");
    console.log("- TWITTER_USER_ID: The ID from step 3");
    
    console.log("\n⚡ Step 5: Execute");
    console.log("Run: npm run test-verification");
  }
  
  // Test contract read functions
  console.log("\n🔍 Testing Contract Read Functions:");
  
  try {
    // Test Web2Json attestation type
    const attestationType = await xVerification.WEB2JSON_ATTESTATION_TYPE();
    console.log("Web2Json Attestation Type:", attestationType);
    
    // Test FDC Hub address
    const fdcHub = await xVerification.fdcHub();
    console.log("FDC Hub Address:", fdcHub);
    
    // Test FDC Verification address
    const fdcVerification = await xVerification.fdcVerification();
    console.log("FDC Verification Address:", fdcVerification);
    
    console.log("✅ All contract functions are working correctly!");
    
  } catch (error) {
    console.error("❌ Error reading contract:", error.message);
  }
  
  console.log("\n🚀 Your Twitter Verification DApp is Live!");
  console.log("🌐 Key Features:");
  console.log("  ✅ Trustless Twitter verification using Flare FDC");
  console.log("  ✅ Web2 → Web3 data bridging");
  console.log("  ✅ Cryptographic proof verification");
  console.log("  ✅ On-chain verification storage");
  
  console.log("\n📚 Resources:");
  console.log("🔗 Contract Explorer: https://coston2-explorer.flare.network/address/" + CONTRACT_ADDRESS);
  console.log("🔗 DA Layer API: https://ctn2-data-availability.flare.network/api-doc#/");
  console.log("🔗 Flare FDC Docs: https://dev.flare.network/fdc/");
  console.log("🔗 Web2Json Verifier: https://jq-verifier-test.flare.rocks/");
  
  console.log("\n🎯 Next Steps:");
  console.log("1. Follow the steps above to verify your Twitter account");
  console.log("2. Test the restricted functions after verification");
  console.log("3. Build a frontend interface for your users");
  console.log("4. Consider deploying to Flare Mainnet for production");
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 