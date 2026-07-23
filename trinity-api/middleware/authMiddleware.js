import jwt from 'jsonwebtoken'

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' })
  }

  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET || 'nestos_super_secret_jwt_key_2026'

  try {
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' })
  }
}

export function authorizeRole(...roles) {
  return (req, res, next) => {
    // Super Admin has master authority bypass
    if (req.user && req.user.role === 'Super Admin') {
      return next()
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized access. Insufficient privileges.' })
    }
    next()
  }
}
