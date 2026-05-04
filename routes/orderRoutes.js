const express  = require('express');
const router   = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, getDashboardStats } = require('../controllers/orderController');
const { adminProtect } = require('../middleware/adminMiddleware');

router.post('/',              createOrder);
router.get('/',               adminProtect, getOrders);
router.get('/stats',          adminProtect, getDashboardStats);
router.get('/:id',            getOrderById);
router.put('/:id/status',     adminProtect, updateOrderStatus);
module.exports = router;