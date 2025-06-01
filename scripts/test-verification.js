const { ethers } = require("hardhat");

// Your deployed contract address
const CONTRACT_ADDRESS = "0xC14d5D0e0f16036F54842E212e65E62aA46170bF";

async function main() {
  console.log("🐦 Testing Twitter Verification DApp");
  console.log("=====================================");
  
  // Get the contract instance
  const XVerification = await ethers.getContractFactory("XVerification");
  const xVerification = XVerification.attach(CONTRACT_ADDRESS);
  
  // Get signer (your wallet)
  const [signer] = await ethers.getSigners();
  console.log("Using wallet:", signer.address);
  
  // Check wallet balance
  const balance = await ethers.provider.getBalance(signer.address);
  console.log("Wallet balance:", ethers.formatEther(balance), "C2FLR");
  
  console.log("\n📋 Contract Information:");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Network: Coston2 Testnet");
  
  // Test contract functions
  console.log("\n🔍 Testing Contract Functions:");
  
  try {
    // Check if user is already verified
    const isVerified = await xVerification.isUserVerified(signer.address);
    console.log("Is current user verified:", isVerified);
    
    if (isVerified) {
      const twitterId = await xVerification.getUserTwitterId(signer.address);
      console.log("User's Twitter ID:", twitterId);
    }
    
    // Test the restricted function
    try {
      const restrictedResult = await xVerification.restrictedFunction();
      console.log("Restricted function result:", restrictedResult);
    } catch (error) {
      console.log("✅ Restricted function correctly blocked unverified user");
    }
    
  } catch (error) {
    console.error("Error reading contract state:", error.message);
  }
  
  // Interactive testing menu
  console.log("\n🧪 Interactive Testing Options:");
  console.log("1. Request Twitter Verification");
  console.log("2. Check Verification Status");
  console.log("3. Test Restricted Function");
  console.log("4. Revoke Verification (if verified)");
  console.log("\nTo proceed with testing, modify this script or use the following examples:");
  
  console.log("\n📝 Example Usage:");
  console.log("// Request verification (replace with real tweet ID and your Twitter user ID)");
  console.log("await xVerification.requestVerification('1234567890123456789', '987654321', { value: ethers.parseEther('0.001') })");
  
  console.log("\n// Check if verification was successful");
  console.log("await xVerification.isUserVerified('" + signer.address + "')");
  
  console.log("\n🔗 Next Steps:");
  console.log("1. Create a tweet mentioning your wallet address");
  console.log("2. Get the tweet ID from the URL");
  console.log("3. Find your Twitter user ID (use tools like tweeterid.com)");
  console.log("4. Call requestVerification with those parameters");
  console.log("5. Wait for FDC to process (a few minutes)");
  console.log("6. Retrieve the attestation proof from DA Layer");
  console.log("7. Submit the proof to complete verification");
}

// Example function to request verification (commented out for safety)
async function requestVerification(tweetId, expectedTwitterId) {
  try {
    console.log("🚀 Requesting Twitter verification...");
    console.log("Tweet ID:", tweetId);
    console.log("Expected Twitter ID:", expectedTwitterId);
    
    const XVerification = await ethers.getContractFactory("XVerification");
    const xVerification = XVerification.attach(CONTRACT_ADDRESS);
    
    // Request verification with payment
    const fee = ethers.parseEther("0.001"); // 0.001 C2FLR fee
    const tx = await xVerification.requestVerification(tweetId, expectedTwitterId, { value: fee });
    
    console.log("Transaction submitted:", tx.hash);
    console.log("Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Verification request submitted!");
    console.log("Block number:", receipt.blockNumber);
    
    // Look for the VerificationRequested event
    const event = receipt.logs.find(log => {
      try {
        const parsed = xVerification.interface.parseLog(log);
        return parsed.name === "VerificationRequested";
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsed = xVerification.interface.parseLog(event);
      console.log("Request ID:", parsed.args.requestId);
      console.log("User:", parsed.args.user);
      console.log("Tweet ID:", parsed.args.tweetId);
    }
    
    console.log("\n⏳ Now wait for FDC to process the attestation...");
    console.log("Check the DA Layer API in a few minutes:");
    console.log("https://ctn2-data-availability.flare.network/api-doc#/");
    
  } catch (error) {
    console.error("❌ Error requesting verification:", error.message);
  }
}

// Example function to check FDC attestation status
async function checkAttestationStatus(requestId) {
  console.log("🔍 Checking attestation status for request:", requestId);
  console.log("📡 Query the DA Layer API:");
  console.log("https://ctn2-data-availability.flare.network/api/attestation-response/" + requestId);
  console.log("\n💡 Tip: Use curl or a REST client to check the API");
  console.log("curl 'https://ctn2-data-availability.flare.network/api/attestation-response/" + requestId + "'");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Uncomment and modify these lines to test specific functions:
// requestVerification("YOUR_TWEET_ID", "YOUR_TWITTER_USER_ID");
// checkAttestationStatus("YOUR_REQUEST_ID"); 