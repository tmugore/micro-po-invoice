// test-cloudflare.js - Cloudflare API Test
require('dotenv').config();

console.log('🌐 Testing Cloudflare Configuration...\n');

// Check environment variables
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

if (!accountId || !apiToken) {
  console.log('❌ Missing Cloudflare credentials in .env file');
  console.log('💡 Make sure you have:');
  console.log('   CLOUDFLARE_ACCOUNT_ID=your_account_id');
  console.log('   CLOUDFLARE_API_TOKEN=your_api_token');
  process.exit(1);
}

console.log('✅ Cloudflare credentials found');
console.log(`📊 Account ID: ${accountId.substring(0, 10)}...`);
console.log(`🔑 API Token: ${apiToken.substring(0, 10)}...\n`);

// Test simple API call (list D1 databases)
async function testCloudflareAPI() {
  try {
    console.log('🔄 Testing Cloudflare API connection...');
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 401) {
      console.log('❌ API Token is invalid or expired');
      return false;
    }
    
    if (response.status === 403) {
      console.log('❌ Insufficient permissions for D1 database');
      return false;
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ API Connection Successful!`);
      console.log(`📊 Found ${data.result.length} D1 databases`);
      return true;
    } else {
      console.log('❌ API Error:', data.errors[0].message);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return false;
  }
}

// Run the test
testCloudflareAPI().then(success => {
  if (success) {
    console.log('\n🎉 Cloudflare setup is working correctly!');
  } else {
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your CLOUDFLARE_ACCOUNT_ID is correct');
    console.log('2. Verify your API token has proper permissions');
    console.log('3. Ensure you have an active internet connection');
  }
});