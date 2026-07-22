import express from 'express'
import { login, adminLogin, logout, getMe, forgotPassword, resetPassword } from '../controllers/authController.js'
import { validateSriShakthiEmail, validatePassword } from '../middleware/validationMiddleware.js'
import { authenticateJWT } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', validateSriShakthiEmail, validatePassword, login)
router.post('/admin-login', validatePassword, adminLogin)
router.post('/logout', logout)
router.get('/me', authenticateJWT, getMe)
router.post('/forgot-password', validateSriShakthiEmail, forgotPassword)
router.post('/reset-password', resetPassword)

export default router
