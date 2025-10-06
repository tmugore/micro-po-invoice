// Monei Lending Platform - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Loan Application Form
    const loanForm = document.getElementById('loan-form');
    const statusForm = document.getElementById('status-form');
    const statusResult = document.getElementById('status-result');

    // Handle loan application submission
    loanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            business: document.getElementById('business').value,
            loanAmount: document.getElementById('loanAmount').value,
            purpose: document.getElementById('purpose').value
        };

        // Generate application ID
        const applicationId = 'APP' + Date.now();
        
        // Show success message
        alert(`✅ Application Submitted Successfully!\n\nYour Application ID: ${applicationId}\n\nWe will contact you at ${formData.email} within 24 hours.`);
        
        // Reset form
        loanForm.reset();
        
        // In real app, you would send this data to your server
        console.log('Loan application data:', formData);
    });

    // Handle status check
    statusForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const applicationId = document.getElementById('applicationId').value.toUpperCase();
        
        // Simulate status check
        checkApplicationStatus(applicationId);
    });

    // Simulate status check (will be replaced with real API call)
    function checkApplicationStatus(applicationId) {
        // Show loading
        statusResult.innerHTML = '🔍 Checking status...';
        statusResult.className = 'status-result';
        
        // Simulate API call delay
        setTimeout(() => {
            // Mock status responses based on application ID
            const statuses = [
                '📋 Application Received - Under Review',
                '✅ Approved - Funds Processing',
                '⚠️ Additional Information Required',
                '📊 Credit Assessment in Progress',
                '🎉 Loan Disbursed Successfully'
            ];
            
            // Pick a random status for demo (in real app, get from server)
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            statusResult.innerHTML = `
                <strong>Application ID:</strong> ${applicationId}<br>
                <strong>Status:</strong> ${randomStatus}<br>
                <strong>Last Updated:</strong> ${new Date().toLocaleDateString()}
            `;
            statusResult.className = 'status-result success';
            
        }, 1500);
    }

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
});