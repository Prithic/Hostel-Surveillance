import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nestos', {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`[MongoDB Connected]: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.warn(`[MongoDB Connection Warning]: ${error.message}`)
    console.warn('Running with memory/in-memory fallback state if MongoDB instance is not local.')
    return null
  }
}
