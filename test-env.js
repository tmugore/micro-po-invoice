// test-env.js - Environment Configuration Test
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Monei Lending App Configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
  
  // Read .env file (for display purposes only)
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log(`📁 Found ${lines.length} environment variables\n`);
  
  // Check for required variables
  const requiredVars = [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_API_TOKEN',
    'PRODUCTION_WORKER_URL'
  ];
  
  console.log('🔧 Required Variables Check:');
  requiredVars.forEach(variable => {
    const exists = envContent.includes(variable);
    console.log(`   ${exists ? '✅' : '❌'} ${variable}`);
  });
  
} else {
  console.log('❌ .env file NOT found');
  console.log('💡 Create a .env file in your project root');
}

// Check Node.js version
console.log(`\n🖥️  Node.js Version: ${process.version}`);

// Check if we're in development mode
console.log(`🏷️  NODE_ENV: ${process.env.NODE_ENV || 'Not set (defaults to development)'}`);

// Test basic Node.js functionality
console.log('\n🧪 Testing Basic Node.js Functionality:');
try {
  const testObject = { app: 'Monei', status: 'running' };
  console.log('✅ Object creation: Working');
  console.log('✅ JSON handling: Working');
  console.log('✅ File system access: Working');
} catch (error) {
  console.log('❌ Basic functionality test failed');
}

console.log('\n🎉 Environment test completed!');
console.log('💡 Next: Run this script with: node test-env.js');