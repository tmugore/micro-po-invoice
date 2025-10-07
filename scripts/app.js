// scripts/app.js - Updated to use REAL Cloudflare Worker API
document.addEventListener('DOMContentLoaded', function() {
    // ⚠️ IMPORTANT: Replace with your actual Worker URL
    const WORKER_URL = 'https://monei-api.tmugore.workers.dev';
    
    const loanForm = document.getElementById('loan-form');
    const statusForm = document.getElementById('status-form');
    const statusResult = document.getElementById('status-result');

    console.log('Monei Lending Platform initialized');
    console.log('Worker URL:', WORKER_URL);

    // Handle loan application submission
    loanForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                business: document.getElementById('business').value,
                loanAmount: document.getElementById('loanAmount').value,
                purpose: document.getElementById('purpose').value
            };

            console.log('Submitting loan application:', formData);

            // Send to your Cloudflare Worker
            const response = await fetch(`${WORKER_URL}/api/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (result.success) {
                alert(`✅ Application Submitted Successfully!\n\nYour Application ID: ${result.applicationId}\n\nWe will contact you at ${formData.email} within 24 hours.`);
                loanForm.reset();
            } else {
                throw new Error(result.error || 'Failed to submit application');
            }

        } catch (error) {
            console.error('Application error:', error);
            alert('❌ Error submitting application. Please try again or contact support.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Handle status check
    statusForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const statusBtn = this.querySelector('.status-btn');
        const originalText = statusBtn.textContent;
        const applicationId = document.getElementById('applicationId').value.toUpperCase();
        
        try {
            statusBtn.textContent = 'Checking...';
            statusBtn.disabled = true;
            statusResult.innerHTML = '🔍 Checking application status...';
            statusResult.className = 'status-result';

            console.log('Checking status for:', applicationId);

            // Check with your Cloudflare Worker
            const response = await fetch(`${WORKER_URL}/api/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationId })
            });

            const result = await response.json();
            console.log('Status check response:', result);

            if (result.success) {
                const statusMessages = {
                    'submitted': '📋 Application Received - Under Review',
                    'approved': '✅ Approved - Funds Processing',
                    'rejected': '❌ Application Not Approved',
                    'disbursed': '🎉 Loan Disbursed Successfully'
                };
                
                const message = statusMessages[result.status] || result.status;
                const submitDate = new Date(result.details.submitted).toLocaleDateString();
                
                statusResult.innerHTML = `
                    <strong>Application ID:</strong> ${result.applicationId}<br>
                    <strong>Applicant:</strong> ${result.details.fullName}<br>
                    <strong>Business:</strong> ${result.details.business}<br>
                    <strong>Loan Amount:</strong> BWP ${parseFloat(result.details.loanAmount).toLocaleString()}<br>
                    <strong>Purpose:</strong> ${result.details.purpose}<br>
                    <strong>Status:</strong> ${message}<br>
                    <strong>Submitted:</strong> ${submitDate}
                `;
                statusResult.className = 'status-result success';
            } else {
                statusResult.innerHTML = `❌ ${result.error || 'Application not found'}`;
                statusResult.className = 'status-result error';
            }

        } catch (error) {
            console.error('Status check error:', error);
            statusResult.innerHTML = '❌ Error checking status. Please try again.';
            statusResult.className = 'status-result error';
        } finally {
            statusBtn.textContent = originalText;
            statusBtn.disabled = false;
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Test API connection on page load
    async function testAPIConnection() {
        try {
            const response = await fetch(`${WORKER_URL}/api/health`);
            if (response.ok) {
                console.log('✅ Frontend connected to API successfully');
            } else {
                console.warn('⚠️ API connection issue');
            }
        } catch (error) {
            console.error('❌ API connection failed:', error);
        }
    }

    testAPIConnection();
});