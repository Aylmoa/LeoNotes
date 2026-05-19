import { verifyToken } from '../lib/jwt.js'

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyToken(token)
    req.user = payload // { id, email } disponible en todos los controllers
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}