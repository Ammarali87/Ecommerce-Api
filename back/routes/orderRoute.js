import { Router } from 'express';
import { protect, allowedTo } from '../controller/authController.js';
import {
  createOrder,
  getAllOrders,
  getMyOrder,
  cancelOrder,
  updateOrder
} from '../controller/orderController.js';

const router = Router();

// Protect all order routes  can remove if whant
router.use(protect);

// User routes
router.post('/', allowedTo('user'), createOrder);
router.get('/my-orders', allowedTo('user'), getMyOrder);
router.patch('/cancel/:id', allowedTo('user'), cancelOrder);

// Admin routes
router.use(allowedTo('admin', 'manager'));
router.get('/', getAllOrders);
router.patch('/:id', updateOrder);

export default router;