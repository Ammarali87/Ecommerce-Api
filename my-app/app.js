import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { User } from "./models/userModel";


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



if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  console.log("morgan enable in dev")
}
app.get('/', (req, res) => {
  res.send("Hello World")
})









// make fun use async await only in create new no need 
// use try catch 

const createUsers = async () => {
  try {
    // // First method: Using new and save()
    // const userNew = new User({ 
    //   name: "Ali",
    //   age: 25
    // });
    // await userNew.save();
    // console.log('User created using save():', userNew);

    // Second method: Using create()
    const userNew_ = await User.create({ 
      name: "Ahmed",
      age: 30
    });
    console.log('User created using create():', userNew_);

  } catch (error) {
    console.error('Error creating users:', error);
  }
};

// Execute the function
createUsers();











const PORT = process.env.PORT || '4000'
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
