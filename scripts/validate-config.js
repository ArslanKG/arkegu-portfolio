#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

console.log('🔍 Next.js Configuration Validation\n');

// Read next.config.js
const configPath = path.join(process.cwd(), 'next.config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

console.log('✅ Configuration Analysis:');

// Check if standalone output is conditional
if (configContent.includes(`output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined`)) {
    console.log('✅ Output configuration: FIXED - Now conditional for production only');
} else if (configContent.includes(`output: 'standalone'`)) {
    console.log('❌ Output configuration: ISSUE - Still hardcoded to standalone');
} else {
    console.log('✅ Output configuration: GOOD - No standalone in development');
}

// Check for other potential issues
if (configContent.includes('swcMinify: true')) {
    console.log('✅ SWC minification: Enabled');
}

if (configContent.includes('reactStrictMode: true')) {
    console.log('✅ React Strict Mode: Enabled');
}

console.log('\n🧹 Cache Cleanup Status:');
const nextExists = fs.existsSync('.next');
const cacheExists = fs.existsSync('node_modules/.cache');

console.log(`✅ .next directory: ${nextExists ? 'EXISTS (will be regenerated)' : 'CLEANED'}`);
console.log(`✅ node_modules/.cache: ${cacheExists ? 'EXISTS' : 'CLEANED'}`);

console.log('\n📋 Next Steps:');
console.log('1. Restart development server: npm run dev');
console.log('2. Navigate to: http://localhost:3000/admin');
console.log('3. Check browser network tab for 404 errors on static assets');
console.log('4. Verify CSS and JS files load correctly');

console.log('\n🎯 Expected Fix:');
console.log('- CSS files should load from /_next/static/css/');
console.log('- JS chunks should load from /_next/static/chunks/');
console.log('- No more 404 errors or text/html MIME type responses');
console.log('- Admin panel should render completely');