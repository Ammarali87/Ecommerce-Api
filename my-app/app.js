import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
// import { productRouter } from './routs/prodcutRoute' // Corrected import name

dotenv.config()

const MONGODB_URI = "mongodb+srv://amar:Kofta@store.abadx.mongodb.net/?retryWrites=true&w=majority&appName=Store"
  // process.env.MONGODB_URI || 'mongodb://localhost/ecommerce'

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

// app.use('/api/products', productRouter)



app.get('/', (req, res) => {
  res.send("Hello World")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


const PORT = process.env.PORT || '4000'

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
