// Using native fetch API (Node.js 18+)
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Test data for blog post
const testBlogPost = {
  slug: 'test-blog-post',
  title: 'Test Blog Yazısı - React ve Next.js ile Web Geliştirme',
  excerpt: 'Bu bir test blog yazısıdır. Modern web geliştirme teknikleri hakkında kapsamlı bir inceleme.',
  content: `
# React ve Next.js ile Modern Web Geliştirme

Bu yazıda React ve Next.js kullanarak modern web uygulamaları geliştirme sürecini inceleyeceğiz.

## Giriş

React, Facebook tarafından geliştirilen ve günümüzde en popüler frontend kütüphanelerinden biri haline gelen bir JavaScript kütüphanesidir.

### Ana Özellikler

React'ın temel özellikleri şunlardır:

- **Component-based Architecture**: Bileşen tabanlı mimari
- **Virtual DOM**: Sanal DOM kullanımı
- **Unidirectional Data Flow**: Tek yönlü veri akışı
- **JSX Syntax**: JSX sözdizimi desteği

## Next.js Framework'ü

Next.js, React tabanlı uygulamalar geliştirmek için kullanılan güçlü bir framework'tür.

\`\`\`javascript
// Basit bir Next.js component'i
export default function HomePage() {
  return (
    <div>
      <h1>Merhaba Next.js!</h1>
      <p>Bu basit bir Next.js component'idir.</p>
    </div>
  )
}
\`\`\`

### Server-Side Rendering

Next.js'in en güçlü özelliklerinden biri Server-Side Rendering (SSR) desteğidir.

> SSR sayesinde sayfalarınız SEO dostu hale gelir ve ilk yükleme performansı artar.

## Performans Optimizasyonu

Modern web uygulamalarında performans kritik önem taşır:

1. **Code Splitting**: Kod bölme teknikleri
2. **Lazy Loading**: Tembel yükleme
3. **Image Optimization**: Görsel optimizasyonu
4. **Caching**: Önbellekleme stratejileri

## Sonuç

React ve Next.js kombinasyonu, modern web geliştirme için mükemmel bir çözüm sunuyor.

---

*Bu yazı test amaçlı oluşturulmuştur.*
`,
  published: true,
  publishedAt: new Date(),
  tags: ['React', 'Next.js', 'JavaScript', 'Web Development', 'Frontend'],
  readTime: 8
}

// Test data for comments
const testComments = [
  {
    author: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    content: 'Harika bir yazı! React ve Next.js hakkında çok faydalı bilgiler paylaşmışsınız. Özellikle SSR bölümü çok açıklayıcıydı.',
    approved: true
  },
  {
    author: 'Zeynep Kaya',
    email: 'zeynep@example.com', 
    content: 'Performance optimizasyonu kısmı çok ilgimi çekti. Code splitting hakkında daha detaylı bilgi alabilir miyim?',
    approved: true
  },
  {
    author: 'Mehmet Özkan',
    email: 'mehmet@example.com',
    content: 'Teşekkürler, bu yazı tam da aradığım bilgileri içeriyordu. Next.js öğrenmeye yeni başladım ve bu çok yardımcı oldu.',
    approved: true
  }
]

async function createTestBlogPost() {
  console.log('🔧 Creating test blog post...')
  
  try {
    // Check if test post already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: testBlogPost.slug }
    })
    
    if (existingPost) {
      console.log('✅ Test blog post already exists')
      return existingPost
    }
    
    // Create new test post
    const post = await prisma.blogPost.create({
      data: testBlogPost
    })
    
    console.log('✅ Test blog post created successfully')
    console.log(`   - ID: ${post.id}`)
    console.log(`   - Slug: ${post.slug}`)
    console.log(`   - Title: ${post.title}`)
    
    return post
    
  } catch (error) {
    console.error('❌ Failed to create test blog post:', error)
    throw error
  }
}

async function createTestComments(postId) {
  console.log('💬 Creating test comments...')
  
  try {
    // Delete existing comments for this post
    await prisma.comment.deleteMany({
      where: { postId }
    })
    
    // Create test comments
    const comments = []
    for (const commentData of testComments) {
      const comment = await prisma.comment.create({
        data: {
          ...commentData,
          postId
        }
      })
      comments.push(comment)
    }
    
    console.log(`✅ Created ${comments.length} test comments`)
    return comments
    
  } catch (error) {
    console.error('❌ Failed to create test comments:', error)
    throw error
  }
}

async function testBlogDetailPageData() {
  console.log('🔍 Testing blog detail page data fetching...')
  
  try {
    // Simulate the blog detail page database query
    const post = await prisma.blogPost.findUnique({
      where: { 
        slug: testBlogPost.slug,
        published: true,
        publishedAt: { lte: new Date() }
      },
      include: {
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    
    if (!post) {
      throw new Error('Test blog post not found')
    }
    
    console.log('✅ Blog detail page data fetching successful')
    console.log(`   - Post ID: ${post.id}`)
    console.log(`   - Post Title: ${post.title}`)
    console.log(`   - Published: ${post.published}`)
    console.log(`   - Comments Count: ${post.comments.length}`)
    console.log(`   - Tags: ${post.tags.join(', ')}`)
    
    return post
    
  } catch (error) {
    console.error('❌ Blog detail page data fetching failed:', error)
    throw error
  }
}

async function testStaticParamsGeneration() {
  console.log('⚡ Testing static params generation...')
  
  try {
    // Simulate generateStaticParams function
    const posts = await prisma.blogPost.findMany({
      where: { 
        published: true,
        publishedAt: { lte: new Date() }
      },
      select: { slug: true }
    })
    
    console.log('✅ Static params generation successful')
    console.log(`   - Found ${posts.length} published posts`)
    posts.forEach(post => {
      console.log(`   - Slug: ${post.slug}`)
    })
    
    return posts.map(post => ({ slug: post.slug }))
    
  } catch (error) {
    console.error('❌ Static params generation failed:', error)
    throw error
  }
}

async function testCommentSubmission() {
  console.log('📝 Testing comment submission (API simulation)...')
  
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: testBlogPost.slug }
    })
    
    if (!post) {
      throw new Error('Test post not found for comment submission')
    }
    
    // Test comment data
    const newCommentData = {
      postId: post.id,
      author: 'Test User',
      email: 'testuser@example.com',
      content: 'Bu bir test yorumudur. Comment submission functionality test edilmektedir.'
    }
    
    // Simulate comment creation (what the API would do)
    const comment = await prisma.comment.create({
      data: newCommentData
    })
    
    console.log('✅ Comment submission test successful')
    console.log(`   - Comment ID: ${comment.id}`)
    console.log(`   - Author: ${comment.author}`)
    console.log(`   - Approved: ${comment.approved}`)
    console.log(`   - Content Length: ${comment.content.length} chars`)
    
    return comment
    
  } catch (error) {
    console.error('❌ Comment submission test failed:', error)
    throw error
  }
}

async function validateMarkdownContent() {
  console.log('📄 Validating markdown content structure...')
  
  const content = testBlogPost.content
  const checks = [
    { name: 'Headers', regex: /^#{1,6}\s+.+$/gm },
    { name: 'Code blocks', regex: /```[\s\S]*?```/g },
    { name: 'Inline code', regex: /`[^`]+`/g },
    { name: 'Blockquotes', regex: /^>\s+.+$/gm },
    { name: 'Lists', regex: /^[-*+]\s+.+$/gm },
    { name: 'Numbered lists', regex: /^\d+\.\s+.+$/gm },
    { name: 'Bold text', regex: /\*\*[^*]+\*\*/g },
    { name: 'Links', regex: /\[([^\]]+)\]\([^)]+\)/g }
  ]
  
  console.log('✅ Markdown content validation:')
  checks.forEach(check => {
    const matches = content.match(check.regex)
    const count = matches ? matches.length : 0
    console.log(`   - ${check.name}: ${count} found`)
  })
  
  return true
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...')
  
  try {
    // Delete test comments
    const deletedComments = await prisma.comment.deleteMany({
      where: {
        post: { slug: testBlogPost.slug }
      }
    })
    
    // Delete test blog post
    const deletedPost = await prisma.blogPost.deleteMany({
      where: { slug: testBlogPost.slug }
    })
    
    console.log('✅ Test data cleanup completed')
    console.log(`   - Deleted ${deletedComments.count} comments`)
    console.log(`   - Deleted ${deletedPost.count} blog posts`)
    
  } catch (error) {
    console.error('❌ Test data cleanup failed:', error)
    // Don't throw error here, it's cleanup
  }
}

async function runBlogDetailTests() {
  console.log('🧪 Blog Detail Page Test Suite')
  console.log('=====================================')
  
  try {
    // Create test data
    console.log('\n📦 SETUP PHASE')
    const post = await createTestBlogPost()
    const comments = await createTestComments(post.id)
    
    // Run tests
    console.log('\n🔍 TESTING PHASE')
    await testBlogDetailPageData()
    await testStaticParamsGeneration()
    await testCommentSubmission()
    await validateMarkdownContent()
    
    console.log('\n=====================================')
    console.log('✅ All blog detail tests completed successfully!')
    console.log('\n📋 SUMMARY:')
    console.log(`   - Test blog post created: ${post.title}`)
    console.log(`   - Test comments created: ${comments.length}`)
    console.log(`   - Blog detail page data fetching: ✅`)
    console.log(`   - Static params generation: ✅`)
    console.log(`   - Comment submission: ✅`)
    console.log(`   - Markdown content validation: ✅`)
    
    console.log('\n🌐 ACCESS TEST POST:')
    console.log(`   - URL: http://localhost:3000/blog/${post.slug}`)
    console.log(`   - Admin: http://localhost:3000/admin/dashboard/posts`)
    
    console.log('\n⚡ NEXT STEPS:')
    console.log('   1. Start the development server: npm run dev')
    console.log(`   2. Navigate to: http://localhost:3000/blog/${post.slug}`)
    console.log('   3. Test comment form submission')
    console.log('   4. Verify markdown rendering and responsive design')
    
  } catch (error) {
    console.error('❌ Blog detail test suite failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Cleanup function (can be run separately)
async function runCleanup() {
  console.log('🧹 Running cleanup only...')
  try {
    await cleanupTestData()
    console.log('✅ Cleanup completed successfully!')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run tests if called directly
if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.includes('--cleanup')) {
    runCleanup()
  } else {
    runBlogDetailTests()
  }
}

module.exports = { 
  runBlogDetailTests,
  runCleanup,
  createTestBlogPost,
  createTestComments
}