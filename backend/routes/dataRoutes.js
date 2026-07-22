import express from 'express'
import {
  getDashboardStats,
  getStudents,
  getOutpasses,
  updateOutpassPermission,
  getComplaints,
  getLaundry,
  getFees,
  getNotices,
  getRooms,
} from '../controllers/dataController.js'

const router = express.Router()

router.get('/dashboard-stats', getDashboardStats)
router.get('/students', getStudents)
router.get('/outpasses', getOutpasses)
router.put('/outpasses/:id/permission', updateOutpassPermission)
router.get('/complaints', getComplaints)
router.get('/laundry', getLaundry)
router.get('/fees', getFees)
router.get('/notices', getNotices)
router.get('/rooms', getRooms)

export default router
