import jwt from 'jsonwebtoken'

export function generateAccessToken(user) {
  const secret = process.env.JWT_SECRET || 'nestos_super_secret_jwt_key_2026'
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d'

  return jwt.sign(
    {
      id: user._id || user.id,
      username: user.username,
      role: user.role,
    },
    secret,
    { expiresIn }
  )
}

export function generateRefreshToken(user) {
  const secret = process.env.JWT_REFRESH_SECRET || 'nestos_super_secret_refresh_jwt_key_2026'
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

  return jwt.sign(
    {
      id: user._id || user.id,
      username: user.username,
    },
    secret,
    { expiresIn }
  )
}
