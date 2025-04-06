import { Router } from 'express';
import { protect } from '../controller/authController.js';
import {
  addAddress,
  removeAddress,
  getLoggedUserAddresses
} from '../controller/addressService.js';

const router = Router();

// Protect all address routes
router.use(protect);

router.route('/')
  .post(addAddress)
  .get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

export default router;