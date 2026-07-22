import { User } from '../models/User.js'
import { generateSeedUsers, generateDashboardDatasets } from '../seed/seedData.js'

const seedUsers = generateSeedUsers()
const seedDatasets = generateDashboardDatasets()

// In-memory state storage for live REST updates
let outpassesState = [
  { id: 'OUT-9921', studentName: 'Sharan M', regNo: '7176211001', room: 'B-214', dept: 'AIML (Year 2)', type: 'Weekend Home Visit', destination: 'Coimbatore, Tamil Nadu', reason: 'Family event & weekend home visit', outTime: '2026-07-24 05:00 PM', inTime: '2026-07-26 08:00 PM', travelMode: 'Personal Bike / Bus', parentPhone: '9842100000', parentConfirmed: true, status: 'Pending Warden Permission', appliedOn: '2026-07-22' },
  { id: 'OUT-9804', studentName: 'Akash K', regNo: '7176211002', room: 'A-201', dept: 'CSE (Year 2)', type: 'Night Outpass', destination: 'TNPESU Hackathon Campus', reason: 'Participating in 24hr National Hackathon', outTime: '2026-07-20 06:00 PM', inTime: '2026-07-21 10:00 AM', travelMode: 'Train (Express)', parentPhone: '9443200000', parentConfirmed: true, status: 'Approved Pass', appliedOn: '2026-07-18' },
]

let complaintsState = [
  { id: 'CMP-098', student: 'Sharan M', room: 'B-214', category: 'Plumbing', title: 'Water leakage in Block B 2nd floor', priority: 'High', status: 'In Progress', date: 'Today' },
  { id: 'CMP-104', student: 'Akash K', room: 'A-201', category: 'Network', title: 'Wi-Fi speed drop in Block A 2nd floor', priority: 'Medium', status: 'Pending', date: 'Yesterday' },
]

// 1. Dashboard Summary Analytics
export async function getDashboardStats(req, res, next) {
  try {
    let studentCount = 1000
    let wardenCount = 50
    let securityCount = 100
    let adminCount = 20

    try {
      studentCount = await User.countDocuments({ role: 'Student' }) || 1000
      wardenCount = await User.countDocuments({ role: 'Warden' }) || 50
      securityCount = await User.countDocuments({ role: 'Security Staff' }) || 100
      adminCount = await User.countDocuments({ role: 'Admin' }) || 20
    } catch (e) {
      // Memory fallback
    }

    return res.status(200).json({
      summary: {
        studentsTotal: studentCount,
        wardensTotal: wardenCount,
        securityTotal: securityCount,
        adminsTotal: adminCount,
        overallAttendance: '92.4%',
        occupiedRooms: '482 / 550',
        vacantRooms: '68 Rooms Available',
        pendingComplaints: complaintsState.filter((c) => c.status === 'Pending').length,
        pendingOutpasses: outpassesState.filter((o) => o.status === 'Pending Warden Permission').length,
        feeCollectionStatus: '88% Collected (₹42.5L / ₹48L)',
        activeLaundrySlots: 38,
        todayVisitors: 24,
      },
    })
  } catch (error) {
    next(error)
  }
}

// 2. Students Dataset API
export async function getStudents(req, res, next) {
  try {
    let students = []
    try {
      students = await User.find({ role: 'Student' }).limit(100).select('-passwordHash')
    } catch (e) {
      students = seedUsers.filter((u) => u.role === 'Student').slice(0, 100)
    }
    return res.status(200).json({ students })
  } catch (error) {
    next(error)
  }
}

// 3. Outpasses Dataset REST API (GET & PUT Permission)
export async function getOutpasses(req, res, next) {
  try {
    return res.status(200).json({ outpasses: outpassesState })
  } catch (error) {
    next(error)
  }
}

export async function updateOutpassPermission(req, res, next) {
  try {
    const { id } = req.params
    const { decision } = req.body

    const item = outpassesState.find((o) => o.id === id)
    if (item) {
      item.status = decision === 'Grant' ? 'Approved Pass' : 'Permission Denied'
      return res.status(200).json({ message: `Outpass ${id} updated to ${item.status}`, outpass: item })
    }
    return res.status(404).json({ error: 'Outpass not found' })
  } catch (error) {
    next(error)
  }
}

// 4. Complaints Dataset API
export async function getComplaints(req, res, next) {
  try {
    return res.status(200).json({ complaints: complaintsState })
  } catch (error) {
    next(error)
  }
}

// 5. Laundry Dataset API
export async function getLaundry(req, res, next) {
  try {
    const slots = ['8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM', '4:00 PM - 5:00 PM', '6:00 PM - 7:00 PM']
    const tracking = [
      { id: 'LND-8821', item: 'Batch #402 — 8 Dresses (Shirts, Pants)', status: 'Washing', time: '10:30 AM' },
      { id: 'LND-8802', item: 'Batch #398 — 5 Dresses (Towels, Bedsheet)', status: 'Ready', time: 'Yesterday' },
    ]
    return res.status(200).json({ slots, tracking })
  } catch (error) {
    next(error)
  }
}

// 6. Fee Status Dataset API
export async function getFees(req, res, next) {
  try {
    const feeRecords = [
      { id: 'INV-8821', student: 'Sharan M', regNo: '7176211001', room: 'B-214', term: 'Semester 4 Hostel Fee', amount: '₹45,000', status: 'Paid', date: '02 July 2026' },
      { id: 'INV-8804', student: 'Akash K', regNo: '7176211002', room: 'A-201', term: 'Semester 4 Hostel Fee', amount: '₹45,000', status: 'Pending', date: 'Due 10 July' },
    ]
    return res.status(200).json({ feeRecords })
  } catch (error) {
    next(error)
  }
}

// 7. Campus Notices Dataset API
export async function getNotices(req, res, next) {
  try {
    const notices = [
      { id: 'NTC-401', title: 'Routine Electrical Inspection in Block B', category: 'Maintenance', priority: 'High', date: '22 July 2026', body: 'Power backup will be active tomorrow 10:00 AM - 1:00 PM.' },
      { id: 'NTC-398', title: 'Night Outpass Submission Deadline', category: 'General', priority: 'Medium', date: '20 July 2026', body: 'All leave requests must be submitted online before 5:00 PM.' },
    ]
    return res.status(200).json({ notices })
  } catch (error) {
    next(error)
  }
}

// 8. Rooms & Visitors Dataset API
export async function getRooms(req, res, next) {
  try {
    const rooms = [
      { roomNo: 'B-214', block: 'Block B', floor: '2nd Floor', type: 'Twin Sharing', occupants: ['Sharan M', 'Akash K'], status: 'Occupied' },
      { roomNo: 'A-101', block: 'Block A', floor: '1st Floor', type: 'Single Delux', occupants: ['Vignesh M'], status: 'Occupied' },
      { roomNo: 'C-302', block: 'Block C', floor: '3rd Floor', type: 'Triple Sharing', occupants: [], status: 'Available' },
    ]
    return res.status(200).json({ rooms })
  } catch (error) {
    next(error)
  }
}
