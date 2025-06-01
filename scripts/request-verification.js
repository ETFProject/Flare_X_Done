const { ethers } = require("hardhat");

// Your deployed contract address
const CONTRACT_ADDRESS = "0xC14d5D0e0f16036F54842E212e65E62aA46170bF";

async function main() {
  console.log("🚀 Testing Twitter Verification Request");
  console.log("=======================================");
  
  // Get the contract instance
  const XVerification = await ethers.getContractFactory("XVerification");
  const xVerification = XVerification.attach(CONTRACT_ADDRESS);
  
  // Get signer (your wallet)
  const [signer] = await ethers.getSigners();
  console.log("Using wallet:", signer.address);
  
  // For testing purposes, let's use example data
  // In real usage, you would:
  // 1. Create a tweet mentioning your wallet address
  // 2. Get the tweet ID from Twitter
  // 3. Get your Twitter user ID
  
  // Example tweet ID (you'll need to replace with a real one)
  const TWEET_ID = "1234567890123456789"; // Replace with real tweet ID
  const TWITTER_USER_ID = "987654321"; // Replace with your real Twitter user ID
  
  console.log("\n📝 Verification Parameters:");
  console.log("Tweet ID:", TWEET_ID);
  console.log("Expected Twitter User ID:", TWITTER_USER_ID);
  console.log("Fee: 0.001 C2FLR");
  
  console.log("\n⚠️  Note: This is using example data.");
  console.log("For real verification, you need:");
  console.log("1. Create a tweet with your wallet address:", signer.address);
  console.log("2. Get the tweet ID from the URL");
  console.log("3. Get your Twitter user ID from tweeterid.com or similar");
  
  // Ask user if they want to proceed with test
  console.log("\n🔄 This will make a test request to FDC...");
  console.log("The request will likely fail with test data, but it will show the flow.");
  
  try {
    // Check current balance
    const balance = await ethers.provider.getBalance(signer.address);
    console.log("\nCurrent balance:", ethers.formatEther(balance), "C2FLR");
    
    // Simulate the verification request
    console.log("\n🚀 Submitting verification request...");
    
    const fee = ethers.parseEther("0.001"); // 0.001 C2FLR fee
    const tx = await xVerification.requestVerification(TWEET_ID, TWITTER_USER_ID, { value: fee });
    
    console.log("Transaction hash:", tx.hash);
    console.log("⏳ Waiting for transaction confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed!");
    console.log("Block number:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    
    // Parse the VerificationRequested event
    const eventFilter = xVerification.filters.VerificationRequested();
    const events = await xVerification.queryFilter(eventFilter, receipt.blockNumber, receipt.blockNumber);
    
    if (events.length > 0) {
      const event = events[0];
      console.log("\n📡 VerificationRequested Event:");
      console.log("Request ID:", event.args.requestId);
      console.log("User:", event.args.user);
      console.log("Tweet ID:", event.args.tweetId);
      
      // Save request ID for later use
      console.log("\n💾 Save this Request ID for checking status:");
      console.log(event.args.requestId);
    }
    
    // Check updated balance
    const newBalance = await ethers.provider.getBalance(signer.address);
    console.log("\nNew balance:", ethers.formatEther(newBalance), "C2FLR");
    console.log("Fee paid:", ethers.formatEther(balance - newBalance), "C2FLR");
    
    console.log("\n⏳ Next Steps:");
    console.log("1. Wait 2-5 minutes for FDC to process");
    console.log("2. Check DA Layer API for attestation response");
    console.log("3. If using real data, the attestation should be available");
    console.log("4. Submit the attestation proof to complete verification");
    
    console.log("\n🔗 DA Layer API:");
    console.log("https://ctn2-data-availability.flare.network/api-doc#/");
    
  } catch (error) {
    console.error("❌ Error submitting verification request:");
    console.error(error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Solution: Add more C2FLR to your wallet");
    } else if (error.message.includes("execution reverted")) {
      console.log("\n💡 This might be expected with test data");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 