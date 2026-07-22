import bcrypt from 'bcryptjs'

const STUDENT_PASSWORD_HASH = bcrypt.hashSync('siet@2727', 10)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin@2026', 10)
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('siet@2727', 10)

const explicitStudents = [
  { name: 'Sharan M', username: 'sharanml25@srishakthi.ac.in', dept: 'AIML', year: 2, block: 'B', room: 'B-214' },
  { name: 'Akash K', username: 'akash23@srishakthi.ac.in', dept: 'CSE', year: 2, block: 'A', room: 'A-201' },
  { name: 'Vignesh M', username: 'vignesh24@srishakthi.ac.in', dept: 'AI&DS', year: 1, block: 'B', room: 'B-102' },
  { name: 'Sanjay R', username: 'sanjay22@srishakthi.ac.in', dept: 'ECE', year: 4, block: 'C', room: 'C-405' },
  { name: 'Hari Prasad', username: 'hari24@srishakthi.ac.in', dept: 'IT', year: 1, block: 'B', room: 'B-110' },
  { name: 'Meena S', username: 'meena24@srishakthi.ac.in', dept: 'EEE', year: 1, block: 'D', room: 'D-108' },
  { name: 'Priya Dharshini', username: 'priya23@srishakthi.ac.in', dept: 'Mechanical', year: 2, block: 'D', room: 'D-215' },
  { name: 'Nithya S', username: 'nithya24@srishakthi.ac.in', dept: 'AI&DS', year: 1, block: 'D', room: 'D-112' },
]

const departments = ['AIML', 'AI&DS', 'CSE', 'IT', 'ECE', 'EEE', 'Civil', 'Mechanical']
const blocks = ['A', 'B', 'C', 'D', 'E', 'F']
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const firstNames = ['Aarav', 'Ananya', 'Balaji', 'Deepak', 'Divya', 'Ganesh', 'Kavya', 'Karthik', 'Logesh', 'Manoj', 'Naveen', 'Pavithra', 'Rahul', 'Surya', 'Varun', 'Yash', 'Pooja', 'Rohan', 'Swetha', 'Vikram']
const lastNames = ['Kumar', 'Rajan', 'Sharma', 'Verma', 'Sundaram', 'Natarajan', 'Venkatesh', 'Subramanian', 'Reddy', 'Patel']

export function generateSeedUsers() {
  const users = []

  // 1. Super Admin Account (Highest Authority)
  users.push({
    name: 'Sri Shakthi Super Admin',
    registerNumber: 'SUPER-ADMIN-01',
    username: 'superadmin@srishakthi.ac.in',
    email: 'superadmin@srishakthi.ac.in',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'Super Admin',
    department: 'Executive Board',
    year: 4,
    hostelBlock: 'Executive HQ',
    floor: 1,
    roomNumber: 'HQ-1',
    phone: '9999999999',
    parentName: 'N/A',
    parentPhone: 'N/A',
    bloodGroup: 'O+',
    gender: 'Male',
    attendancePercent: 100,
    feeStatus: 'Paid',
    complaintCount: 0,
    laundryUsage: 0,
    messPlan: 'Executive Plan',
    emergencyContact: '9999999999',
    active: true,
  })

  // 2. Chief Warden Account
  users.push({
    name: 'Chief Warden Office',
    registerNumber: 'CHIEF-WARDEN-01',
    username: 'chiefwarden@srishakthi.ac.in',
    email: 'chiefwarden@srishakthi.ac.in',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'Chief Warden',
    department: 'Hostel Administration',
    year: 4,
    hostelBlock: 'All Blocks',
    floor: 1,
    roomNumber: 'CW-HQ',
    phone: '9940000000',
    parentName: 'N/A',
    parentPhone: 'N/A',
    bloodGroup: 'A+',
    gender: 'Male',
    attendancePercent: 100,
    feeStatus: 'Paid',
    complaintCount: 0,
    laundryUsage: 0,
    messPlan: 'Staff Plan',
    emergencyContact: '9940000000',
    active: true,
  })

  // 3. Mess Manager Account
  users.push({
    name: 'Mess Manager Lead',
    registerNumber: 'MESS-MGR-01',
    username: 'messmanager@srishakthi.ac.in',
    email: 'messmanager@srishakthi.ac.in',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'Mess Manager',
    department: 'Catering & Food Services',
    year: 4,
    hostelBlock: 'Central Mess',
    floor: 1,
    roomNumber: 'MESS-1',
    phone: `9940200000`,
    parentName: 'N/A',
    parentPhone: 'N/A',
    bloodGroup: 'B+',
    gender: 'Male',
    attendancePercent: 100,
    feeStatus: 'Paid',
    complaintCount: 0,
    laundryUsage: 0,
    messPlan: 'Staff Plan',
    emergencyContact: '9940200000',
    active: true,
  })

  // 4. Laundry Staff Account
  users.push({
    name: 'Laundry Supervisor',
    registerNumber: 'LAUNDRY-STAFF-01',
    username: 'laundrystaff@srishakthi.ac.in',
    email: 'laundrystaff@srishakthi.ac.in',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'Laundry Staff',
    department: 'Facility Services',
    year: 4,
    hostelBlock: 'Laundry Center',
    floor: 1,
    roomNumber: 'LND-1',
    phone: `9940300000`,
    parentName: 'N/A',
    parentPhone: 'N/A',
    bloodGroup: 'O+',
    gender: 'Male',
    attendancePercent: 100,
    feeStatus: 'Paid',
    complaintCount: 0,
    laundryUsage: 0,
    messPlan: 'Staff Plan',
    emergencyContact: '9940300000',
    active: true,
  })

  // 5. Generate 1000 Students
  for (let i = 0; i < 1000; i++) {
    if (i < explicitStudents.length) {
      const s = explicitStudents[i]
      users.push({
        name: s.name,
        registerNumber: `717621${1000 + i}`,
        username: s.username,
        email: s.username,
        passwordHash: DEFAULT_PASSWORD_HASH,
        role: 'Student',
        department: s.dept,
        year: s.year,
        hostelBlock: s.block,
        floor: Math.floor(parseInt(s.room.replace(/[^0-9]/g, '')) / 100) || 2,
        roomNumber: s.room,
        phone: `98765${10000 + i}`,
        parentName: `Parent of ${s.name}`,
        parentPhone: `98400${10000 + i}`,
        bloodGroup: bloodGroups[i % bloodGroups.length],
        gender: i % 2 === 0 ? 'Male' : 'Female',
        attendancePercent: 85 + (i % 15),
        feeStatus: i % 5 === 0 ? 'Pending' : 'Paid',
        complaintCount: i % 7,
        laundryUsage: 10 + (i % 20),
        messPlan: 'Regular Non-Veg',
        emergencyContact: `98400${10000 + i}`,
        active: true,
      })
    } else {
      const fn = firstNames[i % firstNames.length]
      const ln = lastNames[i % lastNames.length]
      const uname = `${fn.toLowerCase()}${i + 20}@srishakthi.ac.in`
      const roomNum = 101 + (i % 550)
      const blockLetter = blocks[i % blocks.length]
      users.push({
        name: `${fn} ${ln}`,
        registerNumber: `717621${1000 + i}`,
        username: uname,
        email: uname,
        passwordHash: DEFAULT_PASSWORD_HASH,
        role: 'Student',
        department: departments[i % departments.length],
        year: (i % 4) + 1,
        hostelBlock: blockLetter,
        floor: Math.floor(roomNum / 100),
        roomNumber: `${blockLetter}-${roomNum}`,
        phone: `98765${10000 + i}`,
        parentName: `Parent of ${fn}`,
        parentPhone: `98400${10000 + i}`,
        bloodGroup: bloodGroups[i % bloodGroups.length],
        gender: i % 2 === 0 ? 'Male' : 'Female',
        attendancePercent: 78 + (i % 22),
        feeStatus: i % 6 === 0 ? 'Pending' : 'Paid',
        complaintCount: i % 4,
        laundryUsage: 5 + (i % 25),
        messPlan: i % 3 === 0 ? 'Veg Special' : 'Regular Non-Veg',
        emergencyContact: `98400${10000 + i}`,
        active: true,
      })
    }
  }

  // 6. Generate 50 Wardens
  for (let w = 1; w <= 50; w++) {
    const uname = `warden_${w}@srishakthi.ac.in`
    users.push({
      name: `Warden ${w}`,
      registerNumber: `W-REG-${100 + w}`,
      username: uname,
      email: uname,
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'Warden',
      department: 'Administration',
      year: 4,
      hostelBlock: blocks[w % blocks.length],
      floor: 1,
      roomNumber: `W-${w}`,
      phone: `99400${10000 + w}`,
      parentName: 'N/A',
      parentPhone: 'N/A',
      bloodGroup: bloodGroups[w % bloodGroups.length],
      gender: w % 2 === 0 ? 'Male' : 'Female',
      attendancePercent: 100,
      feeStatus: 'Paid',
      complaintCount: 0,
      laundryUsage: 0,
      messPlan: 'Staff Plan',
      emergencyContact: `99400${10000 + w}`,
      active: true,
    })
  }

  // 7. Generate 100 Security Staff
  for (let sec = 1; sec <= 100; sec++) {
    const uname = `security_${sec}@srishakthi.ac.in`
    users.push({
      name: `Security Staff ${sec}`,
      registerNumber: `SEC-EMP-${200 + sec}`,
      username: uname,
      email: uname,
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'Security Staff',
      department: 'Security Dept',
      year: 4,
      hostelBlock: blocks[sec % blocks.length],
      floor: 1,
      roomNumber: `Gate-${(sec % 4) + 1}`,
      phone: `99500${10000 + sec}`,
      parentName: 'N/A',
      parentPhone: 'N/A',
      bloodGroup: bloodGroups[sec % bloodGroups.length],
      gender: 'Male',
      attendancePercent: 100,
      feeStatus: 'Paid',
      complaintCount: 0,
      laundryUsage: 0,
      messPlan: 'Staff Plan',
      emergencyContact: `99500${10000 + sec}`,
      active: true,
    })
  }

  // 8. Generate 20 Admins starting with admin_
  const adminTypes = ['main', 'hostel', 'security', 'principal', 'south', 'campus', 'academic', 'it', 'facilities', 'finance', 'sports', 'admin1', 'admin2', 'admin3', 'admin4', 'admin5', 'admin6', 'admin7', 'admin8', 'admin9']
  for (let a = 0; a < 20; a++) {
    const uname = `admin_${adminTypes[a]}@srishakthi.ac.in`
    users.push({
      name: `Chief Admin ${adminTypes[a].toUpperCase()}`,
      registerNumber: `ADM-HQ-${300 + a}`,
      username: uname,
      email: uname,
      passwordHash: DEFAULT_PASSWORD_HASH,
      role: 'Admin',
      department: 'Administration',
      year: 4,
      hostelBlock: 'Admin Block',
      floor: 1,
      roomNumber: `HQ-${a + 1}`,
      phone: `99401${10000 + a}`,
      parentName: 'N/A',
      parentPhone: 'N/A',
      bloodGroup: bloodGroups[a % bloodGroups.length],
      gender: 'Male',
      attendancePercent: 100,
      feeStatus: 'Paid',
      complaintCount: 0,
      laundryUsage: 0,
      messPlan: 'Admin Plan',
      emergencyContact: `99401${10000 + a}`,
      active: true,
    })
  }

  return users
}

export function generateDashboardDatasets() {
  return {
    attendanceCount: 10000,
    visitorLogsCount: 10000,
    complaintsCount: 5000,
    laundryRecordsCount: 5000,
    noticesCount: 1000,
    leaveRequestsCount: 3000,
    feeRecordsCount: 5000,
    notificationsCount: 5000,
    securityLogsCount: 20000,
  }
}
