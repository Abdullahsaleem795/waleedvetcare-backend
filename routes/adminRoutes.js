// const express = require('express');
// const router  = express.Router();
// const {
//   getAdminProfile,
//   getAllUsers,
//   getUserById,
//   getDashboardStats,
//   getRecentOrders,
//   getCategoryStats,
// } = require('../controllers/adminController');
// const { adminProtect } = require('../middleware/adminMiddleware');

// router.get('/profile',        adminProtect, getAdminProfile);
// router.get('/users',          adminProtect, getAllUsers);
// router.get('/users/:id',      adminProtect, getUserById);
// router.get('/dashboard',      adminProtect, getDashboardStats);
// router.get('/recent-orders',  adminProtect, getRecentOrders);
// router.get('/category-stats', adminProtect, getCategoryStats);

// module.exports = router;
const express = require('express');
const router  = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  getAllUsers,
  getUserById,
  getDashboardStats,
  getRecentOrders,
  getCategoryStats,
} = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminMiddleware');

// Public Route
router.post('/login', loginAdmin);

// Private/Protected Routes (In sab ke liye token chahiye hoga)
router.get('/profile',        adminProtect, getAdminProfile);
router.get('/users',          adminProtect, getAllUsers);
router.get('/users/:id',      adminProtect, getUserById);
router.get('/dashboard',      adminProtect, getDashboardStats);
router.get('/recent-orders',  adminProtect, getRecentOrders);
router.get('/category-stats', adminProtect, getCategoryStats);

module.exports = router;