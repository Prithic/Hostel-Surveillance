import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import dataRoutes from './routes/dataRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

const app = express()

// Security headers
app.use(helmet())

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Request logger
app.use(morgan('dev'))

// JSON body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
})
app.use('/api', limiter)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/data', dataRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', system: 'Trinity Engine Backend API', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

// Initialize MongoDB and start Express server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 [Trinity Engine API] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`)
    console.log(`🔐 [Auth API Endpoint]: http://localhost:${PORT}/api/auth/login`)
  })
})
