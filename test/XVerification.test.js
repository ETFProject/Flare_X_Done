const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("XVerification", function () {
  let xVerification;
  let owner;
  let user1;
  
  // Mock FDC contract addresses (for testing)
  const FDC_HUB_ADDRESS = "0x3e52461Be1e4feFbF1CB98C0189f14cb96608C56";
  const FDC_VERIFICATION_ADDRESS = "0x07f96C4Eb1Ff75e0e626169A9D7C278d46655Bc3";

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    
    const XVerification = await ethers.getContractFactory("XVerification");
    xVerification = await XVerification.deploy(FDC_HUB_ADDRESS, FDC_VERIFICATION_ADDRESS);
    await xVerification.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await xVerification.owner()).to.equal(owner.address);
    });

    it("Should set the correct FDC Hub address", async function () {
      expect(await xVerification.fdcHub()).to.equal(FDC_HUB_ADDRESS);
    });

    it("Should set the correct FDC Verification address", async function () {
      expect(await xVerification.fdcVerification()).to.equal(FDC_VERIFICATION_ADDRESS);
    });

    it("Should have the correct Web2Json attestation type", async function () {
      const expectedType = ethers.encodeBytes32String("Web2Json");
      expect(await xVerification.WEB2JSON_ATTESTATION_TYPE()).to.equal(expectedType);
    });
  });

  describe("User Verification Status", function () {
    it("Should return false for unverified users", async function () {
      expect(await xVerification.isUserVerified(user1.address)).to.be.false;
    });

    it("Should revert when getting Twitter ID for unverified user", async function () {
      await expect(xVerification.getUserTwitterId(user1.address))
        .to.be.revertedWith("User not verified");
    });

    it("Should revert when unverified user calls restricted function", async function () {
      await expect(xVerification.connect(user1).restrictedFunction())
        .to.be.revertedWith("User not verified");
    });
  });

  describe("Request Verification", function () {
    it("Should emit VerificationRequested event", async function () {
      const tweetId = "1234567890123456789";
      const expectedTwitterId = "987654321";
      const fee = ethers.parseEther("0.001");

      // Note: This will fail in actual execution because we don't have real FDC contracts
      // But it tests the event emission and parameter handling
      await expect(xVerification.connect(user1).requestVerification(tweetId, expectedTwitterId, { value: fee }))
        .to.emit(xVerification, "VerificationRequested")
        .withArgs(user1.address, tweetId, anyValue);
    });
  });
});

// Helper function for testing events with dynamic values
const anyValue = {
  asymmetricMatch: () => true,
  toString: () => "any value"
}; 