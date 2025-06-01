const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying XVerification contract to Coston2...");

  // Coston2 testnet contract addresses for FDC (properly checksummed)
  const FDC_HUB_ADDRESS = "0x3E52461BE1E4FEFBF1CB98C0189F14CB96608C56"; // FdcHub on Coston2
  const FDC_VERIFICATION_ADDRESS = "0x07F96C4EB1FF75E0E626169A9D7C278D46655BC3"; // FdcVerification on Coston2

  // Get the contract factory
  const XVerification = await ethers.getContractFactory("XVerification");

  // Deploy the contract
  const xVerification = await XVerification.deploy(FDC_HUB_ADDRESS, FDC_VERIFICATION_ADDRESS);

  // Wait for deployment
  await xVerification.waitForDeployment();

  console.log("XVerification deployed to:", await xVerification.getAddress());
  console.log("FDC Hub Address:", FDC_HUB_ADDRESS);
  console.log("FDC Verification Address:", FDC_VERIFICATION_ADDRESS);
  
  // Display important information for using the contract
  console.log("\n=== Contract Information ===");
  console.log("Network: Coston2 Testnet");
  console.log("Chain ID: 114");
  console.log("To verify Twitter accounts:");
  console.log("1. Call requestVerification(tweetId, expectedTwitterId) with payment");
  console.log("2. Wait for FDC to process the attestation");
  console.log("3. Retrieve attestation response and proof from DA Layer");
  console.log("4. Call submitVerification(requestId, response, proof)");
  console.log("\nDA Layer API: https://ctn2-data-availability.flare.network/api-doc#/");
  console.log("Web2Json Verifier: https://jq-verifier-test.flare.rocks/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 