// Global state
let currentStep = 1;
let selectedMethod = 'tweet';
let userAccount = null;
let verificationRequestId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Flare Twitter Verification DApp loaded');
    
    // Setup event listeners
    setupEventListeners();
    
    // Update network status
    updateNetworkStatus();
    
    console.log('🎯 App initialization complete');
});

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Wallet address input validation
    const walletInput = document.getElementById('walletAddress');
    if (walletInput) {
        walletInput.addEventListener('input', validateWalletAddress);
        walletInput.addEventListener('blur', validateWalletAddress);
    }
    
    // Start verification button
    const startButton = document.getElementById('startVerification');
    if (startButton) {
        console.log('✅ Found startVerification button');
        startButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔘 Start verification clicked');
            startVerification();
        });
    } else {
        console.warn('⚠️ Start verification button not found');
    }
    
    console.log('✅ Event listeners setup complete');
}

// Validate wallet address
function validateWalletAddress() {
    const walletInput = document.getElementById('walletAddress');
    const address = walletInput.value.trim();
    
    if (address === '') {
        walletInput.style.borderColor = '#e0e0e0';
        userAccount = null;
        return false;
    }
    
    // Check if it's a valid Ethereum address format
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
    
    if (isValid) {
        walletInput.style.borderColor = '#4CAF50';
        userAccount = address;
        updateTweetContent();
        return true;
    } else {
        walletInput.style.borderColor = '#f44336';
        userAccount = null;
        return false;
    }
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
    if (!userAccount) {
        showNotification('Please enter a valid wallet address first to start verification', 'warning');
        // Scroll to top to show wallet connection
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    try {
        let tweetId, twitterHandle;
        
        if (selectedMethod === 'tweet') {
            const tweetUrl = document.getElementById('tweetUrl').value.trim();
            twitterHandle = document.getElementById('twitterHandle').value.trim();
            
            if (!tweetUrl || !twitterHandle) {
                showNotification('Please fill in all fields', 'warning');
                return;
            }
            
            // Extract tweet ID from URL
            tweetId = extractTweetId(tweetUrl);
            if (!tweetId) {
                showNotification('Invalid tweet URL. Please use format: https://twitter.com/username/status/1234567890', 'error');
                return;
            }
        } else {
            // Bio method
            twitterHandle = document.getElementById('twitterHandleBio').value.trim();
            if (!twitterHandle) {
                showNotification('Please enter your Twitter handle', 'warning');
                return;
            }
            
            // For bio method, we'll need to create a special tweet or use a different approach
            showNotification('Bio verification is not implemented yet. Please use Tweet Verification.', 'info');
            return;
        }
        
        // Clean twitter handle
        twitterHandle = twitterHandle.replace('@', '');
        
        // Get Twitter user ID
        const twitterUserId = await getTwitterUserId(twitterHandle);
        if (!twitterUserId) {
            showNotification(`Could not find Twitter user ID for @${twitterHandle}. Please check the handle and try again.`, 'error');
            return;
        }
        
        console.log('Starting verification with:', { tweetId, twitterUserId, twitterHandle, walletAddress: userAccount });
        
        // Go to processing step
        goToStep(3);
        
        // Simulate verification process
        await simulateVerificationProcess(tweetId, twitterUserId, twitterHandle);
        
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

// Simulate verification process (for demo purposes)
async function simulateVerificationProcess(tweetId, expectedTwitterId, twitterHandle) {
    try {
        updateProcessStep('step-submit', 'processing');
        
        console.log('Simulating verification request...');
        console.log('Tweet ID:', tweetId);
        console.log('Expected Twitter ID:', expectedTwitterId);
        console.log('Wallet Address:', userAccount);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock transaction hash
        const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
        const mockRequestId = Math.floor(Math.random() * 1000000);
        
        // Update UI with mock transaction info
        document.getElementById('txHash').textContent = mockTxHash;
        document.getElementById('requestId').textContent = mockRequestId;
        document.getElementById('explorerLink').href = `https://coston2-explorer.flare.network/tx/${mockTxHash}`;
        document.getElementById('transactionInfo').style.display = 'block';
        
        updateProcessStep('step-submit', 'completed');
        updateProcessStep('step-fdc', 'processing');
        
        // Simulate FDC processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        updateProcessStep('step-fdc', 'completed');
        updateProcessStep('step-proof', 'processing');
        
        // Simulate proof generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        updateProcessStep('step-proof', 'completed');
        updateProcessStep('step-complete', 'processing');
        
        // Wait a bit more
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updateProcessStep('step-complete', 'completed');
        
        console.log('✅ Verification simulation completed');
        
        // Show success
        showCompletionStep(expectedTwitterId, twitterHandle);
        
    } catch (error) {
        console.error('Error in verification simulation:', error);
        updateProcessStep('step-submit', 'error');
        showNotification('Verification failed: ' + error.message, 'error');
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
    document.getElementById('contractLink').href = `https://coston2-explorer.flare.network/address/0xC14d5D0e0f16036F54842E212e65E62aA46170bF`;
    
    const txHash = document.getElementById('txHash').textContent;
    if (txHash) {
        document.getElementById('transactionLink').href = `https://coston2-explorer.flare.network/tx/${txHash}`;
    }
    
    // Go to completion step
    goToStep(4);
}

// Test restricted function (demo version)
async function testRestrictedFunction() {
    if (!userAccount) {
        showNotification('Please enter a wallet address first', 'warning');
        return;
    }
    
    try {
        // Simulate checking verification status
        showNotification('🔍 Checking verification status...', 'info');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo, assume user is verified if they completed the flow
        showNotification('✅ Verification confirmed! You have access to restricted functions.', 'success');
        
    } catch (error) {
        console.error('Error testing restricted function:', error);
        showNotification('❌ Error checking verification status', 'error');
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