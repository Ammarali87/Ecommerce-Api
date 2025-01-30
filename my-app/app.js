import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { User } from "./models/userModel.js";


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
 const router = express.Router()

const myroute = router.post('/users', async (req, res) => {
  const {name , email , password } = req.body;
  console.log(name , email , password)
  res.json(
    {
       message:" successfuly make user "},
      name  , email , password 
   )
});
app.use(router, myroute)

app.get('/', (req, res) => {
  const {name } = req.body;
  console.log(name)
  res.send("Hello World")
})









// make fun use async await only in create new no need 
// use try catch 

// const createUsers = async () => {
//   try {
//     // // First method: Using new and save()
//     // const userNew = new User({ 
//     //   name: "Ali",
//     //   age: 25
//     // });
//     // await userNew.save();
//     // console.log('User created using save():', userNew);

//     // Second method: Using create()
   
//     console.log('User created using create():', userNew_);

//   } catch (error) {
//     console.error('Error creating users:', error);
//   }
// };

// Execute the function
// createUsers();











const PORT = process.env.PORT || '4000'
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
