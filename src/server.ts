
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const server = express()
 
// database connection

// middlewares

// routes

const port = process.env.PORT || 5001
server.listen(port, ()=>{
    console.log('server running on ', port)
})

