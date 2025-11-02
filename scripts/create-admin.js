const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  console.log('🚀 Creating admin user...')
  
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log('📧 Username: admin')
      console.log('🔐 To reset password, delete the existing admin and run this script again.')
      return
    }

    // Hash the password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash('admin123', saltRounds)

    // Create admin user
    const adminUser = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: 'System Administrator'
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Username: admin')
    console.log('🔐 Password: admin123')
    console.log('🆔 Admin ID:', adminUser.id)
    console.log('')
    console.log('⚠️  IMPORTANT: Please change the default password after first login!')
    console.log('🔗 Login URL: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    
    if (error.code === 'P2002') {
      console.error('❌ Admin user with this username already exists!')
    }
  } finally {
    await prisma.$disconnect()
  }
}

async function resetAdminPassword() {
  console.log('🔄 Resetting admin password...')
  
  try {
    // Hash the new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash('admin123', saltRounds)

    // Update admin user password
    const updatedAdmin = await prisma.admin.update({
      where: { username: 'admin' },
      data: { password: hashedPassword }
    })

    console.log('✅ Admin password reset successfully!')
    console.log('📧 Username: admin')
    console.log('🔐 New Password: admin123')
    console.log('🆔 Admin ID:', updatedAdmin.id)

  } catch (error) {
    console.error('❌ Error resetting admin password:', error)
    
    if (error.code === 'P2025') {
      console.error('❌ Admin user not found! Please run createAdminUser first.')
    }
  } finally {
    await prisma.$disconnect()
  }
}

async function deleteAdminUser() {
  console.log('🗑️  Deleting admin user...')
  
  try {
    const deletedAdmin = await prisma.admin.delete({
      where: { username: 'admin' }
    })

    console.log('✅ Admin user deleted successfully!')
    console.log('🆔 Deleted Admin ID:', deletedAdmin.id)

  } catch (error) {
    console.error('❌ Error deleting admin user:', error)
    
    if (error.code === 'P2025') {
      console.error('❌ Admin user not found!')
    }
  } finally {
    await prisma.$disconnect()
  }
}

async function listAdminUsers() {
  console.log('📋 Listing all admin users...')
  
  try {
    const adminUsers = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true
      }
    })

    if (adminUsers.length === 0) {
      console.log('❌ No admin users found!')
      return
    }

    console.log('✅ Admin users found:')
    adminUsers.forEach((admin, index) => {
      console.log(`${index + 1}. ID: ${admin.id}`)
      console.log(`   Username: ${admin.username}`)
      console.log(`   Name: ${admin.name}`)
      console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error listing admin users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Main execution
const command = process.argv[2]

switch (command) {
  case 'create':
    createAdminUser()
    break
  case 'reset':
    resetAdminPassword()
    break
  case 'delete':
    deleteAdminUser()
    break
  case 'list':
    listAdminUsers()
    break
  default:
    console.log('🔧 Admin User Management Script')
    console.log('')
    console.log('Available commands:')
    console.log('  create - Create a new admin user (admin/admin123)')
    console.log('  reset  - Reset admin password to default (admin123)')
    console.log('  delete - Delete the admin user')
    console.log('  list   - List all admin users')
    console.log('')
    console.log('Usage examples:')
    console.log('  node scripts/create-admin.js create')
    console.log('  node scripts/create-admin.js reset')
    console.log('  node scripts/create-admin.js delete')
    console.log('  node scripts/create-admin.js list')
    console.log('')
    console.log('Default: Creating admin user...')
    createAdminUser()
}
