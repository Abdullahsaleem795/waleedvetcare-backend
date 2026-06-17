const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Helper function to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Auth admin & get token
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// REAL-TIME DASHBOARD LOGIC
exports.getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Orders
    const totalOrders = await Order.countDocuments();

    // 2. Today's Orders
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ 
        createdAt: { $gte: startOfToday } 
    });

    // 3. Total Revenue (all statuses except cancelled)
    const revenueStats = await Order.aggregate([
        { 
            $match: { 
                status: { 
                    $nin: ['cancelled', 'Cancelled', 'canceled', 'Canceled'] 
                } 
            } 
        },
        { 
            $group: { 
                _id: null, 
                totalSales: { $sum: "$totalAmount" } 
            } 
        }
    ]);
    const totalSales = revenueStats.length > 0 ? revenueStats[0].totalSales : 0;

    // 4. Total Products
    const totalProducts = await Product.countDocuments();

    res.json({
        totalOrders,
        todayOrders,
        totalSales,
        totalProducts
    });
});

// Baqi functions
exports.getAdminProfile = asyncHandler(async (req, res) => { res.json(req.admin); });
exports.getAllUsers = asyncHandler(async (req, res) => { res.json({ message: "Users list" }); });
exports.getUserById = asyncHandler(async (req, res) => { res.json({ message: "User details" }); });
exports.getRecentOrders = asyncHandler(async (req, res) => { 
    const recent = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json(recent); 
});
exports.getCategoryStats = asyncHandler(async (req, res) => { res.json([]); });