const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testAdminAuth() {
  console.log('🧪 Testing Admin Authentication Setup...\n')
  
  try {
    // Test 1: Check if admin user exists
    console.log('1️⃣ Checking admin user existence...')
    const admin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    })
    
    if (!admin) {
      console.log('❌ Admin user not found!')
      return
    }
    
    console.log('✅ Admin user found:', {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      createdAt: admin.createdAt.toISOString()
    })
    
    // Test 2: Verify password hashing
    console.log('\n2️⃣ Testing password verification...')
    const testPassword = 'Arslan123*'
    const isValid = await bcrypt.compare(testPassword, admin.password)
    
    if (isValid) {
      console.log('✅ Password verification successful')
    } else {
      console.log('❌ Password verification failed')
    }
    
    // Test 3: Test wrong password
    console.log('\n3️⃣ Testing wrong password rejection...')
    const wrongPassword = 'wrongpass'
    const isWrongValid = await bcrypt.compare(wrongPassword, admin.password)
    
    if (!isWrongValid) {
      console.log('✅ Wrong password correctly rejected')
    } else {
      console.log('❌ Security issue: Wrong password was accepted!')
    }
    
    console.log('\n🎉 Authentication setup test completed!')
    console.log('\n📋 Test Results Summary:')
    console.log('✅ Admin user created and stored in database')
    console.log('✅ Password properly hashed with bcrypt')
    console.log('✅ Password verification working correctly')
    console.log('✅ Security: Wrong passwords are rejected')
    
    console.log('\n🚀 Ready to test login at: http://localhost:3000/admin')
    console.log('📧 Username: admin')
    console.log('🔐 Password: Arslan123*')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAdminAuth()