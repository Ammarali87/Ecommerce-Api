import express from "express"
import { User } from "../models/userModel.js";

const router = express.Router()

 router.post('/amar', 
  async (req, res) => {
  const {name , email , password } = req.body;
  const newUser = await User.create({name,password,email})
   if (!newUser) {
    console.log("error  new user")
   }  
  res.json(
    {
       message:" successfuly make user ",  newUser }
   )
});



export default router



// router.get('/', (req, res) => {
//   res.send("Donkey is hereee 🐴");
// });



