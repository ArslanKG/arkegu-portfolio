const { PrismaClient } = require('@prisma/client')

async function testAdminUpdate() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Testing admin post update flow...')
    
    // Create a test post first
    const testPost = await prisma.blogPost.create({
      data: {
        title: 'Test Post for Admin Update',
        slug: 'test-admin-update-' + Date.now(),
        content: 'This is test content for admin testing',
        excerpt: 'Test excerpt for admin',
        published: false,
        isFeatured: false,
        tags: ['test', 'admin']
      }
    })
    console.log('✅ Test post created:', testPost.id)
    
    // First, login as admin to get session
    console.log('🔐 Testing admin login...')
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'Arslan123*' // This should match your admin password
      })
    })
    
    console.log('🔐 Login response status:', loginResponse.status)
    
    // Extract cookies from login response
    const setCookies = loginResponse.headers.get('set-cookie')
    console.log('🍪 Set-Cookie header:', setCookies)
    
    let cookieHeader = ''
    if (setCookies) {
      // Parse cookies - this is a simplified parser
      const cookies = setCookies.split(',').map(cookie => {
        return cookie.split(';')[0].trim()
      })
      cookieHeader = cookies.join('; ')
      console.log('🍪 Cookie header for requests:', cookieHeader)
    }
    
    // Now test the actual update with authentication
    console.log('📡 Testing authenticated PUT request...')
    
    const updateData = {
      title: 'Updated by Admin Test',
      content: testPost.content,
      excerpt: testPost.excerpt,
      published: true,
      isFeatured: true, // The problematic field
      tags: ['test', 'admin', 'updated']
    }
    
    console.log('📤 Update payload:', JSON.stringify(updateData, null, 2))
    
    const updateResponse = await fetch(`http://localhost:3000/api/posts/${testPost.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader // Include session cookies
      },
      body: JSON.stringify(updateData)
    })
    
    console.log('📥 Update response status:', updateResponse.status)
    
    const responseText = await updateResponse.text()
    console.log('📥 Update response body:', responseText)
    
    try {
      const parsedResponse = JSON.parse(responseText)
      console.log('📥 Parsed update response:', JSON.stringify(parsedResponse, null, 2))
      
      if (updateResponse.ok) {
        console.log('✅ Update successful!')
      } else {
        console.log('❌ Update failed!')
        console.log('❌ Error:', parsedResponse.error || 'Unknown error')
        console.log('❌ Message:', parsedResponse.message || 'No message')
      }
    } catch (e) {
      console.log('❌ Failed to parse response as JSON')
      console.log('📥 Raw response:', responseText)
    }
    
    // Check actual database state
    const finalPost = await prisma.blogPost.findUnique({
      where: { id: testPost.id }
    })
    console.log('🔍 Final post state in database:')
    console.log('  - ID:', finalPost?.id)
    console.log('  - Title:', finalPost?.title)
    console.log('  - Published:', finalPost?.published)
    console.log('  - isFeatured:', finalPost?.isFeatured)
    console.log('  - Updated at:', finalPost?.updatedAt)
    
    // Clean up
    await prisma.blogPost.delete({
      where: { id: testPost.id }
    })
    console.log('🧹 Test post deleted')
    
  } catch (error) {
    console.error('❌ Error during admin update test:')
    console.error('Error message:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Alternative test using NextAuth session approach
async function testWithNextAuth() {
  console.log('🔍 Testing NextAuth session handling...')
  
  // Create a simple test to check if NextAuth is working
  const authTestResponse = await fetch('http://localhost:3000/api/auth/session')
  console.log('🔐 Auth session response status:', authTestResponse.status)
  
  const sessionData = await authTestResponse.text()
  console.log('🔐 Session data:', sessionData)
}

async function main() {
  try {
    const serverCheck = await fetch('http://localhost:3000')
    console.log('🌐 Dev server is accessible')
  } catch (error) {
    console.log('❌ Dev server is not accessible')
    console.log('💡 Please ensure the development server is running: npm run dev')
    return
  }
  
  await testWithNextAuth()
  console.log('\n' + '='.repeat(50) + '\n')
  await testAdminUpdate()
}

main()