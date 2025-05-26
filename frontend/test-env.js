import { config } from 'dotenv'
config()

console.log('Environment Variables Check:')
console.log('---------------------------')
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing')
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing')
console.log('VITE_MAPBOX_TOKEN:', process.env.VITE_MAPBOX_TOKEN ? '✓ Set' : '✗ Missing')

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.log('\n⚠️  Warning: Supabase credentials are required!')
  console.log('Please create a .env file based on .env.example')
}