const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Testing database connection...')
  
  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test if tables exist by querying the schema
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `
    
    console.log('📊 Database tables found:')
    result.forEach(table => {
      console.log(`  - ${table.table_name}`)
    })
    
    // Test basic operations
    console.log('\n🧪 Testing basic operations...')
    
    // Test BlogPost model
    const postCount = await prisma.blogPost.count()
    console.log(`📝 BlogPost records: ${postCount}`)
    
    // Test Comment model  
    const commentCount = await prisma.comment.count()
    console.log(`💬 Comment records: ${commentCount}`)
    
    // Test Admin model
    const adminCount = await prisma.admin.count()
    console.log(`👤 Admin records: ${adminCount}`)
    
    console.log('\n🎉 All database tests passed!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  }
}

testConnection()