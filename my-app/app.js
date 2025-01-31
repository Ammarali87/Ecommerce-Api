import dotenv from 'dotenv'
import express from 'express'
import { connect } from './config/mongo.js'
import amar  from './routes/amar.js';
import { login, logout, signup } from './controller/authController.js';
const app = express()
// v1,v2 Backward Compatibility: 
// all express is middileware  
//  like auth routes use next()
//  to go to other middileware 
const router = express.Router()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dotenv.config()
await connect()
app.use(router, amar)
app.use(router, login)
app.use(router, logout)
app.use(router, signup)
 











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










app.get('/', (req, res) => {
  res.send("Hello World")
})
// app.get('/amar', (req, res) => {
//   res.send("donkey is hereee")
// })

const PORT = process.env.PORT || '4000'
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
