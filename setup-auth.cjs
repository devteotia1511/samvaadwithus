#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔐 Samvaad Theatre Group - Authentication Setup\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file found');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('your-project-id')) {
    console.log('⚠️  .env file contains placeholder values');
    console.log('Please update with your actual Supabase credentials\n');
  } else {
    console.log('✅ .env file appears to be configured\n');
  }
} else {
  console.log('❌ .env file not found');
  console.log('Creating .env template...\n');
  
  const envTemplate = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Instructions:
# 1. Go to your Supabase project dashboard
# 2. Navigate to Settings > API
# 3. Copy the Project URL and anon public key
# 4. Replace the values above with your actual credentials
`;
  
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env template created');
  console.log('Please update it with your Supabase credentials\n');
}

console.log('📋 Setup Checklist:');
console.log('');
console.log('1. ✅ Create Supabase project at https://supabase.com');
console.log('2. ✅ Get project URL and anon key from Settings > API');
console.log('3. ✅ Update .env file with your credentials');
console.log('4. ⏳ Run database migrations in Supabase SQL Editor');
console.log('5. ⏳ Create admin user in Authentication > Users');
console.log('6. ⏳ Test login at http://localhost:5173/login');
console.log('');
console.log('📖 For detailed instructions, see: AUTHENTICATION_SETUP.md');
console.log('');
console.log('🚀 To start the development server:');
console.log('   npm run dev');
console.log('');
console.log('🔍 To test your setup:');
console.log('   Open browser console and check for connection logs'); 