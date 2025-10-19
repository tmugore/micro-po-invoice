// Microlending Platform Frontend JavaScript

// Application state
let currentUser = null;
let loanProducts = [];

// API Base URL
const API_BASE = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadLoanProducts();
    checkAuthStatus();
});

// Load loan products
async function loadLoanProducts() {
    try {
        const response = await axios.get(`${API_BASE}/api/loan-products`);
        if (response.data.success) {
            loanProducts = response.data.products;
        }
    } catch (error) {
        console.error('Failed to load loan products:', error);
    }
}

// Check authentication status
function checkAuthStatus() {
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
        showDashboard();
    }
}

// Mock login function (in production, implement proper authentication)
function showLogin() {
    const loginForm = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Sign In to Your Account</h2>
            <p class="text-gray-600">Access your lending dashboard</p>
        </div>
        
        <form onsubmit="handleLogin(event)" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" id="email" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                       placeholder="Enter your email">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" id="password" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                       placeholder="Enter your password">
            </div>
            
            <div class="text-sm text-gray-600">
                <p><strong>Demo Accounts:</strong></p>
                <p>Borrower: john.doe@example.com / demo123</p>
                <p>Admin: admin@lendingplatform.com / admin123</p>
            </div>
            
            <div class="flex gap-3">
                <button type="submit" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
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
                <button onclick="showSignup()" class="text-purple-600 hover:text-purple-800 font-medium">Sign up here</button>
            </p>
        </div>
    `;
    showModal(loginForm);
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Mock authentication - in production, validate against backend
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
        
        <form onsubmit="handleSignup(event)" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" id="firstName" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="lastName" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" id="email" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" id="password" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>
            
            <div class="flex gap-3">
                <button type="submit" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
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
                <button onclick="showLogin()" class="text-purple-600 hover:text-purple-800 font-medium">Sign in here</button>
            </p>
        </div>
    `;
    showModal(signupForm);
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    alert('Signup functionality would be implemented in production. Please use the demo login for now.');
    showLogin();
}

// Show dashboard
async function showDashboard() {
    // Hide main content and show dashboard
    document.querySelector('.gradient-bg').style.display = 'none';
    document.querySelector('#products').style.display = 'none';
    document.querySelector('#how-it-works').style.display = 'none';
    document.getElementById('dashboard').classList.remove('hidden');
    
    // Update navigation
    const nav = document.querySelector('nav .hidden');
    if (nav) {
        nav.innerHTML = `
            <span class="text-gray-600">Welcome, ${currentUser.firstName} ${currentUser.lastName}</span>
            <button onclick="showApplication()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                New Application
            </button>
        `;
    }
    
    // Load dashboard data
    if (currentUser.userType === 'admin') {
        await loadAdminDashboard();
    } else {
        await loadBorrowerDashboard();
    }
}

// Load borrower dashboard
async function loadBorrowerDashboard() {
    try {
        // Load applications
        const appsResponse = await axios.get(`${API_BASE}/api/applications/${currentUser.id}`);
        if (appsResponse.data.success) {
            const applications = appsResponse.data.applications;
            document.getElementById('totalApps').textContent = applications.length;
            
            // Display recent applications
            const recentApps = applications.slice(0, 5);
            const appsHtml = recentApps.map(app => `
                <div class="border-b pb-3 mb-3 last:border-b-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-semibold">${app.product_name}</h4>
                            <p class="text-sm text-gray-600">$${parseFloat(app.requested_amount).toLocaleString()}</p>
                            <p class="text-sm text-gray-500">${new Date(app.created_at).toLocaleDateString()}</p>
                        </div>
                        <span class="px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}">${app.status}</span>
                    </div>
                </div>
            `).join('');
            document.getElementById('recentApplications').innerHTML = appsHtml || '<p class="text-gray-500 text-center">No applications yet</p>';
        }
        
        // Load loans
        const loansResponse = await axios.get(`${API_BASE}/api/loans/${currentUser.id}`);
        if (loansResponse.data.success) {
            const loans = loansResponse.data.loans;
            const activeLoansCount = loans.filter(loan => loan.status === 'active').length;
            const totalOutstanding = loans.filter(loan => loan.status === 'active')
                .reduce((sum, loan) => sum + parseFloat(loan.outstanding_balance), 0);
            
            document.getElementById('activeLoans').textContent = activeLoansCount;
            document.getElementById('outstandingBalance').textContent = `$${totalOutstanding.toLocaleString()}`;
            
            // Display active loans
            const activeLoans = loans.filter(loan => loan.status === 'active');
            const loansHtml = activeLoans.map(loan => `
                <div class="border-b pb-3 mb-3 last:border-b-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-semibold">${loan.product_name}</h4>
                            <p class="text-sm text-gray-600">Balance: $${parseFloat(loan.outstanding_balance).toLocaleString()}</p>
                            <p class="text-sm text-gray-500">Due: ${new Date(loan.maturity_date).toLocaleDateString()}</p>
                        </div>
                        <button onclick="showPaymentSchedule(${loan.id})" class="text-purple-600 hover:text-purple-800 text-sm font-medium">
                            View Payments
                        </button>
                    </div>
                </div>
            `).join('');
            document.getElementById('activeLoansContainer').innerHTML = loansHtml || '<p class="text-gray-500 text-center">No active loans</p>';
        }
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

// Load admin dashboard
async function loadAdminDashboard() {
    try {
        const response = await axios.get(`${API_BASE}/api/admin/applications`);
        if (response.data.success) {
            const applications = response.data.applications;
            document.getElementById('totalApps').textContent = applications.length;
            
            const pendingApps = applications.filter(app => app.status === 'submitted' || app.status === 'under_review');
            document.getElementById('activeLoans').textContent = pendingApps.length;
            
            // Display applications for admin review
            const appsHtml = applications.slice(0, 10).map(app => `
                <div class="border-b pb-3 mb-3 last:border-b-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-semibold">${app.first_name} ${app.last_name}</h4>
                            <p class="text-sm text-gray-600">${app.product_name} - $${parseFloat(app.requested_amount).toLocaleString()}</p>
                            <p class="text-sm text-gray-500">${new Date(app.created_at).toLocaleDateString()}</p>
                        </div>
                        <div class="flex flex-col gap-1">
                            <span class="px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}">${app.status}</span>
                            <button onclick="reviewApplication(${app.id})" class="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                Review
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            document.getElementById('recentApplications').innerHTML = appsHtml || '<p class="text-gray-500 text-center">No applications</p>';
        }
    } catch (error) {
        console.error('Failed to load admin dashboard:', error);
    }
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

// Show application form
function showApplication() {
    const applicationForm = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Loan Application</h2>
            <p class="text-gray-600">Complete your loan application</p>
        </div>
        
        <form onsubmit="handleApplication(event)" class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Loan Product</label>
                <select id="productSelect" onchange="updateProductInfo()" required 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">Select a loan product</option>
                    ${loanProducts.map(product => 
                        `<option value="${product.id}">${product.product_name} (${product.product_type})</option>`
                    ).join('')}
                </select>
            </div>
            
            <div id="productInfo" class="hidden bg-blue-50 p-4 rounded-lg">
                <!-- Product details will be shown here -->
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Requested Amount</label>
                <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">$</span>
                    <input type="number" id="requestedAmount" required 
                           class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                           placeholder="0.00">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Purpose of Loan</label>
                <textarea id="purpose" required rows="3"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Describe how you plan to use the loan funds..."></textarea>
            </div>
            
            <!-- Business Information -->
            <div id="businessInfo" class="hidden">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <input type="text" id="businessName"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                        <select id="businessType"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="">Select type</option>
                            <option value="LLC">LLC</option>
                            <option value="Corporation">Corporation</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Sole Proprietorship">Sole Proprietorship</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                        <input type="text" id="industry"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Years in Business</label>
                        <input type="number" id="yearsInBusiness"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Annual Revenue</label>
                        <div class="relative">
                            <span class="absolute left-3 top-2 text-gray-500">$</span>
                            <input type="number" id="annualRevenue"
                                   class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Monthly Revenue</label>
                        <div class="relative">
                            <span class="absolute left-3 top-2 text-gray-500">$</span>
                            <input type="number" id="monthlyRevenue"
                                   class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Purchase Order Information -->
            <div id="poInfo" class="hidden">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Purchase Order Details</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">PO Number</label>
                        <input type="text" id="poNumber"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                        <input type="text" id="poCustomerName"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Customer Company</label>
                        <input type="text" id="poCustomerCompany"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">PO Amount</label>
                        <div class="relative">
                            <span class="absolute left-3 top-2 text-gray-500">$</span>
                            <input type="number" id="poAmount"
                                   class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">PO Date</label>
                        <input type="date" id="poDate"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                        <input type="date" id="deliveryDate"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            
            <!-- Invoice Information -->
            <div id="invoiceInfo" class="hidden">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Invoice Details</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                        <input type="text" id="invoiceNumber"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                        <input type="text" id="invoiceCustomerName"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Customer Company</label>
                        <input type="text" id="invoiceCustomerCompany"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Invoice Amount</label>
                        <div class="relative">
                            <span class="absolute left-3 top-2 text-gray-500">$</span>
                            <input type="number" id="invoiceAmount"
                                   class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                        <input type="date" id="invoiceDate"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input type="date" id="invoiceDueDate"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            
            <div class="flex gap-3 pt-4">
                <button type="submit" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Submit Application
                </button>
                <button type="button" onclick="closeModal()" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    `;
    showModal(applicationForm);
}

// Update product information display
function updateProductInfo() {
    const productSelect = document.getElementById('productSelect');
    const productInfo = document.getElementById('productInfo');
    const businessInfo = document.getElementById('businessInfo');
    const poInfo = document.getElementById('poInfo');
    const invoiceInfo = document.getElementById('invoiceInfo');
    
    // Hide all additional info sections
    businessInfo.classList.add('hidden');
    poInfo.classList.add('hidden');
    invoiceInfo.classList.add('hidden');
    
    const selectedProductId = productSelect.value;
    if (!selectedProductId) {
        productInfo.classList.add('hidden');
        return;
    }
    
    const product = loanProducts.find(p => p.id == selectedProductId);
    if (!product) return;
    
    // Show product information
    productInfo.innerHTML = `
        <h4 class="font-semibold text-gray-800 mb-2">${product.product_name}</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
                <span class="font-medium">Amount Range:</span> 
                $${parseInt(product.min_amount).toLocaleString()} - $${parseInt(product.max_amount).toLocaleString()}
            </div>
            <div>
                <span class="font-medium">Interest Rate:</span> 
                ${(product.min_interest_rate * 100).toFixed(1)}% - ${(product.max_interest_rate * 100).toFixed(1)}%
            </div>
            <div>
                <span class="font-medium">Term:</span> 
                ${product.min_term_days} - ${product.max_term_days} days
            </div>
            <div>
                <span class="font-medium">Origination Fee:</span> 
                ${(product.origination_fee_rate * 100).toFixed(1)}%
            </div>
        </div>
        <p class="text-sm text-gray-600 mt-2">${product.description}</p>
    `;
    productInfo.classList.remove('hidden');
    
    // Show appropriate additional information section
    if (product.product_type === 'microloan') {
        businessInfo.classList.remove('hidden');
    } else if (product.product_type === 'purchase_order') {
        businessInfo.classList.remove('hidden');
        poInfo.classList.remove('hidden');
    } else if (product.product_type === 'invoice_discount') {
        businessInfo.classList.remove('hidden');
        invoiceInfo.classList.remove('hidden');
    }
}

// Handle application submission
async function handleApplication(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('Please sign in to submit an application');
        return;
    }
    
    const productId = document.getElementById('productSelect').value;
    const requestedAmount = document.getElementById('requestedAmount').value;
    const purpose = document.getElementById('purpose').value;
    
    const product = loanProducts.find(p => p.id == productId);
    if (!product) {
        alert('Please select a valid loan product');
        return;
    }
    
    // Validate amount range
    if (parseFloat(requestedAmount) < product.min_amount || parseFloat(requestedAmount) > product.max_amount) {
        alert(`Requested amount must be between $${parseInt(product.min_amount).toLocaleString()} and $${parseInt(product.max_amount).toLocaleString()}`);
        return;
    }
    
    const applicationData = {
        userId: currentUser.id,
        productId: parseInt(productId),
        requestedAmount: parseFloat(requestedAmount),
        purpose: purpose
    };
    
    // Collect additional information based on product type
    if (product.product_type === 'microloan' || product.product_type === 'purchase_order' || product.product_type === 'invoice_discount') {
        applicationData.businessInfo = {
            businessName: document.getElementById('businessName').value,
            businessType: document.getElementById('businessType').value,
            industry: document.getElementById('industry').value,
            yearsInBusiness: parseInt(document.getElementById('yearsInBusiness').value) || 0,
            annualRevenue: parseFloat(document.getElementById('annualRevenue').value) || 0,
            monthlyRevenue: parseFloat(document.getElementById('monthlyRevenue').value) || 0,
            numberOfEmployees: 1
        };
    }
    
    if (product.product_type === 'purchase_order') {
        applicationData.purchaseOrderInfo = {
            poNumber: document.getElementById('poNumber').value,
            customerName: document.getElementById('poCustomerName').value,
            customerCompany: document.getElementById('poCustomerCompany').value,
            poAmount: parseFloat(document.getElementById('poAmount').value) || 0,
            poDate: document.getElementById('poDate').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            description: purpose
        };
    }
    
    if (product.product_type === 'invoice_discount') {
        applicationData.invoiceInfo = {
            invoiceNumber: document.getElementById('invoiceNumber').value,
            customerName: document.getElementById('invoiceCustomerName').value,
            customerCompany: document.getElementById('invoiceCustomerCompany').value,
            invoiceAmount: parseFloat(document.getElementById('invoiceAmount').value) || 0,
            invoiceDate: document.getElementById('invoiceDate').value,
            dueDate: document.getElementById('invoiceDueDate').value,
            description: purpose
        };
    }
    
    try {
        const response = await axios.post(`${API_BASE}/api/applications`, applicationData);
        if (response.data.success) {
            alert(`Application submitted successfully! Application Number: ${response.data.applicationNumber}`);
            closeModal();
            if (currentUser.userType === 'admin') {
                await loadAdminDashboard();
            } else {
                await loadBorrowerDashboard();
            }
        }
    } catch (error) {
        console.error('Application submission failed:', error);
        alert('Failed to submit application. Please try again.');
    }
}

// Apply for specific product (called from product cards)
function applyForProduct(productType) {
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

// Show payment calculator
function showCalculator() {
    const calculatorForm = `
        <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Payment Calculator</h2>
            <p class="text-gray-600">Estimate your loan payments</p>
        </div>
        
        <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2 text-gray-500">$</span>
                        <input type="number" id="calcAmount" value="10000"
                               class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                               oninput="calculatePayment()">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                    <input type="number" id="calcRate" value="15" step="0.1"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                           oninput="calculatePayment()">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Term (days)</label>
                    <input type="number" id="calcTerm" value="365"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                           oninput="calculatePayment()">
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                        <p class="text-sm text-gray-600">Monthly Payment</p>
                        <p class="text-2xl font-bold text-purple-600" id="monthlyPayment">$0</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm text-gray-600">Total Interest</p>
                        <p class="text-2xl font-bold text-green-600" id="totalInterest">$0</p>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <p class="text-sm text-gray-600">Total Amount to Repay</p>
                    <p class="text-3xl font-bold text-blue-600" id="totalAmount">$0</p>
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Close
                </button>
            </div>
        </div>
    `;
    showModal(calculatorForm);
    calculatePayment();
}

// Calculate loan payment
function calculatePayment() {
    const amount = parseFloat(document.getElementById('calcAmount').value) || 0;
    const rate = parseFloat(document.getElementById('calcRate').value) || 0;
    const termDays = parseFloat(document.getElementById('calcTerm').value) || 0;
    
    if (amount <= 0 || rate <= 0 || termDays <= 0) {
        document.getElementById('monthlyPayment').textContent = '$0';
        document.getElementById('totalInterest').textContent = '$0';
        document.getElementById('totalAmount').textContent = '$0';
        return;
    }
    
    // Simple interest calculation
    const totalInterest = (amount * (rate / 100) * (termDays / 365));
    const totalAmount = amount + totalInterest;
    const monthlyPayment = totalAmount / (termDays / 30);
    
    document.getElementById('monthlyPayment').textContent = `$${monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalInterest').textContent = `$${totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalAmount').textContent = `$${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// Show payment schedule for a loan
async function showPaymentSchedule(loanId) {
    try {
        const response = await axios.get(`${API_BASE}/api/loans/${loanId}/payments`);
        if (response.data.success) {
            const payments = response.data.payments;
            
            const scheduleHtml = `
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Payment Schedule</h2>
                    <p class="text-gray-600">Loan ID: ${loanId}</p>
                </div>
                
                <div class="space-y-3 max-h-96 overflow-y-auto">
                    ${payments.map(payment => `
                        <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                            <div>
                                <p class="font-semibold">Payment #${payment.payment_number}</p>
                                <p class="text-sm text-gray-600">Due: ${new Date(payment.due_date).toLocaleDateString()}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold">$${parseFloat(payment.total_payment).toLocaleString()}</p>
                                <p class="text-sm ${payment.status === 'paid' ? 'text-green-600' : payment.status === 'late' ? 'text-red-600' : 'text-gray-600'}">${payment.status}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-6">
                    <button onclick="closeModal()" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Close
                    </button>
                </div>
            `;
            showModal(scheduleHtml);
        }
    } catch (error) {
        console.error('Failed to load payment schedule:', error);
        alert('Failed to load payment schedule');
    }
}

// Admin: Review application
async function reviewApplication(applicationId) {
    try {
        const response = await axios.get(`${API_BASE}/api/admin/applications`);
        if (response.data.success) {
            const application = response.data.applications.find(app => app.id === applicationId);
            if (!application) {
                alert('Application not found');
                return;
            }
            
            const reviewForm = `
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Review Application</h2>
                    <p class="text-gray-600">${application.first_name} ${application.last_name} - ${application.product_name}</p>
                </div>
                
                <div class="space-y-4 mb-6">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-semibold mb-2">Application Details</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div><span class="font-medium">Amount:</span> $${parseFloat(application.requested_amount).toLocaleString()}</div>
                            <div><span class="font-medium">Product:</span> ${application.product_name}</div>
                            <div><span class="font-medium">Status:</span> ${application.status}</div>
                            <div><span class="font-medium">Submitted:</span> ${new Date(application.submitted_at).toLocaleDateString()}</div>
                        </div>
                        <div class="mt-2">
                            <span class="font-medium">Purpose:</span> ${application.purpose}
                        </div>
                    </div>
                </div>
                
                <form onsubmit="handleApplicationReview(event, ${applicationId})" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                        <select id="reviewStatus" onchange="toggleApprovalFields()" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="">Select decision</option>
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                        </select>
                    </div>
                    
                    <div id="approvalFields" class="hidden space-y-4">
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Approved Amount</label>
                                <div class="relative">
                                    <span class="absolute left-3 top-2 text-gray-500">$</span>
                                    <input type="number" id="approvedAmount" value="${application.requested_amount}"
                                           class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                                <input type="number" id="approvedRate" step="0.01" value="15"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Term (days)</label>
                                <input type="number" id="approvedTerm" value="365"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                            </div>
                        </div>
                    </div>
                    
                    <div id="rejectionField" class="hidden">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                        <textarea id="rejectionReason" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="Explain why the application was rejected..."></textarea>
                    </div>
                    
                    <div class="flex gap-3">
                        <button type="submit" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                            Submit Review
                        </button>
                        <button type="button" onclick="closeModal()" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            `;
            showModal(reviewForm);
        }
    } catch (error) {
        console.error('Failed to load application details:', error);
        alert('Failed to load application details');
    }
}

// Toggle approval/rejection fields
function toggleApprovalFields() {
    const status = document.getElementById('reviewStatus').value;
    const approvalFields = document.getElementById('approvalFields');
    const rejectionField = document.getElementById('rejectionField');
    
    if (status === 'approved') {
        approvalFields.classList.remove('hidden');
        rejectionField.classList.add('hidden');
    } else if (status === 'rejected') {
        approvalFields.classList.add('hidden');
        rejectionField.classList.remove('hidden');
    } else {
        approvalFields.classList.add('hidden');
        rejectionField.classList.add('hidden');
    }
}

// Handle application review
async function handleApplicationReview(event, applicationId) {
    event.preventDefault();
    
    const status = document.getElementById('reviewStatus').value;
    const reviewData = { status };
    
    if (status === 'approved') {
        reviewData.approvedAmount = parseFloat(document.getElementById('approvedAmount').value);
        reviewData.approvedRate = parseFloat(document.getElementById('approvedRate').value) / 100;
        reviewData.approvedTermDays = parseInt(document.getElementById('approvedTerm').value);
    } else if (status === 'rejected') {
        reviewData.rejectionReason = document.getElementById('rejectionReason').value;
    }
    
    try {
        const response = await axios.put(`${API_BASE}/api/admin/applications/${applicationId}`, reviewData);
        if (response.data.success) {
            alert('Application review submitted successfully!');
            closeModal();
            await loadAdminDashboard();
        }
    } catch (error) {
        console.error('Failed to submit review:', error);
        alert('Failed to submit review. Please try again.');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    currentUser = null;
    
    // Show main content and hide dashboard
    document.querySelector('.gradient-bg').style.display = 'block';
    document.querySelector('#products').style.display = 'block';
    document.querySelector('#how-it-works').style.display = 'block';
    document.getElementById('dashboard').classList.add('hidden');
    
    // Reset navigation
    const nav = document.querySelector('nav .hidden');
    if (nav) {
        nav.innerHTML = `
            <a href="#" class="text-gray-600 hover:text-purple-600 font-medium">Home</a>
            <a href="#products" class="text-gray-600 hover:text-purple-600 font-medium">Products</a>
            <a href="#how-it-works" class="text-gray-600 hover:text-purple-600 font-medium">How It Works</a>
            <a href="#about" class="text-gray-600 hover:text-purple-600 font-medium">About</a>
            <button onclick="showLogin()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Sign In
            </button>
        `;
    }
}

// Modal functions
function showModal(content) {
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.body.style.overflow = 'auto';
}