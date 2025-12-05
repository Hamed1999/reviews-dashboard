#!/usr/bin/env node

import https from 'https';

const HOSTAWAY_API_URL = 'https://api.hostaway.com';
const ACCOUNT_ID = '61148';
const API_KEY = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';

interface ApiResponse {
  status: number;
  headers: any;
  data: any;
}

function makeRequest(path: string, method: string = 'GET'): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.hostaway.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FlexLiving-Dashboard-Test/1.0'
      },
      timeout: 10000 // 10 second timeout
    };

    console.log(`Making request to: ${path}`);
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode || 200,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          reject(new Error(`Failed to parse JSON response: ${e instanceof Error ? e.message : 'Unknown error'}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Request failed: ${err.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 10 seconds'));
    });

    req.end();
  });
}

async function testHostawayAPI() {
  console.log('🔍 Testing Hostaway API Integration...\n');
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing API connection...');
    const result = await makeRequest(`/v1/reviews?accountId=${ACCOUNT_ID}&limit=5`);
    
    if (result.status !== 200) {
      throw new Error(`API returned ${result.status}`);
    }
    
    console.log(`✅ API Connection Successful!`);
    console.log(`   Status: ${result.data.status}`);
    console.log(`   Reviews found: ${result.data.result?.length || 0}`);
    
    if (result.data.result && result.data.result.length > 0) {
      console.log(`\n2. Sample Review Data:`);
      const sample = result.data.result[0];
      console.log(`   ID: ${sample.id}`);
      console.log(`   Guest: ${sample.guestName || 'N/A'}`);
      console.log(`   Listing: ${sample.listingName || 'N/A'}`);
      console.log(`   Rating: ${sample.rating || 'N/A'}`);
      console.log(`   Categories: ${JSON.stringify(sample.reviewCategory || [])}`);
    } else {
      console.log(`\n⚠️  No reviews found in the API response.`);
      console.log(`   This might mean:`);
      console.log(`   - The account has no reviews yet`);
      console.log(`   - The API endpoint might be different`);
      console.log(`   - The account ID may not have review permissions`);
    }
    
    console.log(`\n3. Testing with listing filter...`);
    const filteredResult = await makeRequest(`/v1/reviews?accountId=${ACCOUNT_ID}&listingName=2B%20N1%20A`);
    
    console.log(`✅ Filter test completed`);
    console.log(`   Filtered reviews: ${filteredResult.data.result?.length || 0}`);
    
    console.log('\n🎉 All tests passed! The Hostaway API integration is working.');
    
  } catch (error) {
    console.error('\n❌ API Test Failed:');
    console.error(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('\n⚠️  Possible issues:');
    console.error('   1. API credentials are incorrect');
    console.error('   2. Account ID is invalid');
    console.error('   3. Network or firewall issues');
    console.error('   4. Hostaway API is down');
    console.error('   5. API endpoint URL might be wrong');
    
    console.log('\n💡 Debugging steps:');
    console.log('   a. Check your internet connection');
    console.log('   b. Try this curl command in terminal:');
    console.log(`      curl -H "Authorization: Bearer ${API_KEY}" \\
              "https://api.hostaway.com/v1/reviews?accountId=${ACCOUNT_ID}&limit=1"`);
    console.log('   c. Contact Hostaway support if the issue persists');
    
    console.log('\n💡 Fallback behavior:');
    console.log('   The application will use mock data from data/hostaway.json');
  }
}

testHostawayAPI();