const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testAuthSetup() {
  try {
    console.log('🔐 Testing NextAuth Authentication Setup...\n')

    // Test database connection
    console.log('1. Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful\n')

    // Check if Admin table exists
    console.log('2. Checking Admin table...')
    const adminCount = await prisma.admin.count()
    console.log(`✅ Admin table exists with ${adminCount} records\n`)

    // Create test admin user if not exists
    console.log('3. Creating test admin user...')
    const testUsername = 'admin'
    const testPassword = 'admin123'
    
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: testUsername }
    })

    if (existingAdmin) {
      console.log(`⚠️  Admin user '${testUsername}' already exists`)
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(testPassword, 12)
      
      // Create admin user
      const newAdmin = await prisma.admin.create({
        data: {
          username: testUsername,
          password: hashedPassword,
          name: 'Test Admin'
        }
      })
      
      console.log(`✅ Test admin user created successfully`)
      console.log(`   Username: ${testUsername}`)
      console.log(`   Password: ${testPassword}`)
      console.log(`   ID: ${newAdmin.id}`)
    }

    console.log('\n4. Testing password verification...')
    const admin = await prisma.admin.findUnique({
      where: { username: testUsername }
    })

    if (admin) {
      const isValid = await bcrypt.compare(testPassword, admin.password)
      if (isValid) {
        console.log('✅ Password verification successful')
      } else {
        console.log('❌ Password verification failed')
      }
    }

    console.log('\n🎉 Authentication setup test completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Make sure NEXTAUTH_SECRET is set in your .env file')
    console.log('2. Create admin login page at /admin/login')
    console.log('3. Create protected dashboard at /admin/dashboard')
    console.log('4. Test the authentication flow in your browser')

  } catch (error) {
    console.error('❌ Authentication setup test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuthSetup()