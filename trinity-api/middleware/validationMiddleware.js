export function validateSriShakthiEmail(req, res, next) {
  const usernameInput = req.body.username || req.body.email || ''
  const trimmed = String(usernameInput).trim().toLowerCase()

  if (!trimmed || !trimmed.includes('@') || !trimmed.endsWith('@srishakthi.ac.in')) {
    return res.status(400).json({ error: 'Please login using your official Sri Shakthi Institute email.' })
  }

  req.body.validatedUsername = trimmed
  next()
}

export function validatePassword(req, res, next) {
  const password = req.body.password || ''
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Incorrect password.' })
  }

  if (password.length < 8 || password.length > 32) {
    return res.status(400).json({ error: 'Incorrect password.' })
  }

  next()
}
