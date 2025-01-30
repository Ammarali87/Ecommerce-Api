import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
// import { productRouter } from './routs/prodcutRoute' // Corrected import name

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/ecommerce'

mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB') // Improved logging
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error) // More specific error logging
  })
  
  const app = express()
  app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res) => {
  res.send("Hello World")
})



if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  console.log("morgan enable in dev")
}

const PORT = process.env.PORT || '4000'
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
