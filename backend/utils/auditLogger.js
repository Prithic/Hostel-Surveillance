import { AuditLog } from '../models/AuditLog.js'

export async function logAuditAction(userOrReq, action, details = '') {
  try {
    const user = userOrReq.user || userOrReq
    const ipAddress = userOrReq.ip || userOrReq.headers?.['x-forwarded-for'] || '127.0.0.1'

    const logEntry = {
      userId: String(user.id || user._id || user.username || 'System'),
      username: String(user.username || 'System'),
      role: String(user.role || 'System'),
      action,
      details,
      ipAddress,
    }

    console.log(`[Audit Log] User: ${logEntry.username} (${logEntry.role}) | Action: ${action} | ${details}`)

    try {
      await AuditLog.create(logEntry)
    } catch (dbErr) {
      // MongoDB in-memory or connection bypass
    }

    return logEntry
  } catch (err) {
    console.warn(`[Audit Log Error]: ${err.message}`)
  }
}
