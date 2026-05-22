import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'  
import notesRoutes from './routes/notes.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)  
app.use('/api/notes', notesRoutes)  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})