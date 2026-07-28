/**
 * Role → allowed console routes. Keep Sidebar + MobileDrawer in sync via this.
 */
export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', roles: ['Warden', 'Student', 'Laundry Staff'] },
  { to: '/room-details', label: 'Room Details', roles: ['Warden', 'Student'] },
  { to: '/attendance', label: 'Attendance', roles: ['Warden', 'Student'] },
  { to: '/leave', label: 'Leave / Outpass', roles: ['Warden', 'Student'] },
  { to: '/notices', label: 'Hostel Notices', roles: ['Warden', 'Student', 'Laundry Staff'] },
  { to: '/fees', label: 'Fee Status', roles: ['Warden', 'Student'] },
  { to: '/complaints', label: 'Complaint Portal', roles: ['Warden', 'Student'] },
  { to: '/mess', label: 'Mess Management', roles: ['Warden', 'Student'] },
  { to: '/laundry', label: 'Laundry', roles: ['Warden', 'Student', 'Laundry Staff'] },
  { to: '/lost-found', label: 'Lost & Found', roles: ['Warden', 'Student', 'Laundry Staff'] },
  { to: '/visitors', label: 'Visitor Management', roles: ['Warden'] },
  { to: '/sos', label: 'Emergency SOS', roles: ['Warden', 'Student', 'Laundry Staff'] },
  { to: '/inspection', label: 'Room Inspection', roles: ['Warden', 'Student'] },
  { to: '/inventory', label: 'Inventory', roles: ['Warden', 'Student'] },
  { to: '/analytics', label: 'Analytics', roles: ['Warden'] },
  { to: '/security', label: 'Security (GuardianAI)', roles: ['Warden'] },
  { to: '/config', label: 'Configuration', roles: ['Warden'] },
  { to: '/settings', label: 'Settings', roles: ['Warden', 'Student', 'Laundry Staff'] },
]

export function navForRole(role) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role || 'Student'))
}

export function canAccessPath(role, path) {
  const item = NAV_ITEMS.find((n) => n.to === path)
  if (!item) return true
  return item.roles.includes(role || 'Student')
}
