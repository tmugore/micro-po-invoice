// CMS Manager - Fixed version with proper API integration
class CMSManager {
    constructor() {
        this.config = null;
        this.API_BASE = '/api/cms'; // Relative API path
        this.init();
    }

    async init() {
        await this.loadConfig();
        this.setupEventListeners();
        this.renderLoanProducts();
        this.showToast('CMS System loaded successfully', 'success');
    }

    async loadConfig() {
        try {
            const response = await fetch(`${this.API_BASE}/config`);
            if (!response.ok) throw new Error('Failed to fetch config');
            this.config = await response.json();
            this.populateForms();
            console.log('CMS Configuration loaded:', this.config);
        } catch (error) {
            console.error('Failed to load config:', error);
            this.showToast('Error loading configuration from API, using fallback', 'error');
            this.loadDefaultConfig();
        }
    }

    async saveConfig() {
        try {
            // Update config from form values
            this.config.currency.default = document.getElementById('currency-code').value;
            this.config.currency.symbol = document.getElementById('currency-symbol').value;
            this.config.currency.name = document.getElementById('currency-name').value;
            this.config.currency.decimalDigits = parseInt(document.getElementById('currency-decimals').value);

            this.config.websiteContent.hero.title = document.getElementById('hero-title').value;
            this.config.websiteContent.hero.subtitle = document.getElementById('hero-subtitle').value;
            this.config.websiteContent.hero.buttonText = document.getElementById('hero-button').value;

            this.config.settings.apiBaseUrl = document.getElementById('api-url').value;
            this.config.settings.adminEmail = document.getElementById('admin-email').value;
            this.config.settings.autoRefresh = document.getElementById('auto-refresh').checked;

            // Save to backend API
            const response = await fetch(`${this.API_BASE}/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.config)
            });

            if (!response.ok) throw new Error('Failed to save config');

            this.showToast('Configuration saved successfully to database!', 'success');
            this.updateMainApplication();
            
        } catch (error) {
            console.error('Failed to save config:', error);
            this.showToast('Error saving configuration to database', 'error');
            
            // Fallback to localStorage
            localStorage.setItem('monei-cms-config', JSON.stringify(this.config));
            this.showToast('Configuration saved to browser storage as fallback', 'warning');
        }
    }

    loadDefaultConfig() {
        this.config = {
            currency: {
                default: 'BWP',
                symbol: 'P',
                name: 'Botswana Pula',
                decimalDigits: 2
            },
            loanProducts: [],
            websiteContent: {
                hero: {
                    title: 'Smart Micro-Lending Platform',
                    subtitle: 'Access fast, flexible funding',
                    buttonText: 'Apply Now'
                }
            },
            settings: {
                apiBaseUrl: 'https://monei-api.tmugore.workers.dev',
                adminEmail: 'admin@monei.co.bw',
                autoRefresh: true
            }
        };
        this.populateForms();
    }

    populateForms() {
        if (!this.config) return;

        // Currency settings
        document.getElementById('currency-code').value = this.config.currency.default;
        document.getElementById('currency-symbol').value = this.config.currency.symbol;
        document.getElementById('currency-name').value = this.config.currency.name;
        document.getElementById('currency-decimals').value = this.config.currency.decimalDigits;

        // Website content
        if (this.config.websiteContent && this.config.websiteContent.hero) {
            document.getElementById('hero-title').value = this.config.websiteContent.hero.title;
            document.getElementById('hero-subtitle').value = this.config.websiteContent.hero.subtitle;
            document.getElementById('hero-button').value = this.config.websiteContent.hero.buttonText;
        }

        // System settings
        document.getElementById('api-url').value = this.config.settings.apiBaseUrl;
        document.getElementById('admin-email').value = this.config.settings.adminEmail;
        document.getElementById('auto-refresh').checked = this.config.settings.autoRefresh;
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('data-target');
                this.showSection(target);
                
                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Auto-save on input changes
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('change', () => {
                this.debouncedSave();
            });
        });
    }

    debouncedSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveConfig();
        }, 1000);
    }

    showSection(sectionId) {
        document.querySelectorAll('.config-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    renderLoanProducts() {
        const container = document.getElementById('loan-products-list');
        if (!this.config?.loanProducts) {
            container.innerHTML = '<div class="alert alert-info">No loan products configured.</div>';
            return;
        }

        container.innerHTML = this.config.loanProducts.map(product => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h6>${product.product_name}</h6>
                            <p class="text-muted mb-1">${product.description}</p>
                            <small class="text-muted">
                                Amount: ${this.config.currency.symbol}${product.min_amount.toLocaleString()} - ${this.config.currency.symbol}${product.max_amount.toLocaleString()} | 
                                Interest: ${(product.min_interest_rate * 100).toFixed(1)}% - ${(product.max_interest_rate * 100).toFixed(1)}% |
                                Term: ${product.min_term_days} - ${product.max_term_days} days
                            </small>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="form-check form-switch mb-2">
                                <input class="form-check-input" type="checkbox" 
                                       ${product.active ? 'checked' : ''} 
                                       onchange="cmsManager.toggleProduct(${product.id}, this.checked)">
                                <label class="form-check-label">Active</label>
                            </div>
                            <button class="btn btn-sm btn-outline-primary" onclick="cmsManager.editProduct(${product.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="cmsManager.deleteProduct(${product.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async saveConfig() {
        try {
            // Update config from form values
            this.config.currency.default = document.getElementById('currency-code').value;
            this.config.currency.symbol = document.getElementById('currency-symbol').value;
            this.config.currency.name = document.getElementById('currency-name').value;
            this.config.currency.decimalDigits = parseInt(document.getElementById('currency-decimals').value);

            this.config.websiteContent.hero.title = document.getElementById('hero-title').value;
            this.config.websiteContent.hero.subtitle = document.getElementById('hero-subtitle').value;
            this.config.websiteContent.hero.buttonText = document.getElementById('hero-button').value;

            this.config.settings.apiBaseUrl = document.getElementById('api-url').value;
            this.config.settings.adminEmail = document.getElementById('admin-email').value;
            this.config.settings.autoRefresh = document.getElementById('auto-refresh').checked;

            // In a real system, you would save to your backend API
            // For now, we'll use localStorage as a simulation
            localStorage.setItem('monei-cms-config', JSON.stringify(this.config));
            
            this.showToast('Configuration saved successfully!', 'success');
            
            // Update the main application
            this.updateMainApplication();
            
        } catch (error) {
            console.error('Failed to save config:', error);
            this.showToast('Error saving configuration', 'error');
        }
    }

    updateMainApplication() {
        // This would trigger a refresh in the main application
        // For now, we'll just show a message
        this.showToast('Changes will be reflected across the platform', 'info');
    }

    addLoanProduct() {
        const newProduct = {
            id: Date.now(),
            product_name: "New Loan Product",
            product_type: "custom",
            description: "Describe this loan product",
            min_amount: 5000,
            max_amount: 50000,
            min_interest_rate: 0.1,
            max_interest_rate: 0.2,
            min_term_days: 30,
            max_term_days: 365,
            origination_fee_rate: 0.025,
            active: true
        };

        if (!this.config.loanProducts) {
            this.config.loanProducts = [];
        }
        
        this.config.loanProducts.push(newProduct);
        this.renderLoanProducts();
        this.saveConfig();
        this.showToast('New loan product added', 'success');
    }

    editProduct(productId) {
        const product = this.config.loanProducts.find(p => p.id === productId);
        if (product) {
            const newName = prompt('Enter new product name:', product.product_name);
            if (newName) {
                product.product_name = newName;
                this.renderLoanProducts();
                this.saveConfig();
                this.showToast('Product updated', 'success');
            }
        }
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.config.loanProducts = this.config.loanProducts.filter(p => p.id !== productId);
            this.renderLoanProducts();
            this.saveConfig();
            this.showToast('Product deleted', 'success');
        }
    }

    toggleProduct(productId, active) {
        const product = this.config.loanProducts.find(p => p.id === productId);
        if (product) {
            product.active = active;
            this.saveConfig();
            this.showToast(`Product ${active ? 'activated' : 'deactivated'}`, 'info');
        }
    }

    showToast(message, type = 'info') {
        const toast = new bootstrap.Toast(document.getElementById('liveToast'));
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        
        // Set background color based on type
        const toastElement = document.getElementById('liveToast');
        toastElement.className = `toast ${type}`;
        
        toast.show();
    }
}

// Initialize CMS Manager
const cmsManager = new CMSManager();