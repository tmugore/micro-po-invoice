// TEMPORARY FIX - Add these function definitions at the top of your existing app.js
window.showCalculator = function() {
    console.log('Calculator clicked');
    alert('Calculator will be implemented soon!');
};

window.showApplication = function() {
    console.log('Application clicked');
    alert('Application form will open soon!');
};

window.applyForProduct = function(productId) {
    console.log('Apply for product:', productId);
    alert(`Applying for ${productId} loan - feature coming soon!`);
};

window.showLogin = function() {
    console.log('Login clicked');
    alert('Login modal will open soon!');
};

// Monei Lending Platform - Complete Functionality Fix
console.log('Monei Lending Platform initialized');
console.log('Worker URL: https://monei-api.tmugore.workers.dev');

// Global state
let currentView = 'home';
let currentUser = null;

// DOM Content Loaded - Safe event listener attachment
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing event listeners...');
    
    // Initialize all functionality
    initializeEventListeners();
    checkAuthStatus();
    loadProducts();
});

function initializeEventListeners() {
    // Navigation buttons
    const loginBtn = document.getElementById('login-btn');
    const applicationBtn = document.getElementById('application-btn');
    const calculatorBtn = document.getElementById('calculator-btn');
    
    if (loginBtn) loginBtn.addEventListener('click', showLogin);
    if (applicationBtn) applicationBtn.addEventListener('click', showApplication);
    if (calculatorBtn) calculatorBtn.addEventListener('click', showCalculator);
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.warn('Login form not found');
    }
    
    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleApplication);
    }
    
    // Product application buttons
    const applyButtons = document.querySelectorAll('[id^="apply-"]');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.id.replace('apply-', '');
            applyForProduct(productId);
        });
    });
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal, .modal .bg-gray-600');
    closeButtons.forEach(button => {
        button.addEventListener('click', hideModals);
    });
}

// View Management Functions
function showLogin() {
    console.log('Showing login form');
    hideModals();
    document.getElementById('login-modal').classList.remove('hidden');
    currentView = 'login';
}

function showApplication() {
    console.log('Showing application form');
    hideModals();
    document.getElementById('application-modal').classList.remove('hidden');
    currentView = 'application';
}

function showCalculator() {
    console.log('Showing calculator');
    hideModals();
    document.getElementById('calculator-modal').classList.remove('hidden');
    currentView = 'calculator';
    calculateLoan(); // Initial calculation
}

function hideModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Product Application Function
function applyForProduct(productId) {
    console.log('Applying for product:', productId);
    
    // Show appropriate application flow based on auth status
    if (!currentUser) {
        showLogin();
        // Store intended product for after login
        localStorage.setItem('intendedProduct', productId);
        return;
    }
    
    // If user is logged in, show application form with product pre-selected
    showApplication();
    
    // Pre-select the product in application form if possible
    const productSelect = document.getElementById('loan-product');
    if (productSelect) {
        productSelect.value = productId;
    }
}

// Form Handlers
async function handleLogin(event) {
    event.preventDefault();
    console.log('Handling login...');
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        // Simple client-side validation
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Mock login for now - replace with actual API call
        setTimeout(() => {
            currentUser = {
                email: email,
                name: email.split('@')[0]
            };
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            hideModals();
            updateUIForAuth();
            
            // Check if there was an intended product to apply for
            const intendedProduct = localStorage.getItem('intendedProduct');
            if (intendedProduct) {
                localStorage.removeItem('intendedProduct');
                applyForProduct(intendedProduct);
            }
            
            alert('Login successful!');
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function handleApplication(event) {
    event.preventDefault();
    console.log('Handling application...');
    
    if (!currentUser) {
        alert('Please login first');
        showLogin();
        return;
    }
    
    const formData = new FormData(event.target);
    const applicationData = {
        product: formData.get('loan-product'),
        amount: formData.get('loan-amount'),
        purpose: formData.get('loan-purpose'),
        term: formData.get('loan-term'),
        income: formData.get('annual-income')
    };
    
    try {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Mock submission
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            hideModals();
            alert('Application submitted successfully! We will review your application and get back to you soon.');
            event.target.reset();
        }, 1500);
        
    } catch (error) {
        console.error('Application error:', error);
        alert('Application failed. Please try again.');
    }
}

// Calculator Functionality
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount-calc')?.value) || 10000;
    const term = parseInt(document.getElementById('loan-term-calc')?.value) || 12;
    const rate = 8.5; // Default interest rate
    
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;
    
    const resultsElem = document.getElementById('calculator-results');
    if (resultsElem) {
        resultsElem.innerHTML = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 class="font-semibold text-green-800 mb-2">Loan Calculation Results</h4>
                <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                        <span>Monthly Payment:</span>
                        <span class="font-semibold">$${monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Total Payment:</span>
                        <span class="font-semibold">$${totalPayment.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Total Interest:</span>
                        <span class="font-semibold">$${totalInterest.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Interest Rate:</span>
                        <span class="font-semibold">${rate}% APR</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// UI State Management
function updateUIForAuth() {
    const loginBtn = document.getElementById('login-btn');
    const userSection = document.getElementById('user-section');
    
    if (currentUser) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userSection) {
            userSection.classList.remove('hidden');
            const userEmailElem = userSection.querySelector('.user-email');
            if (userEmailElem) userEmailElem.textContent = currentUser.email;
        }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (userSection) userSection.classList.add('hidden');
    }
}

function checkAuthStatus() {
    // Check if user is logged in (mock for now)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForAuth();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForAuth();
    alert('Logged out successfully');
}

// Product Loading
function loadProducts() {
    // Products are already in HTML, just ensure event listeners work
    console.log('Products loaded');
}

// Calculator event listeners (dynamic)
document.addEventListener('input', function(event) {
    if (event.target.id === 'loan-amount-calc' || event.target.id === 'loan-term-calc') {
        calculateLoan();
    }
});

// Export functions to global scope for HTML onclick handlers
window.showLogin = showLogin;
window.showApplication = showApplication;
window.showCalculator = showCalculator;
window.applyForProduct = applyForProduct;
window.calculateLoan = calculateLoan;
window.logout = logout;

console.log('Monei Lending Platform functions initialized');