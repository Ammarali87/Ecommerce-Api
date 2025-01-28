import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
// import { productRouter } from './routs/prodcutRoute' // Corrected import name
// import { CartModel } from './moduls/cartModel'
// import { seedRouter } from './routs/seedRoute'
// import { userRouter } from './routs/userRoute'
// import { ProductModel } from './moduls/productModel'

dotenv.config()

const MONGODB_URI ="mongodb+srv://amar:Kofta@store.abadx.mongodb.net/?retryWrites=true&w=majority&appName=Store"
//   process.env.MONGODB_URI || 'mongodb://localhost/tsmernamazonadb'
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
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'], // Make sure this matches your frontend URL
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use('/api/products', productRouter)
// app.use('/api/users', userRouter)
// app.use('/api/seed', seedRouter)


// app.get('*', (req, res) =>
//   res.sendFile(path.join
//     (__dirname, './public')) // Make sure index.html is being served
// )

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
