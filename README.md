# Flare Twitter Verification DApp

A decentralized application that verifies Twitter account ownership using Flare's FDC (Flare Data Connector) and Web2Json attestation type.

## 🌟 Features

- **Trustless Twitter Verification**: Verify Twitter account ownership without centralized authorities
- **Flare FDC Integration**: Uses Flare's enshrined oracle for secure data verification
- **Web2Json Attestation**: Leverages Flare's Web2Json attestation type to fetch Twitter API data
- **Smart Contract Based**: All verification logic is on-chain and transparent
- **Coston2 Testnet**: Currently deployed on Flare's Coston2 testnet

## 🚀 How It Works

1. **Request Verification**: User submits a tweet ID and their expected Twitter user ID
2. **FDC Processing**: Flare Data Connector fetches data from Twitter API using Web2Json attestation
3. **Merkle Proof**: FDC creates a Merkle proof of the verified data
4. **On-Chain Verification**: Smart contract verifies the Merkle proof and confirms Twitter ownership
5. **User Verified**: User's address is now linked to their verified Twitter account

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or compatible wallet
- Coston2 testnet tokens (C2FLR) from [Coston2 Faucet](https://faucet.flare.network/coston2)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd flare-x-dapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   PRIVATE_KEY=your_wallet_private_key_here
   ```

4. **Compile the contracts**:
   ```bash
   npm run compile
   ```

## 🚀 Deployment

Deploy to Coston2 testnet:

```bash
npm run deploy
```

This will deploy the XVerification contract using the FDC Hub and Verification contracts on Coston2.

## 📖 Usage

### Requesting Twitter Verification

To verify your Twitter account, you need to:

1. **Post a tweet** with a specific message (optional but recommended for verification)
2. **Get the tweet ID** from the tweet URL
3. **Know your Twitter user ID** (you can find this using Twitter's API or online tools)
4. **Call the contract**:

```javascript
// Example using ethers.js
const tweetId = "1234567890123456789"; // Your tweet ID
const expectedTwitterId = "987654321"; // Your Twitter user ID
const fee = ethers.parseEther("0.001"); // Fee for FDC attestation

await xVerification.requestVerification(tweetId, expectedTwitterId, { value: fee });
```

### Submitting Verification Proof

After the FDC processes your request:

1. **Wait for attestation processing** (typically a few minutes)
2. **Retrieve the attestation response and proof** from Flare's DA Layer
3. **Submit the verification**:

```javascript
await xVerification.submitVerification(requestId, response, proof);
```

### Checking Verification Status

```javascript
// Check if an address is verified
const isVerified = await xVerification.isUserVerified(userAddress);

// Get the verified Twitter ID for an address
const twitterId = await xVerification.getUserTwitterId(userAddress);
```

## 🔗 Key Components

### Smart Contract Functions

- `requestVerification(tweetId, expectedTwitterId)`: Submit a verification request
- `submitVerification(requestId, response, proof)`: Submit FDC attestation proof
- `isUserVerified(address)`: Check if an address is verified
- `getUserTwitterId(address)`: Get verified Twitter ID for an address
- `restrictedFunction()`: Example function requiring verification
- `revokeVerification()`: Allow users to revoke their verification

### FDC Integration

- **Web2Json Attestation Type**: Used to fetch Twitter API data
- **Merkle Proof Verification**: Ensures data integrity and authenticity
- **Message Integrity Code (MIC)**: Prevents manipulation of expected responses

## 🌐 Network Information

### Coston2 Testnet
- **RPC URL**: `https://coston2-api.flare.network/ext/C/rpc`
- **Chain ID**: 114
- **Native Token**: C2FLR
- **Faucet**: https://faucet.flare.network/coston2
- **Explorer**: https://coston2-explorer.flare.network

### FDC Contract Addresses (Coston2)
- **FDC Hub**: `0x3e52461Be1e4feFbF1CB98C0189f14cb96608C56`
- **FDC Verification**: `0x07f96C4Eb1Ff75e0e626169A9D7C278d46655Bc3`

## 🔧 Development

### Running Tests
```bash
npm test
```

### Local Development
```bash
npm run node  # Start local Hardhat node
```

### Cleaning Build Artifacts
```bash
npm run clean
```

## 📚 Resources

- [Flare Developer Documentation](https://dev.flare.network/)
- [FDC Overview](https://dev.flare.network/fdc/overview/)
- [Web2Json Attestation Type](https://dev.flare.network/fdc/attestation-types/)
- [Coston2 DA Layer API](https://ctn2-data-availability.flare.network/api-doc#/)
- [Web2Json Verifier](https://jq-verifier-test.flare.rocks/)

## ⚠️ Important Notes

1. **Testnet Only**: Currently configured for Coston2 testnet. For mainnet deployment, update contract addresses and network configuration.

2. **Twitter API Limitations**: The verification relies on Twitter's public API. Rate limits and API changes may affect functionality.

3. **Gas Costs**: FDC attestations require payment. Ensure you have sufficient C2FLR for transactions.

4. **Privacy**: Twitter user IDs are stored on-chain. Consider privacy implications.

## 🔮 Future Improvements

- [ ] Support for multiple social platforms
- [ ] Integration with Twitter's OAuth flow
- [ ] Mainnet deployment
- [ ] Frontend interface
- [ ] Batch verification capabilities
- [ ] Enhanced privacy features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

If you encounter issues:

1. Check the [Flare Developer Hub](https://dev.flare.network/) for documentation
2. Visit [Flare Discord](https://discord.gg/flare) for community support
3. Create an issue in this repository

---

Built with ❤️ using [Flare Network](https://flare.network/) and [Hardhat](https://hardhat.org/) 