const { PrismaClient } = require('@prisma/client')

async function testApiEndpoint() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Testing API endpoint for post update...')
    
    // Create a test post first
    const testPost = await prisma.blogPost.create({
      data: {
        title: 'Test Post for API',
        slug: 'test-api-post-' + Date.now(),
        content: 'This is test content for API testing',
        excerpt: 'Test excerpt for API',
        published: false,
        isFeatured: false,
        tags: ['test', 'api']
      }
    })
    console.log('✅ Test post created:', testPost.id)
    
    // Test the API endpoint
    console.log('📡 Testing PUT /api/posts/[id] endpoint...')
    
    const updateData = {
      title: 'Updated Test Post via API',
      content: 'Updated content via API',
      excerpt: 'Updated excerpt via API',
      published: true,
      isFeatured: true, // This is the field causing issues
      tags: ['test', 'api', 'updated']
    }
    
    console.log('📤 Request payload:', JSON.stringify(updateData, null, 2))
    
    const response = await fetch(`http://localhost:3000/api/posts/${testPost.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Note: This test won't have authentication, but let's see what error we get
      },
      body: JSON.stringify(updateData)
    })
    
    console.log('📥 Response status:', response.status)
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()))
    
    const responseData = await response.text()
    console.log('📥 Response body (raw):', responseData)
    
    try {
      const parsedResponse = JSON.parse(responseData)
      console.log('📥 Parsed response:', JSON.stringify(parsedResponse, null, 2))
    } catch (e) {
      console.log('❌ Failed to parse response as JSON')
    }
    
    if (!response.ok) {
      console.log(`❌ API request failed with status ${response.status}`)
    } else {
      console.log('✅ API request successful!')
    }
    
    // Check the actual database state
    const actualPost = await prisma.blogPost.findUnique({
      where: { id: testPost.id }
    })
    console.log('🔍 Actual post in database:', {
      id: actualPost?.id,
      title: actualPost?.title,
      isFeatured: actualPost?.isFeatured,
      published: actualPost?.published
    })
    
    // Clean up
    await prisma.blogPost.delete({
      where: { id: testPost.id }
    })
    console.log('🧹 Test post deleted')
    
  } catch (error) {
    console.error('❌ Error during API endpoint test:')
    console.error('Error message:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Check if dev server is running
async function checkDevServer() {
  try {
    const response = await fetch('http://localhost:3000/api/posts')
    console.log('🌐 Dev server is running on localhost:3000')
    return true
  } catch (error) {
    console.log('❌ Dev server is not running on localhost:3000')
    console.log('💡 Please start the development server with: npm run dev')
    return false
  }
}

async function main() {
  const serverRunning = await checkDevServer()
  if (serverRunning) {
    await testApiEndpoint()
  }
}

main()