
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import workoutRoutes from './routes/workout.routes.js'
import goalRoutes from './routes/goal.routes.js'

dotenv.config()

const server = express()
 
// database connection
connectDB().then(()=>{
    console.log('mongodb connected successfully')
}).catch(()=>{
    console.log('connection failed')
})

// middlewares
server.use(express.json())

// routes
server.use('/api/v1/users', authRoutes)
server.use('/api/v1/workouts', workoutRoutes)
server.use('/api/v1/goals', goalRoutes)

// server listens
const port = process.env.PORT || 5001
server.listen(port, ()=>{
    console.log('server running on ', port)
})

