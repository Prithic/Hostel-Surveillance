// ---------------------------------------------------------------------------
// Dummy data layer — simulates a backend API.
// Replace fetchX() functions with real network calls when the backend
// (being built separately) is ready. Every function returns a Promise so
// swapping in `fetch()` later requires no changes to calling components.
// ---------------------------------------------------------------------------

export const currentUser = {
  name: 'Aarav Mehta',
  email: 'student@gmail.com',
  room: 'B-204',
  block: 'Block B',
  avatarColor: '#2563EB',
  studentId: 'HS-2026-0417',
}

export const statSummary = {
  attendance: 92,
  room: 'B-204',
  pendingComplaints: 2,
  feeStatus: 'Paid',
  todayMenu: 'Paneer Butter Masala',
  laundryStatus: 'Washing',
}

export const roomInfo = [
  { label: 'Room Number', value: 'B-204' },
  { label: 'Hostel Block', value: 'Block B' },
  { label: 'Floor', value: '2nd Floor' },
  { label: 'Room Type', value: 'Twin Sharing' },
  { label: 'Warden Name', value: 'Mrs. Kavita Rao' },
  { label: 'Caretaker', value: 'Mr. Suresh Nair' },
  { label: 'Contact Number', value: '+91 98765 43210' },
]

export const roommates = [
  { name: 'Rohit Sharma', course: 'B.Tech CSE, 2nd Year' },
  { name: 'Aarav Mehta', course: 'B.Tech CSE, 2nd Year' },
]

export const attendanceLog = [
  { date: '2026-07-20', checkIn: '08:02 AM', checkOut: '09:55 PM', status: 'Present', method: 'Face Recognition' },
  { date: '2026-07-19', checkIn: '08:10 AM', checkOut: '09:40 PM', status: 'Present', method: 'QR Code' },
  { date: '2026-07-18', checkIn: '—', checkOut: '—', status: 'Absent', method: '—' },
  { date: '2026-07-17', checkIn: '07:58 AM', checkOut: '10:02 PM', status: 'Present', method: 'Face Recognition' },
  { date: '2026-07-16', checkIn: '08:20 AM', checkOut: '09:30 PM', status: 'Present', method: 'QR Code' },
]

export const attendanceTrend = [
  { day: 'Mon', pct: 100 }, { day: 'Tue', pct: 100 }, { day: 'Wed', pct: 0 },
  { day: 'Thu', pct: 100 }, { day: 'Fri', pct: 100 }, { day: 'Sat', pct: 100 }, { day: 'Sun', pct: 100 },
]

export const complaints = [
  { id: 'CMP-104', category: 'WiFi', description: 'Weak signal in room B-204', status: 'In Progress', date: '2026-07-19' },
  { id: 'CMP-101', category: 'Electricity', description: 'Flickering tube light', status: 'Pending', date: '2026-07-17' },
  { id: 'CMP-098', category: 'Cleaning', description: 'Washroom needs cleaning', status: 'Completed', date: '2026-07-10' },
]

export const complaintCategories = [
  'Water Leakage', 'Fan', 'Electricity', 'WiFi', 'Cleaning', 'Washroom', 'Bullying', 'Ragging', 'Missing Item',
]

export const notices = [
  { id: 1, type: 'Holiday', title: 'Independence Day — Mess closed after 8 PM', date: '2026-08-15' },
  { id: 2, type: 'Maintenance', title: 'Elevator maintenance in Block B', date: '2026-07-24' },
  { id: 3, type: 'Water Shutdown', title: 'Water supply off 2–4 PM tomorrow', date: '2026-07-23' },
  { id: 4, type: 'Exam Notice', title: 'Semester exam timetable released', date: '2026-07-22' },
]

export const events = [
  { id: 1, title: 'Cultural Night', date: '2026-07-28' },
  { id: 2, title: 'Sports Meet Finals', date: '2026-08-02' },
]

export const feeStatus = {
  paid: 42000,
  pending: 0,
  dueDate: '2026-08-10',
  amount: 42000,
}

export const paymentHistory = [
  { id: 'PMT-2201', date: '2026-01-05', amount: 21000, status: 'Paid', mode: 'UPI' },
  { id: 'PMT-2205', date: '2026-06-05', amount: 21000, status: 'Paid', mode: 'Card' },
]

export const todayMenu = {
  breakfast: 'Idli, Sambar, Chutney',
  lunch: 'Rice, Dal, Paneer Butter Masala, Salad',
  snacks: 'Samosa & Tea',
  dinner: 'Chapati, Mixed Veg, Curd',
}

export const mealTimings = {
  breakfast: '7:30 AM – 9:00 AM',
  lunch: '12:30 PM – 2:00 PM',
  snacks: '5:00 PM – 6:00 PM',
  dinner: '7:00 PM – 9:00 PM',
}

export const laundrySlots = ['7:00 AM', '9:00 AM', '2:00 PM', '4:00 PM', '6:00 PM']

export const laundryTracking = [
  { id: 'LDY-3391', item: 'Bedsheet + 4 clothes', status: 'Washing', qr: 'LDY-3391-QR' },
]

export const lostAndFoundItems = [
  { id: 1, name: 'Wallet', location: 'Mess Hall', date: '2026-07-18' },
  { id: 2, name: 'Phone Charger', location: 'Study Hall', date: '2026-07-17' },
  { id: 3, name: 'ID Card', location: 'Block B Lobby', date: '2026-07-15' },
  { id: 4, name: 'Keys', location: 'Laundry Room', date: '2026-07-14' },
]

export const visitors = [
  { id: 'VIS-551', name: 'Rakesh Mehta', relation: 'Father', phone: '98xxxxxx10', entry: '10:00 AM', exit: '11:30 AM', date: '2026-07-19' },
]

export const inventory = [
  { item: 'Bed', qty: 1, condition: 'Good' },
  { item: 'Chair', qty: 1, condition: 'Good' },
  { item: 'Table', qty: 1, condition: 'Needs Repair' },
  { item: 'Fan', qty: 1, condition: 'Good' },
  { item: 'Cupboard', qty: 1, condition: 'Good' },
  { item: 'Light', qty: 2, condition: 'Good' },
  { item: 'Window', qty: 1, condition: 'Good' },
]

export const inspections = [
  { id: 1, date: '2026-06-15', result: 'Passed', remarks: 'Room tidy, no issues' },
  { id: 2, date: '2026-05-15', result: 'Warning', remarks: 'Table found damaged' },
]

export const leaveRequests = [
  { id: 'LV-014', reason: 'Family function', from: '2026-07-28', to: '2026-07-30', status: 'Approved', appliedOn: '2026-07-20' },
  { id: 'LV-011', reason: 'Medical appointment', from: '2026-07-10', to: '2026-07-12', status: 'Approved', appliedOn: '2026-07-08' },
  { id: 'LV-009', reason: 'Personal work', from: '2026-06-15', to: '2026-06-16', status: 'Rejected', appliedOn: '2026-06-12' },
  { id: 'LV-016', reason: 'Home visit', from: '2026-08-05', to: '2026-08-08', status: 'Pending', appliedOn: '2026-07-21' },
]

export const notificationPrefs = {
  complaintUpdates: true,
  noticeAlerts: true,
  feeReminders: true,
  laundryReady: false,
  messFeedback: false,
}

export const emergencyContacts = [
  { name: 'Security Desk', role: 'Security', phone: '+91 98765 43210' },
  { name: 'Mrs. Kavita Rao', role: 'Warden', phone: '+91 98765 11223' },
  { name: 'Rakesh Mehta', role: 'Parent', phone: '+91 98765 43221' },
]

export const securityAlerts = [
  { id: 1, level: 'high', title: 'Unrecognized face flagged at Gate 2', time: '11:42 PM', status: 'Reviewing' },
  { id: 2, level: 'medium', title: 'Motion detected — Block B stairwell', time: '10:15 PM', status: 'Cleared' },
  { id: 3, level: 'low', title: 'Visitor overstay — Gate 1', time: '08:20 PM', status: 'Resolved' },
]

export const cameraFeeds = [
  { id: 1, name: 'Main Gate', status: 'online' },
  { id: 2, name: 'Block A Corridor', status: 'online' },
  { id: 3, name: 'Block B Stairwell', status: 'online' },
  { id: 4, name: 'Mess Hall', status: 'offline' },
]

export const analytics = {
  attendance: [
    { month: 'Feb', value: 88 }, { month: 'Mar', value: 90 }, { month: 'Apr', value: 85 },
    { month: 'May', value: 93 }, { month: 'Jun', value: 91 }, { month: 'Jul', value: 92 },
  ],
  complaintsTrend: [
    { month: 'Feb', count: 12 }, { month: 'Mar', count: 9 }, { month: 'Apr', count: 14 },
    { month: 'May', count: 7 }, { month: 'Jun', count: 10 }, { month: 'Jul', count: 6 },
  ],
  messRatings: [
    { day: 'Mon', rating: 4.1 }, { day: 'Tue', rating: 3.8 }, { day: 'Wed', rating: 4.4 },
    { day: 'Thu', rating: 4.0 }, { day: 'Fri', rating: 4.6 }, { day: 'Sat', rating: 3.9 }, { day: 'Sun', rating: 4.2 },
  ],
  occupancy: [
    { name: 'Occupied', value: 312 }, { name: 'Vacant', value: 28 },
  ],
}

export const chatbotFAQ = {
  'mess timings': "Breakfast 7:30–9:00 AM, Lunch 12:30–2:00 PM, Snacks 5–6 PM, Dinner 7–9 PM.",
  'laundry timings': 'Laundry slots run 7 AM to 7 PM. Book a slot from the Laundry page.',
  'study hall': 'The study hall on Floor 2 is open 6 AM – 11 PM daily.',
  'gym timings': 'The gym is open 5 AM – 9 PM, closed on Sundays.',
  'wifi password': "For security, WiFi credentials are sent to your registered email — check the Notices page.",
  'hostel rules': 'Curfew is 10 PM on weekdays, 11 PM on weekends. Full rulebook is on the Notices page.',
  'leave process': "Go to Leave Management, fill the form with reason and dates, and your warden will approve it.",
  'emergency contact': 'Security Desk: +91 98765 43210. You can also use the SOS button for one-tap alerts.',
  'complaint status': 'Check the Complaint Portal page — every complaint shows a live status badge.',
  'when is dinner': 'Dinner is from 7 PM to 9 PM.',
}

export const quickQuestions = [
  'Mess Timings', 'Laundry Timings', 'Study Hall', 'Gym Timings', 'WiFi Password',
  'Hostel Rules', 'Leave Process', 'Emergency Contact', 'Complaint Status',
]

// Simulated async "API" — swap for real fetch() when backend is connected.
export function fakeApi(data, delay = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}

