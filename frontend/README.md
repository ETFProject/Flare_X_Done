# Flare Twitter Verification DApp - Frontend

A modern web interface for verifying Twitter accounts on the Flare blockchain using FDC (Flare Data Connector).

## ✨ Features

- **4-Step Verification Process**: Choose Method → Verify → Process → Complete
- **MetaMask Integration**: Seamless wallet connection and transaction handling
- **Real-time Processing**: Live updates during verification with visual feedback
- **Mobile Responsive**: Works perfectly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- **MetaMask** browser extension installed
- **C2FLR tokens** on Coston2 testnet (get from [faucet](https://faucet.flare.network/coston2))
- **Twitter account** for verification

### Setup

1. **Start a local server** (required for CORS):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   
   # Or using PHP
   php -S localhost:8000
   ```

2. **Open the application**:
   ```
   http://localhost:8000
   ```

3. **Connect your wallet**:
   - Click "Connect Wallet"
   - Approve MetaMask connection
   - Automatically switches to Coston2 testnet

## 📱 How to Use

### Step 1: Choose Method
- Select **Tweet Verification** (recommended)
- Your wallet address will auto-fill

### Step 2: Verify
1. **Create a Tweet**:
   - Click "Copy Tweet" to copy the verification message
   - Click "Open Twitter" to post the tweet
   - The tweet must contain your wallet address

2. **Enter Details**:
   - Paste the tweet URL (e.g., `https://twitter.com/username/status/1234567890`)
   - Enter your Twitter handle (e.g., `@username`)

3. **Start Verification**:
   - Click "Start Verification"
   - Confirm the transaction in MetaMask (costs 0.001 C2FLR)

### Step 3: Process
Watch the real-time progress:
- ✅ Submitting verification request
- ✅ FDC processing Twitter data
- ✅ Generating cryptographic proof
- ✅ Verification complete

### Step 4: Complete
- View your verification details
- Test restricted functions
- See blockchain proof links
- Start a new verification if needed

## 🔧 Technical Details

### Smart Contract Integration
- **Contract Address**: `0xC14d5D0e0f16036F54842E212e65E62aA46170bF`
- **Network**: Coston2 Testnet (Chain ID: 114)
- **Verification Fee**: 0.001 C2FLR per request

### Web3 Features
- Automatic network switching to Coston2
- Gas estimation and optimization
- Event listening for transaction confirmations
- Error handling with user-friendly messages

### Security
- All verification happens on-chain via Flare FDC
- No centralized servers or databases
- Cryptographic proof validation
- Immutable blockchain records

## 🔗 External Resources

- **Coston2 Explorer**: [coston2-explorer.flare.network](https://coston2-explorer.flare.network)
- **C2FLR Faucet**: [faucet.flare.network/coston2](https://faucet.flare.network/coston2)
- **FDC Documentation**: [dev.flare.network/fdc](https://dev.flare.network/fdc/)
- **Twitter ID Lookup**: [tweeterid.com](https://tweeterid.com/)

## 📂 File Structure

```
frontend/
├── index.html          # Main HTML structure
├── style.css           # Modern CSS styling
├── app.js              # Web3 application logic
├── contract-abi.js     # Smart contract ABI and config
└── README.md           # This file
```

## 🐛 Troubleshooting

### Common Issues

**"MetaMask not detected"**
- Install MetaMask browser extension
- Refresh the page after installation

**"Wrong network"**
- The app will automatically prompt to switch to Coston2
- Manually add Coston2 if needed (Chain ID: 114)

**"Insufficient funds"**
- Get C2FLR from the [faucet](https://faucet.flare.network/coston2)
- Need at least 0.001 C2FLR for verification

**"Transaction failed"**
- Check if your tweet contains the exact wallet address
- Ensure the tweet URL is correct
- Try increasing gas limit in MetaMask

**"Twitter ID not found"**
- Verify your Twitter handle is correct
- Remove the "@" symbol when entering the handle
- Make sure your Twitter account is public

### Browser Compatibility

- ✅ Chrome/Chromium browsers
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Requires MetaMask extension

## 🎨 Customization

### Styling
Edit `style.css` to customize:
- Color schemes
- Animation speeds
- Layout spacing
- Responsive breakpoints

### Functionality
Modify `app.js` to:
- Add new verification methods
- Integrate with different APIs
- Customize error handling
- Add analytics tracking

## 📄 License

This project is part of the Flare Twitter Verification DApp. See the main project for license details.

---

**Built with ❤️ for the Flare Network ecosystem** 