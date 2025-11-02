/**
 * Blog Posts CRUD API Test Script
 * Tests all blog post endpoints with authentication
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('❌ ADMIN_PASSWORD environment variable is required');
  process.exit(1);
}

// Test data
const testPost = {
  title: 'Test Blog Yazısı - Türkçe Karakterler: ÇĞıÖŞÜ',
  excerpt: 'Bu bir test blog yazısının özet metnidir.',
  content: `# Test Blog Yazısı

Bu bir test blog yazısıdır. Bu yazı API endpoints'lerini test etmek için oluşturulmuştur.

## İçerik Bölümü

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Alt Başlık

- Liste öğesi 1
- Liste öğesi 2  
- Liste öğesi 3

Bu metin yaklaşık olarak **2 dakika** okuma süresi hesaplaması için yeterli uzunluktadır.`,
  coverImage: 'https://picsum.photos/800/400',
  published: false,
  tags: ['test', 'api', 'blog', 'türkçe']
};

const updatedPost = {
  title: 'Güncellenmiş Test Yazısı - Updated Title',
  excerpt: 'Güncellenmiş özet metni',
  published: true,
  tags: ['updated', 'test', 'modified']
};

// HTTP Request helper
function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Authentication helper
async function authenticate() {
  console.log('🔐 Authenticating...');
  
  try {
    // First get CSRF token
    const csrfResponse = await makeRequest('GET', '/api/auth/csrf');
    if (csrfResponse.status !== 200) {
      throw new Error(`Failed to get CSRF token: ${csrfResponse.status}`);
    }
    
    const csrfToken = csrfResponse.data?.csrfToken;
    if (!csrfToken) {
      throw new Error('No CSRF token received');
    }

    // Then sign in
    const signInData = {
      username: 'admin',
      password: 'Arslan123*',
      csrfToken
    };

    const signInResponse = await makeRequest('POST', '/api/auth/callback/credentials', signInData);
    
    // Extract session cookie from response
    const setCookieHeader = signInResponse.headers['set-cookie'];
    if (!setCookieHeader) {
      throw new Error('No session cookie received');
    }

    const sessionCookie = setCookieHeader
      .find(cookie => cookie.includes('next-auth.session-token'))
      ?.split(';')[0];

    if (!sessionCookie) {
      throw new Error('Session cookie not found');
    }

    console.log('✅ Authentication successful');
    return sessionCookie;

  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    throw error;
  }
}

// Test functions
async function testGetPosts(sessionCookie) {
  console.log('\n📋 Testing GET /api/posts...');
  
  try {
    const response = await makeRequest('GET', '/api/posts', null, {
      Cookie: sessionCookie
    });

    if (response.status === 200) {
      console.log('✅ GET /api/posts successful');
      console.log(`   Found ${response.data.posts.length} posts`);
      return response.data.posts;
    } else {
      console.log(`❌ GET /api/posts failed: ${response.status}`);
      console.log('   Response:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ GET /api/posts error:', error.message);
    return null;
  }
}

async function testCreatePost(sessionCookie) {
  console.log('\n📝 Testing POST /api/posts...');
  
  try {
    const response = await makeRequest('POST', '/api/posts', testPost, {
      Cookie: sessionCookie
    });

    if (response.status === 201) {
      console.log('✅ POST /api/posts successful');
      console.log(`   Created post: "${response.data.post.title}"`);
      console.log(`   Slug: ${response.data.post.slug}`);
      console.log(`   Read time: ${response.data.post.readTime} minutes`);
      return response.data.post;
    } else {
      console.log(`❌ POST /api/posts failed: ${response.status}`);
      console.log('   Response:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ POST /api/posts error:', error.message);
    return null;
  }
}

async function testGetPost(sessionCookie, postId) {
  console.log(`\n👀 Testing GET /api/posts/${postId}...`);
  
  try {
    const response = await makeRequest('GET', `/api/posts/${postId}`, null, {
      Cookie: sessionCookie
    });

    if (response.status === 200) {
      console.log('✅ GET /api/posts/[id] successful');
      console.log(`   Retrieved post: "${response.data.post.title}"`);
      return response.data.post;
    } else {
      console.log(`❌ GET /api/posts/[id] failed: ${response.status}`);
      console.log('   Response:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ GET /api/posts/[id] error:', error.message);
    return null;
  }
}

async function testUpdatePost(sessionCookie, postId) {
  console.log(`\n✏️ Testing PUT /api/posts/${postId}...`);
  
  try {
    const response = await makeRequest('PUT', `/api/posts/${postId}`, updatedPost, {
      Cookie: sessionCookie
    });

    if (response.status === 200) {
      console.log('✅ PUT /api/posts/[id] successful');
      console.log(`   Updated post: "${response.data.post.title}"`);
      console.log(`   New slug: ${response.data.post.slug}`);
      console.log(`   Published: ${response.data.post.published}`);
      return response.data.post;
    } else {
      console.log(`❌ PUT /api/posts/[id] failed: ${response.status}`);
      console.log('   Response:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ PUT /api/posts/[id] error:', error.message);
    return null;
  }
}

async function testDeletePost(sessionCookie, postId) {
  console.log(`\n🗑️ Testing DELETE /api/posts/${postId}...`);
  
  try {
    const response = await makeRequest('DELETE', `/api/posts/${postId}`, null, {
      Cookie: sessionCookie
    });

    if (response.status === 200) {
      console.log('✅ DELETE /api/posts/[id] successful');
      console.log(`   ${response.data.message}`);
      return true;
    } else {
      console.log(`❌ DELETE /api/posts/[id] failed: ${response.status}`);
      console.log('   Response:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ DELETE /api/posts/[id] error:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Blog Posts API Tests');
  console.log(`📡 Base URL: ${BASE_URL}`);
  console.log(`👤 Admin User: ${ADMIN_USERNAME}`);
  
  try {
    // Authenticate
    const sessionCookie = await authenticate();
    
    // Test 1: Get all posts (initial state)
    const initialPosts = await testGetPosts(sessionCookie);
    
    // Test 2: Create new post
    const createdPost = await testCreatePost(sessionCookie);
    if (!createdPost) {
      console.log('\n❌ Cannot continue tests - post creation failed');
      return;
    }
    
    // Test 3: Get specific post
    await testGetPost(sessionCookie, createdPost.id);
    
    // Test 4: Update post
    await testUpdatePost(sessionCookie, createdPost.id);
    
    // Test 5: Get all posts (after operations)
    await testGetPosts(sessionCookie);
    
    // Test 6: Delete post
    const deleteSuccess = await testDeletePost(sessionCookie, createdPost.id);
    
    if (deleteSuccess) {
      // Final verification: Get all posts (after deletion)
      await testGetPosts(sessionCookie);
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runTests();