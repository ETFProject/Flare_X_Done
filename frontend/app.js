// Global state
let currentStep = 1;
let selectedMethod = 'tweet';
let web3Provider = null;
let contract = null;
let userAccount = null;
let verificationRequestId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Flare Twitter Verification DApp loaded');
    
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connectWallet();
        }
    } else {
        alert('Please install MetaMask to use this application!');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Update network status
    updateNetworkStatus();
});

// Setup event listeners
function setupEventListeners() {
    // Connect wallet button
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    
    // Start verification button
    document.getElementById('startVerification').addEventListener('click', startVerification);
    
    // Account change handler
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
    }
}

// Connect wallet
async function connectWallet() {
    try {
        console.log('Connecting to MetaMask...');
        
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }
        
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        userAccount = accounts[0];
        console.log('Connected account:', userAccount);
        
        // Initialize ethers provider
        web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Check and switch to Coston2 network
        await switchToCoston2();
        
        // Initialize contract
        contract = new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_ABI, web3Provider.getSigner());
        
        // Update UI
        document.getElementById('walletAddress').value = userAccount;
        document.getElementById('connectWallet').innerHTML = '<i class="fas fa-check"></i> Connected';
        document.getElementById('connectWallet').style.background = '#4CAF50';
        
        // Update tweet content
        updateTweetContent();
        
        // Check if user is already verified
        await checkVerificationStatus();
        
        console.log('✅ Wallet connected successfully');
        
    } catch (error) {
        console.error('❌ Error connecting wallet:', error);
        
        if (error.code === 4001) {
            alert('Please connect your wallet to continue');
        } else {
            alert('Error connecting wallet: ' + error.message);
        }
    }
}

// Switch to Coston2 network
async function switchToCoston2() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + CONTRACT_CONFIG.network.chainId.toString(16) }]
        });
    } catch (switchError) {
        // Network doesn't exist, add it
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x' + CONTRACT_CONFIG.network.chainId.toString(16),
                        chainName: CONTRACT_CONFIG.network.name,
                        rpcUrls: [CONTRACT_CONFIG.network.rpcUrl],
                        nativeCurrency: CONTRACT_CONFIG.network.currency,
                        blockExplorerUrls: [CONTRACT_CONFIG.network.explorerUrl]
                    }]
                });
            } catch (addError) {
                throw new Error('Failed to add Coston2 network');
            }
        } else {
            throw switchError;
        }
    }
}

// Check verification status
async function checkVerificationStatus() {
    if (!contract || !userAccount) return;
    
    try {
        const isVerified = await contract.isUserVerified(userAccount);
        
        if (isVerified) {
            const twitterId = await contract.getUserTwitterId(userAccount);
            console.log('✅ User is already verified with Twitter ID:', twitterId);
            
            // Show completion step
            showCompletionStep(twitterId);
        }
    } catch (error) {
        console.error('Error checking verification status:', error);
    }
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected
        userAccount = null;
        web3Provider = null;
        contract = null;
        
        document.getElementById('walletAddress').value = '';
        document.getElementById('connectWallet').innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
        document.getElementById('connectWallet').style.background = '';
        
        console.log('Wallet disconnected');
    } else {
        // Account changed
        userAccount = accounts[0];
        document.getElementById('walletAddress').value = userAccount;
        updateTweetContent();
        checkVerificationStatus();
        
        console.log('Account changed to:', userAccount);
    }
}

// Handle chain changes
function handleChainChanged(chainId) {
    // Reload the page when chain changes
    window.location.reload();
}

// Select verification method
function selectMethod(method) {
    selectedMethod = method;
    
    // Update UI
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    event.target.closest('.method-card').classList.add('selected');
    
    // Enable next step
    setTimeout(() => {
        goToStep(2);
    }, 500);
}

// Update tweet content with wallet address
function updateTweetContent() {
    if (userAccount) {
        const tweetText = `Verifying my wallet ${userAccount} on Flare Network #FlareNetwork #Web3Verification`;
        document.getElementById('tweetContent').textContent = tweetText;
        
        const bioCode = `flare-verify:${userAccount}`;
        document.getElementById('bioCode').textContent = bioCode;
        
        // Update Twitter intent URL
        const twitterBtn = document.querySelector('.twitter-btn');
        if (twitterBtn) {
            const encodedTweet = encodeURIComponent(tweetText);
            twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodedTweet}`;
        }
    }
}

// Copy tweet to clipboard
function copyTweet() {
    const tweetContent = document.getElementById('tweetContent').textContent;
    navigator.clipboard.writeText(tweetContent).then(() => {
        showNotification('Tweet copied to clipboard!', 'success');
    });
}

// Copy bio code to clipboard
function copyBioCode() {
    const bioCode = document.getElementById('bioCode').textContent;
    navigator.clipboard.writeText(bioCode).then(() => {
        showNotification('Bio code copied to clipboard!', 'success');
    });
}

// Start verification process
async function startVerification() {
    if (!contract || !userAccount) {
        alert('Please connect your wallet first');
        return;
    }
    
    try {
        let tweetId, twitterHandle;
        
        if (selectedMethod === 'tweet') {
            const tweetUrl = document.getElementById('tweetUrl').value.trim();
            twitterHandle = document.getElementById('twitterHandle').value.trim();
            
            if (!tweetUrl || !twitterHandle) {
                alert('Please fill in all fields');
                return;
            }
            
            // Extract tweet ID from URL
            tweetId = extractTweetId(tweetUrl);
            if (!tweetId) {
                alert('Invalid tweet URL. Please use format: https://twitter.com/username/status/1234567890');
                return;
            }
        } else {
            // Bio method
            twitterHandle = document.getElementById('twitterHandleBio').value.trim();
            if (!twitterHandle) {
                alert('Please enter your Twitter handle');
                return;
            }
            
            // For bio method, we'll need to create a special tweet or use a different approach
            alert('Bio verification is not implemented yet. Please use Tweet Verification.');
            return;
        }
        
        // Clean twitter handle
        twitterHandle = twitterHandle.replace('@', '');
        
        // Get Twitter user ID
        const twitterUserId = await getTwitterUserId(twitterHandle);
        if (!twitterUserId) {
            alert(`Could not find Twitter user ID for @${twitterHandle}. Please check the handle and try again.`);
            return;
        }
        
        console.log('Starting verification with:', { tweetId, twitterUserId, twitterHandle });
        
        // Go to processing step
        goToStep(3);
        
        // Submit verification request
        await submitVerificationRequest(tweetId, twitterUserId, twitterHandle);
        
    } catch (error) {
        console.error('Error starting verification:', error);
        showNotification('Error starting verification: ' + error.message, 'error');
    }
}

// Extract tweet ID from URL
function extractTweetId(url) {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
}

// Get Twitter user ID (simplified version - in production you'd use Twitter API)
async function getTwitterUserId(handle) {
    // For demo purposes, we'll generate a mock ID
    // In production, you'd integrate with Twitter API or use a service like tweeterid.com
    
    // Simple hash function to generate consistent "user ID" for demo
    let hash = 0;
    for (let i = 0; i < handle.length; i++) {
        const char = handle.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Return a positive integer as string
    return Math.abs(hash).toString();
}

// Submit verification request to smart contract
async function submitVerificationRequest(tweetId, expectedTwitterId, twitterHandle) {
    try {
        updateProcessStep('step-submit', 'processing');
        
        console.log('Submitting verification request...');
        console.log('Tweet ID:', tweetId);
        console.log('Expected Twitter ID:', expectedTwitterId);
        
        // Estimate gas
        const gasEstimate = await contract.estimateGas.requestVerification(
            tweetId,
            expectedTwitterId,
            { value: ethers.utils.parseEther('0.001') }
        );
        
        console.log('Gas estimate:', gasEstimate.toString());
        
        // Submit transaction
        const tx = await contract.requestVerification(
            tweetId,
            expectedTwitterId,
            { 
                value: ethers.utils.parseEther('0.001'),
                gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
            }
        );
        
        console.log('Transaction submitted:', tx.hash);
        
        // Update UI with transaction info
        document.getElementById('txHash').textContent = tx.hash;
        document.getElementById('explorerLink').href = `${CONTRACT_CONFIG.network.explorerUrl}/tx/${tx.hash}`;
        document.getElementById('transactionInfo').style.display = 'block';
        
        updateProcessStep('step-submit', 'completed');
        updateProcessStep('step-fdc', 'processing');
        
        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        
        // Parse events to get request ID
        const event = receipt.events?.find(e => e.event === 'VerificationRequested');
        if (event) {
            verificationRequestId = event.args.requestId;
            document.getElementById('requestId').textContent = verificationRequestId;
            
            console.log('Verification request ID:', verificationRequestId);
        }
        
        updateProcessStep('step-fdc', 'completed');
        updateProcessStep('step-proof', 'processing');
        
        // Simulate FDC processing (in real app, you'd poll the DA Layer API)
        await simulateFDCProcessing(twitterHandle, expectedTwitterId);
        
    } catch (error) {
        console.error('Error submitting verification:', error);
        updateProcessStep('step-submit', 'error');
        
        if (error.code === 4001) {
            showNotification('Transaction cancelled by user', 'error');
        } else if (error.message.includes('insufficient funds')) {
            showNotification('Insufficient funds. You need at least 0.001 C2FLR for verification.', 'error');
        } else {
            showNotification('Error submitting verification: ' + error.message, 'error');
        }
    }
}

// Simulate FDC processing (for demo purposes)
async function simulateFDCProcessing(twitterHandle, twitterId) {
    try {
        // Wait a bit to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        updateProcessStep('step-proof', 'completed');
        updateProcessStep('step-complete', 'processing');
        
        // Wait a bit more
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        updateProcessStep('step-complete', 'completed');
        
        console.log('✅ FDC processing simulation completed');
        
        // Show success
        showCompletionStep(twitterId, twitterHandle);
        
    } catch (error) {
        console.error('Error in FDC simulation:', error);
        updateProcessStep('step-proof', 'error');
    }
}

// Update processing step status
function updateProcessStep(stepId, status) {
    const step = document.getElementById(stepId);
    if (!step) return;
    
    const statusElement = step.querySelector('.step-status');
    statusElement.className = `step-status ${status}`;
    
    // Update icon color
    const icon = step.querySelector('i');
    if (status === 'completed') {
        icon.style.color = '#4CAF50';
    } else if (status === 'processing') {
        icon.style.color = '#1DA1F2';
    } else if (status === 'error') {
        icon.style.color = '#f44336';
    }
}

// Show completion step
function showCompletionStep(twitterId, twitterHandle = null) {
    // Update verification details
    document.getElementById('verifiedWallet').textContent = userAccount;
    document.getElementById('verifiedTwitter').textContent = twitterHandle ? `@${twitterHandle}` : 'Verified Account';
    document.getElementById('verifiedTwitterId').textContent = twitterId;
    document.getElementById('verificationTime').textContent = new Date().toLocaleString();
    
    // Update blockchain links
    document.getElementById('contractLink').href = `${CONTRACT_CONFIG.network.explorerUrl}/address/${CONTRACT_CONFIG.address}`;
    
    if (verificationRequestId) {
        document.getElementById('transactionLink').href = `${CONTRACT_CONFIG.network.explorerUrl}/tx/${document.getElementById('txHash').textContent}`;
    }
    
    // Go to completion step
    goToStep(4);
}

// Test restricted function
async function testRestrictedFunction() {
    if (!contract) {
        alert('Please connect your wallet first');
        return;
    }
    
    try {
        const result = await contract.restrictedFunction();
        alert('✅ Restricted function result: ' + result);
    } catch (error) {
        console.error('Error calling restricted function:', error);
        alert('❌ Error: ' + error.message);
    }
}

// Restart verification process
function restartVerification() {
    // Reset state
    currentStep = 1;
    selectedMethod = 'tweet';
    verificationRequestId = null;
    
    // Clear form fields
    document.getElementById('tweetUrl').value = '';
    document.getElementById('twitterHandle').value = '';
    document.getElementById('twitterHandleBio').value = '';
    
    // Reset method selection
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset process steps
    document.querySelectorAll('.process-step .step-status').forEach(status => {
        status.className = 'step-status pending';
    });
    
    document.querySelectorAll('.process-step i').forEach(icon => {
        icon.style.color = '#666';
    });
    
    // Go back to step 1
    goToStep(1);
    
    console.log('Verification process restarted');
}

// Navigate to specific step
function goToStep(step) {
    // Hide all step contents
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show current step content
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update progress steps
    document.querySelectorAll('.progress-steps .step').forEach((stepElement, index) => {
        stepElement.classList.remove('active', 'completed');
        
        if (index + 1 === step) {
            stepElement.classList.add('active');
        } else if (index + 1 < step) {
            stepElement.classList.add('completed');
        }
    });
    
    // Update verification method visibility
    if (step === 2) {
        document.getElementById('tweetMethod').style.display = selectedMethod === 'tweet' ? 'block' : 'none';
        document.getElementById('bioMethod').style.display = selectedMethod === 'bio' ? 'block' : 'none';
    }
    
    currentStep = step;
    console.log('Navigated to step:', step);
}

// Update network status
function updateNetworkStatus() {
    const networkName = document.getElementById('networkName');
    const networkIndicator = document.getElementById('networkIndicator');
    
    if (networkName) {
        networkName.textContent = CONTRACT_CONFIG.network.name;
    }
    
    if (networkIndicator) {
        networkIndicator.style.background = '#4CAF50'; // Green for connected
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInDown 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideOutUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(style);

console.log('🎯 Flare Twitter Verification DApp ready!'); 