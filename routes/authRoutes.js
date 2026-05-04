const express = require('express');
const router  = express.Router();
const { registerUser, loginUser, loginAdmin, createAdmin } = require('../controllers/authController');

router.post('/register',      registerUser);
router.post('/login',         loginUser);
router.post('/admin/login',   loginAdmin);
router.post('/admin/create',  createAdmin); // Sirf ek baar use karo
module.exports = router;