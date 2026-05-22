import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'  
import notesRoutes from './routes/notes.js'
import categoriesRoutes from './routes/categories.js' 
import tagsRoutes from './routes/tags.js'     
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)  
app.use('/api/notes', notesRoutes)  
app.use('/api/categories', categoriesRoutes) 
app.use('/api/tags', tagsRoutes)      

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})