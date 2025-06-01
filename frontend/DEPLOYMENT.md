# Flare Twitter Verification DApp - Vercel Deployment

## 🚀 Quick Deploy to Vercel

### Method 1: Direct Deployment (Recommended)

1. **Visit Vercel Dashboard**: Go to [vercel.com](https://vercel.com) and sign in
2. **Import Project**: Click "New Project" → "Import Git Repository"  
3. **Connect Repository**: If using Git, connect your repository
4. **Configure Project**:
   - Framework Preset: **Other**
   - Root Directory: **frontend** (if deploying from subdirectory)
   - Build Command: Leave empty (static files)
   - Output Directory: **.**
5. **Deploy**: Click "Deploy" and wait for completion

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**:
   ```bash
   cd frontend
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: **flare-twitter-verification**
   - In which directory is your code located? **./**

## 🔧 Configuration

### Environment Variables (if needed)
No environment variables are needed for this static frontend.

### Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to "Domains" 
3. Add your custom domain

## 📱 Post-Deployment

After successful deployment, you'll get a URL like:
```
https://flare-twitter-verification-xyz.vercel.app
```

### Test the deployment:
1. ✅ **UI Loading**: Check if the interface loads correctly
2. ✅ **MetaMask Connection**: Test wallet connection (requires HTTPS)
3. ✅ **Contract Interaction**: Test smart contract functions
4. ✅ **Responsive Design**: Test on mobile and desktop
5. ✅ **Copy Functions**: Test tweet copying functionality

## 🔄 Automatic Deployments

If connected to Git:
- **Production**: Deploys automatically from `main` branch
- **Preview**: Deploys automatically from other branches
- **Instant**: Changes are live within seconds

## 🛠️ Troubleshooting

### Common Issues:

**Build Errors:**
- Ensure all files are in the correct directory
- Check that `index.html` exists in root

**MetaMask Not Working:**
- Verify the site is served over HTTPS (Vercel provides this automatically)
- Check browser console for errors

**Contract Interactions Failing:**
- Verify contract address in `contract-abi.js`
- Ensure user is on Coston2 testnet
- Check if user has sufficient C2FLR balance

## 📊 Performance

Your DApp will benefit from Vercel's:
- ⚡ **Global CDN**: Fast loading worldwide
- 🔒 **Automatic HTTPS**: Required for Web3
- 📱 **Edge Functions**: For any dynamic needs
- 📈 **Analytics**: Monitor usage and performance

## 🔗 Important URLs

After deployment, update these if needed:
- **Contract Explorer**: https://coston2-explorer.flare.network/address/0xC14d5D0e0f16036F54842E212e65E62aA46170bF
- **DA Layer API**: https://ctn2-data-availability.flare.network/api-doc#/
- **Faucet**: https://faucet.flare.network/coston2 