const { PrismaClient } = require('@prisma/client')

async function testPostUpdate() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Testing post update with isFeatured field...')
    
    // First, create a test post
    console.log('📝 Creating test post...')
    const testPost = await prisma.blogPost.create({
      data: {
        title: 'Test Post for Update',
        slug: 'test-post-update-' + Date.now(),
        content: 'This is test content',
        excerpt: 'Test excerpt',
        published: false,
        isFeatured: false,
        tags: ['test']
      }
    })
    console.log('✅ Test post created:', testPost.id)
    
    // Try to update the post with isFeatured field
    console.log('🔄 Attempting to update post with isFeatured=true...')
    const updatedPost = await prisma.blogPost.update({
      where: { id: testPost.id },
      data: {
        isFeatured: true,
        title: 'Updated Test Post'
      }
    })
    console.log('✅ Post updated successfully!')
    console.log('📋 Updated post data:', {
      id: updatedPost.id,
      title: updatedPost.title,
      isFeatured: updatedPost.isFeatured
    })
    
    // Clean up
    await prisma.blogPost.delete({
      where: { id: testPost.id }
    })
    console.log('🧹 Test post deleted')
    
  } catch (error) {
    console.error('❌ Error during post update test:')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    if (error.meta) {
      console.error('Error meta:', error.meta)
    }
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPostUpdate()