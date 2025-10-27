// Microlending Platform Frontend JavaScript - CMS ENABLED VERSION

// Application state
let currentUser = null;
let loanProducts = [];
let cmsConfig = {};

// CMS Configuration
const CMS_CONFIG_URL = 'cms/cms-config.json';

// Load CMS Configuration
async function loadCMSConfig() {
    try {
        // Try to load from API first
        const response = await fetch('/api/cms/config');
        if (response.ok) {
            cmsConfig = await response.json();
            console.log('CMS Configuration loaded from API:', cmsConfig);
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.error('Failed to load CMS config from API:', error);
        
        // Fallback 1: Try local storage
        const savedConfig = localStorage.getItem('monei-cms-config');
        if (savedConfig) {
            cmsConfig = JSON.parse(savedConfig);
            console.log('CMS Configuration loaded from localStorage:', cmsConfig);
        } else {
            // Fallback 2: Try static file
            try {
                const staticResponse = await fetch('cms/cms-config.json');
                cmsConfig = await staticResponse.json();
                console.log('CMS Configuration loaded from static file:', cmsConfig);
            } catch (staticError) {
                console.error('Failed to load CMS config from static file:', staticError);
                // Final fallback: Default configuration
                cmsConfig = {
                    currency: { 
                        default: 'BWP', 
                        symbol: 'P', 
                        name: 'Botswana Pula',
                        decimalDigits: 2 
                    },
                    loanProducts: [],
                    websiteContent: {
                        hero: {
                            title: 'Smart Micro-Lending for Botswana Businesses',
                            subtitle: 'Access fast, flexible funding in Botswana Pula (BWP)',
                            buttonText: 'Apply in Minutes'
                        }
                    },
                    settings: {
                        apiBaseUrl: 'https://monei-api.tmugore.workers.dev'
                    }
                };
            }
        }
    }
}
// Currency formatting function using CMS config
function formatCurrency(amount) {
    if (!cmsConfig.currency) {
        return `P ${parseFloat(amount).toFixed(2)}`;
    }
    
    return new Intl.NumberFormat('en-BW', {
        style: 'currency',
        currency: cmsConfig.currency.default,
        minimumFractionDigits: cmsConfig.currency.decimalDigits,
        maximumFractionDigits: cmsConfig.currency.decimalDigits,
    }).format(amount);
}

// API Base URL from CMS config
function getApiBase() {
    return cmsConfig.settings?.apiBaseUrl || 'https://monei-api.tmugore.workers.dev';
}

// Initialize the application with CMS
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Monei Lending Platform initializing with CMS...');
    
    // Load CMS configuration first
    await loadCMSConfig();
    
    // Then initialize the rest of the application
    initializeEventListeners();
    await loadLoanProducts();
    checkAuthStatus();
    
    console.log('Monei Lending Platform initialized with CMS support');
});

// Initialize all event listeners
function initializeEventListeners() {
    // Navigation buttons
    const loginBtn = document.getElementById('login-btn');
    const applicationBtn = document.getElementById('application-btn');
    const calculatorBtn = document.getElementById('calculator-btn');
    
    if (loginBtn) loginBtn.addEventListener('click', showLogin);
    if (applicationBtn) applicationBtn.addEventListener('click', showApplication);
    if (calculatorBtn) calculatorBtn.addEventListener('click', showCalculator);
    
    // Modal close handlers
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.querySelector('.close-modal');
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
}

// Load loan products from CMS configuration
async function loadLoanProducts() {
    try {
        console.log('Loading loan products from CMS...');
        
        if (cmsConfig.loanProducts && cmsConfig.loanProducts.length > 0) {
            // Use active products from CMS
            loanProducts = cmsConfig.loanProducts.filter(product => product.active !== false);
            console.log('Loan products loaded from CMS:', loanProducts.length);
        } else {
            // Fallback to default products
            loanProducts = [
                {
                    id: 1,
                    product_name: 'Micro Loan',
                    product_type: 'microloan',
                    description: 'Small business loans for entrepreneurs',
                    min_amount: 5000,
                    max_amount: 100000,
                    min_interest_rate: 0.08,
                    max_interest_rate: 0.15,
                    min_term_days: 90,
                    max_term_days: 365,
                    origination_fee_rate: 0.02,
                    active: true
                },
                {
                    id: 2,
                    product_name: 'Purchase Order Financing',
                    product_type: 'purchase_order',
                    description: 'Finance your purchase orders',
                    min_amount: 10000,
                    max_amount: 250000,
                    min_interest_rate: 0.1,
                    max_interest_rate: 0.18,
                    min_term_days: 30,
                    max_term_days: 180,
                    origination_fee_rate: 0.03,
                    active: true
                },
                {
                    id: 3,
                    product_name: 'Invoice Discounting',
                    product_type: 'invoice_discount',
                    description: 'Get advance on your invoices',
                    min_amount: 5000,
                    max_amount: 150000,
                    min_interest_rate: 0.12,
                    max_interest_rate: 0.2,
                    min_term_days: 30,
                    max_term_days: 90,
                    origination_fee_rate: 0.025,
                    active: true
                }
            ];
            console.log('Using default loan products');
        }
    } catch (error) {
        console.error('Failed to load loan products:', error);
    }
}

// Check authentication status
function checkAuthStatus() {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            showDashboard();
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('user');
        }
    }
}

// Show login modal
function showLogin() {
    console.log('Showing login modal');
    const loginForm = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Sign In to Your Account</h2>
            <p class="text-gray-600">Access your lending dashboard</p>
        </div>
        
        <form id="loginForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" id="email" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Enter your email">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" id="password" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Enter your password">
            </div>
            
            <div class="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                <p class="font-semibold mb-1">Demo Accounts:</p>
                <p>Borrower: john.doe@example.com / demo123</p>
                <p>Admin: admin@lendingplatform.com / admin123</p>
            </div>
            
            <div class="flex gap-3">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Sign In
                </button>
                <button type="button" onclick="closeModal()" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
        
        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
                Don't have an account? 
                <button onclick="showSignup()" class="text-blue-600 hover:text-blue-800 font-medium">Sign up here</button>
            </p>
        </div>
    `;
    showModal(loginForm);
    
    // Add form submission handler
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    console.log('Handling login...');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Mock authentication
    let userData;
    if (email === 'john.doe@example.com' && password === 'demo123') {
        userData = {
            id: 2,
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            userType: 'borrower'
        };
    } else if (email === 'admin@lendingplatform.com' && password === 'admin123') {
        userData = {
            id: 1,
            email: 'admin@lendingplatform.com',
            firstName: 'Admin',
            lastName: 'User',
            userType: 'admin'
        };
    } else {
        alert('Invalid credentials. Please use the demo accounts provided.');
        return;
    }
    
    localStorage.setItem('user', JSON.stringify(userData));
    currentUser = userData;
    closeModal();
    showDashboard();
}

// Show signup form
function showSignup() {
    const signupForm = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
            <p class="text-gray-600">Join our lending platform</p>
        </div>
        
        <form id="signupForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" id="firstName" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="lastName" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" id="signupEmail" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" id="signupPassword" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex gap-3">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Create Account
                </button>
                <button type="button" onclick="closeModal()" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
        
        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
                Already have an account? 
                <button onclick="showLogin()" class="text-blue-600 hover:text-blue-800 font-medium">Sign in here</button>
            </p>
        </div>
    `;
    showModal(signupForm);
    
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    alert('Signup functionality would be implemented in production. Please use the demo login for now.');
    showLogin();
}

// Show dashboard
function showDashboard() {
    console.log('Showing dashboard for:', currentUser);
    
    // Hide main content and show dashboard
    const mainContent = document.querySelector('.gradient-bg');
    const productsSection = document.querySelector('#products');
    const howItWorksSection = document.querySelector('#how-it-works');
    const dashboardSection = document.getElementById('dashboard');
    
    if (mainContent) mainContent.style.display = 'none';
    if (productsSection) productsSection.style.display = 'none';
    if (howItWorksSection) howItWorksSection.style.display = 'none';
    if (dashboardSection) dashboardSection.classList.remove('hidden');
    
    // Update navigation
    updateNavigation();
    
    // Load dashboard data
    if (currentUser.userType === 'admin') {
        loadAdminDashboard();
    } else {
        loadBorrowerDashboard();
    }
}

// Update navigation based on auth status
function updateNavigation() {
    const navContainer = document.querySelector('nav .hidden.md\\:flex');
    if (navContainer && currentUser) {
        navContainer.innerHTML = `
            <span class="text-gray-600 mr-4">Welcome, ${currentUser.firstName} ${currentUser.lastName}</span>
            <button onclick="showApplication()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mr-2">
                New Application
            </button>
            <button onclick="logout()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Logout
            </button>
        `;
    }
}

// Load borrower dashboard with CMS currency
function loadBorrowerDashboard() {
    console.log('Loading borrower dashboard');
    // Mock data for demonstration
    document.getElementById('totalApps').textContent = '2';
    document.getElementById('activeLoans').textContent = '1';
    document.getElementById('outstandingBalance').textContent = formatCurrency(5250);
    
    document.getElementById('recentApplications').innerHTML = `
        <div class="border-b pb-3 mb-3">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-semibold">Micro Loan</h4>
                    <p class="text-sm text-gray-600">${formatCurrency(10000)}</p>
                    <p class="text-sm text-gray-500">${new Date().toLocaleDateString()}</p>
                </div>
                <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">approved</span>
            </div>
        </div>
    `;
    
    document.getElementById('activeLoansContainer').innerHTML = `
        <div class="border-b pb-3 mb-3">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-semibold">Micro Loan</h4>
                    <p class="text-sm text-gray-600">Balance: ${formatCurrency(5250)}</p>
                    <p class="text-sm text-gray-500">Due: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
                <button onclick="showPaymentSchedule(1)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Payments
                </button>
            </div>
        </div>
    `;
}

// Load admin dashboard with CMS currency
function loadAdminDashboard() {
    console.log('Loading admin dashboard');
    // Mock data for demonstration
    document.getElementById('totalApps').textContent = '15';
    document.getElementById('activeLoans').textContent = '8';
    document.getElementById('outstandingBalance').textContent = formatCurrency(127500);
    
    document.getElementById('recentApplications').innerHTML = `
        <div class="border-b pb-3 mb-3">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-semibold">Jane Smith</h4>
                    <p class="text-sm text-gray-600">Micro Loan - ${formatCurrency(15000)}</p>
                    <p class="text-sm text-gray-500">${new Date().toLocaleDateString()}</p>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">under_review</span>
                    <button onclick="reviewApplication(1)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Review
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Get status color class
function getStatusColor(status) {
    const colors = {
        'draft': 'bg-gray-100 text-gray-800',
        'submitted': 'bg-blue-100 text-blue-800',
        'under_review': 'bg-yellow-100 text-yellow-800',
        'approved': 'bg-green-100 text-green-800',
        'rejected': 'bg-red-100 text-red-800',
        'funded': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

// Show application form with CMS currency
function showApplication() {
    console.log('Showing application form');
    if (!currentUser) {
        showLogin();
        return;
    }
    
    const currencySymbol = cmsConfig.currency?.symbol || 'P';
    const currencyCode = cmsConfig.currency?.default || 'BWP';
    
    const applicationForm = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Loan Application</h2>
            <p class="text-gray-600">Complete your loan application in ${currencyCode}</p>
        </div>
        
        <form id="applicationForm" class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Loan Product</label>
                <select id="productSelect" required 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a loan product</option>
                    ${loanProducts.map(product => 
                        `<option value="${product.id}">${product.product_name} (${product.product_type})</option>`
                    ).join('')}
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Requested Amount (${currencyCode})</label>
                <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">${currencySymbol}</span>
                    <input type="number" id="requestedAmount" required 
                           class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="0.00" min="5000" max="250000">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Purpose of Loan</label>
                <textarea id="purpose" required rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe how you plan to use the loan funds..."></textarea>
            </div>
            
            <div class="flex gap-3 pt-4">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Submit Application
                </button>
                <button type="button" onclick="closeModal()" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    `;
    showModal(applicationForm);
    
    document.getElementById('applicationForm').addEventListener('submit', handleApplication);
    document.getElementById('productSelect').addEventListener('change', updateProductInfo);
}

// Update product information display with CMS formatting
function updateProductInfo() {
    const productSelect = document.getElementById('productSelect');
    const selectedProductId = productSelect.value;
    
    if (!selectedProductId) return;
    
    const product = loanProducts.find(p => p.id == selectedProductId);
    if (!product) return;
    
    // Show product information
    const productInfo = document.getElementById('productInfo') || createProductInfoElement();
    productInfo.innerHTML = `
        <h4 class="font-semibold text-gray-800 mb-2">${product.product_name}</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
                <span class="font-medium">Amount Range:</span> 
                ${formatCurrency(product.min_amount)} - ${formatCurrency(product.max_amount)}
            </div>
            <div>
                <span class="font-medium">Interest Rate:</span> 
                ${(product.min_interest_rate * 100).toFixed(1)}% - ${(product.max_interest_rate * 100).toFixed(1)}%
            </div>
        </div>
        <p class="text-sm text-gray-600 mt-2">${product.description}</p>
    `;
    productInfo.classList.remove('hidden');
}

function createProductInfoElement() {
    const productInfo = document.createElement('div');
    productInfo.id = 'productInfo';
    productInfo.className = 'bg-blue-50 p-4 rounded-lg';
    document.getElementById('productSelect').parentNode.insertBefore(productInfo, document.getElementById('productSelect').nextSibling);
    return productInfo;
}

// Handle application submission
async function handleApplication(event) {
    event.preventDefault();
    console.log('Handling application submission');
    
    const productId = document.getElementById('productSelect').value;
    const requestedAmount = document.getElementById('requestedAmount').value;
    const purpose = document.getElementById('purpose').value;
    
    const product = loanProducts.find(p => p.id == productId);
    if (!product) {
        alert('Please select a valid loan product');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Mock submission
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        closeModal();
        alert(`Application submitted successfully for ${formatCurrency(requestedAmount)}! We will review your application and get back to you soon.`);
        
        // Reset form
        event.target.reset();
        const productInfo = document.getElementById('productInfo');
        if (productInfo) productInfo.classList.add('hidden');
    }, 2000);
}

// Apply for specific product (called from product cards)
function applyForProduct(productType) {
    console.log('Applying for product:', productType);
    if (!currentUser) {
        showLogin();
        return;
    }
    
    showApplication();
    
    // Pre-select the product type after a short delay
    setTimeout(() => {
        const productSelect = document.getElementById('productSelect');
        const product = loanProducts.find(p => p.product_type === productType);
        if (product && productSelect) {
            productSelect.value = product.id;
            updateProductInfo();
        }
    }, 100);
}

// Show payment calculator with CMS currency
function showCalculator() {
    console.log('Showing calculator');
    const currencySymbol = cmsConfig.currency?.symbol || 'P';
    const currencyCode = cmsConfig.currency?.default || 'BWP';
    
    const calculatorForm = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Payment Calculator</h2>
            <p class="text-gray-600">Estimate your loan payments in ${currencyCode}</p>
        </div>
        
        <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Loan Amount (${currencyCode})</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2 text-gray-500">${currencySymbol}</span>
                        <input type="number" id="calcAmount" value="25000"
                               class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                    <input type="number" id="calcRate" value="15" step="0.1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Term (days)</label>
                    <input type="number" id="calcTerm" value="365"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                        <p class="text-sm text-gray-600">Monthly Payment</p>
                        <p class="text-2xl font-bold text-blue-600" id="monthlyPayment">${formatCurrency(0)}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm text-gray-600">Total Interest</p>
                        <p class="text-2xl font-bold text-green-600" id="totalInterest">${formatCurrency(0)}</p>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <p class="text-sm text-gray-600">Total Amount to Repay</p>
                    <p class="text-3xl font-bold text-blue-600" id="totalAmount">${formatCurrency(0)}</p>
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="closeModal()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Close
                </button>
            </div>
        </div>
    `;
    showModal(calculatorForm);
    
    // Add event listeners for calculator
    document.getElementById('calcAmount').addEventListener('input', calculatePayment);
    document.getElementById('calcRate').addEventListener('input', calculatePayment);
    document.getElementById('calcTerm').addEventListener('input', calculatePayment);
    
    calculatePayment();
}

// Calculate loan payment with CMS formatting
function calculatePayment() {
    const amount = parseFloat(document.getElementById('calcAmount').value) || 0;
    const rate = parseFloat(document.getElementById('calcRate').value) || 0;
    const termDays = parseFloat(document.getElementById('calcTerm').value) || 0;
    
    if (amount <= 0 || rate <= 0 || termDays <= 0) {
        document.getElementById('monthlyPayment').textContent = formatCurrency(0);
        document.getElementById('totalInterest').textContent = formatCurrency(0);
        document.getElementById('totalAmount').textContent = formatCurrency(0);
        return;
    }
    
    // Simple interest calculation
    const totalInterest = (amount * (rate / 100) * (termDays / 365));
    const totalAmount = amount + totalInterest;
    const monthlyPayment = totalAmount / (termDays / 30);
    
    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
}

// Show payment schedule for a loan with CMS currency
function showPaymentSchedule(loanId) {
    console.log('Showing payment schedule for loan:', loanId);
    // Mock payment schedule
    const scheduleHtml = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Payment Schedule</h2>
            <p class="text-gray-600">Loan ID: ${loanId}</p>
        </div>
        
        <div class="space-y-3 max-h-96 overflow-y-auto">
            <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <div>
                    <p class="font-semibold">Payment #1</p>
                    <p class="text-sm text-gray-600">Due: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold">${formatCurrency(1750)}</p>
                    <p class="text-sm text-gray-600">pending</p>
                </div>
            </div>
            <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <div>
                    <p class="font-semibold">Payment #2</p>
                    <p class="text-sm text-gray-600">Due: ${new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold">${formatCurrency(1750)}</p>
                    <p class="text-sm text-gray-600">pending</p>
                </div>
            </div>
            <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <div>
                    <p class="font-semibold">Payment #3</p>
                    <p class="text-sm text-gray-600">Due: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold">${formatCurrency(1750)}</p>
                    <p class="text-sm text-gray-600">pending</p>
                </div>
            </div>
        </div>
        
        <div class="text-center mt-6">
            <button onclick="closeModal()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal(scheduleHtml);
}

// Admin: Review application with CMS currency
function reviewApplication(applicationId) {
    console.log('Reviewing application:', applicationId);
    const reviewForm = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Review Application</h2>
            <p class="text-gray-600">Application ID: ${applicationId}</p>
        </div>
        
        <div class="space-y-4 mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">Application Details</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div><span class="font-medium">Amount:</span> ${formatCurrency(15000)}</div>
                    <div><span class="font-medium">Product:</span> Micro Loan</div>
                    <div><span class="font-medium">Status:</span> under_review</div>
                    <div><span class="font-medium">Submitted:</span> ${new Date().toLocaleDateString()}</div>
                </div>
                <div class="mt-2">
                    <span class="font-medium">Purpose:</span> Business expansion and equipment purchase
                </div>
            </div>
        </div>
        
        <form id="reviewForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                <select id="reviewStatus" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select decision</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                </select>
            </div>
            
            <div class="flex gap-3">
                <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Submit Review
                </button>
                <button type="button" onclick="closeModal()" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    `;
    showModal(reviewForm);
    
    document.getElementById('reviewForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const status = document.getElementById('reviewStatus').value;
        alert(`Application ${status} successfully!`);
        closeModal();
    });
}

// Logout function
function logout() {
    console.log('Logging out');
    localStorage.removeItem('user');
    currentUser = null;
    
    // Show main content and hide dashboard
    const mainContent = document.querySelector('.gradient-bg');
    const productsSection = document.querySelector('#products');
    const howItWorksSection = document.querySelector('#how-it-works');
    const dashboardSection = document.getElementById('dashboard');
    
    if (mainContent) mainContent.style.display = 'block';
    if (productsSection) productsSection.style.display = 'block';
    if (howItWorksSection) howItWorksSection.style.display = 'block';
    if (dashboardSection) dashboardSection.classList.add('hidden');
    
    // Reset navigation
    const navContainer = document.querySelector('nav .hidden.md\\:flex');
    if (navContainer) {
        navContainer.innerHTML = `
            <a href="#" class="text-gray-600 hover:text-blue-600 font-medium">Home</a>
            <a href="#products" class="text-gray-600 hover:text-blue-600 font-medium">Products</a>
            <a href="#how-it-works" class="text-gray-600 hover:text-blue-600 font-medium">How It Works</a>
            <a href="#about" class="text-gray-600 hover:text-blue-600 font-medium">About</a>
            <button onclick="showLogin()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Sign In
            </button>
        `;
    }
    
    alert('Logged out successfully');
}

// Modal functions
function showModal(content) {
    const modalContent = document.getElementById('modal-content');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (modalContent && modalOverlay) {
        modalContent.innerHTML = content;
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Modal elements not found in DOM');
        // Fallback: use alert for critical functionality
        alert('Modal system not available. Please refresh the page.');
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Export functions to global scope for HTML onclick handlers
window.showLogin = showLogin;
window.showSignup = showSignup;
window.showApplication = showApplication;
window.applyForProduct = applyForProduct;
window.showCalculator = showCalculator;
window.calculatePayment = calculatePayment;
window.showPaymentSchedule = showPaymentSchedule;
window.reviewApplication = reviewApplication;
window.logout = logout;
window.closeModal = closeModal;
window.formatCurrency = formatCurrency; // Export for use in HTML

console.log('Monei Lending Platform JavaScript loaded successfully - CMS Enabled');