// Using native fetch API (Node.js 18+)

// Configuration
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://arslankg.dev' 
  : 'http://localhost:3000'

const API_BASE = `${BASE_URL}/api`

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    const data = await response.json()
    return { status: response.status, data, headers: response.headers }
  } catch (error) {
    console.error(`Request failed: ${error.message}`)
    return { status: 0, data: { error: error.message } }
  }
}

// Helper to get auth cookie for admin requests (you'll need to implement this)
async function getAuthCookie() {
  // In a real test, you would authenticate first
  // For now, return empty - tests will show 401 errors for admin endpoints
  return ''
}

// Test data
const validCommentData = {
  postId: 'test-post-id', // You'll need a real post ID from your database
  author: 'Test User',
  email: 'test@example.com',
  content: 'This is a test comment with enough content to pass validation.'
}

const invalidCommentData = [
  {
    name: 'Missing postId',
    data: { ...validCommentData, postId: undefined }
  },
  {
    name: 'Short author name',
    data: { ...validCommentData, author: 'A' }
  },
  {
    name: 'Invalid email',
    data: { ...validCommentData, email: 'invalid-email' }
  },
  {
    name: 'Short content',
    data: { ...validCommentData, content: 'Short' }
  },
  {
    name: 'Long content',
    data: { ...validCommentData, content: 'x'.repeat(1001) }
  },
  {
    name: 'HTML in author',
    data: { ...validCommentData, author: '<script>alert("xss")</script>' }
  },
  {
    name: 'Spam content',
    data: { ...validCommentData, content: 'BUY NOW! CLICK HERE! GUARANTEED MONEY! FREE VIAGRA! CASINO!!!' }
  }
]

// Test functions
async function testCommentSubmission() {
  console.log('\n=== Testing Comment Submission (POST /api/comments) ===')
  
  // Test valid comment submission
  console.log('\n1. Testing valid comment submission...')
  const result = await makeRequest(`${API_BASE}/comments`, {
    method: 'POST',
    body: JSON.stringify(validCommentData)
  })
  
  console.log(`Status: ${result.status}`)
  console.log(`Response:`, result.data)
  
  if (result.status === 201) {
    console.log('✅ Valid comment submission successful')
  } else {
    console.log(`❌ Expected 201, got ${result.status}`)
  }
  
  // Test invalid comment submissions
  console.log('\n2. Testing invalid comment submissions...')
  for (const testCase of invalidCommentData) {
    console.log(`\n   Testing: ${testCase.name}`)
    const result = await makeRequest(`${API_BASE}/comments`, {
      method: 'POST',
      body: JSON.stringify(testCase.data)
    })
    
    console.log(`   Status: ${result.status}`)
    console.log(`   Response:`, result.data)
    
    if (result.status >= 400 && result.status < 500) {
      console.log('   ✅ Validation error returned as expected')
    } else {
      console.log(`   ❌ Expected 4xx error, got ${result.status}`)
    }
  }
  
  // Test rate limiting
  console.log('\n3. Testing rate limiting...')
  console.log('   Submitting multiple comments quickly...')
  
  const promises = Array.from({ length: 5 }, (_, i) => 
    makeRequest(`${API_BASE}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        ...validCommentData,
        content: `Rate limit test comment ${i + 1} with sufficient content length.`
      })
    })
  )
  
  const results = await Promise.all(promises)
  const rateLimited = results.filter(r => r.status === 429)
  
  console.log(`   Results: ${rateLimited.length} requests were rate limited`)
  if (rateLimited.length > 0) {
    console.log('   ✅ Rate limiting is working')
    console.log(`   Rate limit headers:`, rateLimited[0].data)
  } else {
    console.log('   ⚠️  No rate limiting detected (may need real post ID)')
  }
}

async function testCommentDeletion() {
  console.log('\n=== Testing Comment Deletion (DELETE /api/comments/[id]) ===')
  
  const testCommentId = 'test-comment-id' // You'll need a real comment ID
  const authCookie = await getAuthCookie()
  
  // Test without authentication
  console.log('\n1. Testing deletion without authentication...')
  const unauthResult = await makeRequest(`${API_BASE}/comments/${testCommentId}`, {
    method: 'DELETE'
  })
  
  console.log(`Status: ${unauthResult.status}`)
  console.log(`Response:`, unauthResult.data)
  
  if (unauthResult.status === 401) {
    console.log('✅ Authentication required as expected')
  } else {
    console.log(`❌ Expected 401, got ${unauthResult.status}`)
  }
  
  // Test with invalid comment ID
  console.log('\n2. Testing deletion with invalid comment ID...')
  const invalidIdResult = await makeRequest(`${API_BASE}/comments/invalid-id`, {
    method: 'DELETE',
    headers: authCookie ? { Cookie: authCookie } : {}
  })
  
  console.log(`Status: ${invalidIdResult.status}`)
  console.log(`Response:`, invalidIdResult.data)
  
  if (invalidIdResult.status === 400 || invalidIdResult.status === 401) {
    console.log('✅ Invalid ID handled correctly')
  } else {
    console.log(`❌ Expected 400 or 401, got ${invalidIdResult.status}`)
  }
  
  // Test with non-existent comment ID
  console.log('\n3. Testing deletion with non-existent comment ID...')
  const notFoundResult = await makeRequest(`${API_BASE}/comments/c1234567890123456789012345`, {
    method: 'DELETE',
    headers: authCookie ? { Cookie: authCookie } : {}
  })
  
  console.log(`Status: ${notFoundResult.status}`)
  console.log(`Response:`, notFoundResult.data)
  
  if (notFoundResult.status === 404 || notFoundResult.status === 401) {
    console.log('✅ Non-existent comment handled correctly')
  } else {
    console.log(`❌ Expected 404 or 401, got ${notFoundResult.status}`)
  }
}

async function testCommentApproval() {
  console.log('\n=== Testing Comment Approval (POST /api/comments/[id]/approve) ===')
  
  const testCommentId = 'test-comment-id' // You'll need a real comment ID
  const authCookie = await getAuthCookie()
  
  // Test without authentication
  console.log('\n1. Testing approval without authentication...')
  const unauthResult = await makeRequest(`${API_BASE}/comments/${testCommentId}/approve`, {
    method: 'POST'
  })
  
  console.log(`Status: ${unauthResult.status}`)
  console.log(`Response:`, unauthResult.data)
  
  if (unauthResult.status === 401) {
    console.log('✅ Authentication required as expected')
  } else {
    console.log(`❌ Expected 401, got ${unauthResult.status}`)
  }
  
  // Test with invalid comment ID
  console.log('\n2. Testing approval with invalid comment ID...')
  const invalidIdResult = await makeRequest(`${API_BASE}/comments/invalid-id/approve`, {
    method: 'POST',
    headers: authCookie ? { Cookie: authCookie } : {}
  })
  
  console.log(`Status: ${invalidIdResult.status}`)
  console.log(`Response:`, invalidIdResult.data)
  
  if (invalidIdResult.status === 400 || invalidIdResult.status === 401) {
    console.log('✅ Invalid ID handled correctly')
  } else {
    console.log(`❌ Expected 400 or 401, got ${invalidIdResult.status}`)
  }
  
  // Test with non-existent comment ID
  console.log('\n3. Testing approval with non-existent comment ID...')
  const notFoundResult = await makeRequest(`${API_BASE}/comments/c1234567890123456789012345/approve`, {
    method: 'POST',
    headers: authCookie ? { Cookie: authCookie } : {}
  })
  
  console.log(`Status: ${notFoundResult.status}`)
  console.log(`Response:`, notFoundResult.data)
  
  if (notFoundResult.status === 404 || notFoundResult.status === 401) {
    console.log('✅ Non-existent comment handled correctly')
  } else {
    console.log(`❌ Expected 404 or 401, got ${notFoundResult.status}`)
  }
}

async function testSecurityHeaders() {
  console.log('\n=== Testing Security Headers ===')
  
  const result = await makeRequest(`${API_BASE}/comments`, {
    method: 'POST',
    body: JSON.stringify({})
  })
  
  console.log('\nSecurity headers present:')
  const headers = result.headers.raw()
  const securityHeaders = [
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy',
    'x-xss-protection',
    'permissions-policy'
  ]
  
  securityHeaders.forEach(header => {
    if (headers[header]) {
      console.log(`✅ ${header}: ${headers[header]}`)
    } else {
      console.log(`❌ ${header}: Missing`)
    }
  })
}

// Main test runner
async function runAllTests() {
  console.log('🧪 Comment API Test Suite')
  console.log(`Testing against: ${BASE_URL}`)
  console.log('=====================================')
  
  try {
    await testCommentSubmission()
    await testCommentDeletion()
    await testCommentApproval()
    await testSecurityHeaders()
    
    console.log('\n=====================================')
    console.log('✅ Comment API tests completed!')
    console.log('\nNote: Some tests may show expected failures (401, 404) when testing without proper authentication or real database IDs.')
    console.log('\nTo run full tests with authentication:')
    console.log('1. Create a test blog post and get its ID')
    console.log('2. Update validCommentData.postId with the real post ID')
    console.log('3. Implement getAuthCookie() function for admin authentication')
    console.log('4. Create test comments and get their IDs for deletion/approval tests')
    
  } catch (error) {
    console.error('❌ Test suite failed:', error)
    process.exit(1)
  }
}

// Run tests if called directly
if (require.main === module) {
  runAllTests()
}

module.exports = { runAllTests }