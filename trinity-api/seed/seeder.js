import dotenv from 'dotenv'
import { connectDB } from '../config/db.js'
import { User } from '../models/User.js'
import { generateSeedUsers } from './seedData.js'

dotenv.config()

export async function runSeeder() {
  const seedUsers = generateSeedUsers()

  try {
    const conn = await connectDB()
    if (conn && conn.connection.readyState === 1) {
      await User.deleteMany({})
      await User.insertMany(seedUsers)
      console.log(`[Database Seeder]: Successfully seeded ${seedUsers.length} users (100 Students, 10 Wardens, 5 Admins) into MongoDB.`)
    } else {
      console.log(`[Database Seeder]: MongoDB not connected. Created ${seedUsers.length} in-memory seeded records available.`)
    }
  } catch (error) {
    console.error(`[Database Seeder Error]: ${error.message}`)
  }

  return seedUsers
}

if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  runSeeder().then(() => process.exit(0))
}
