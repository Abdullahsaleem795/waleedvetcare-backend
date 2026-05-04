const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Create new order (Guest or Logged-in User)
// @route   POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
    const { 
        customer, 
        items, 
        subtotal, 
        deliveryCharges, 
        totalAmount, 
        paymentMethod 
    } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('Order items khali nahi ho sakte');
    }

    // 1. Stock check aur update logic
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product || product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Product "${item.name}" ka stock khatam hai ya kam hai`);
        }
        // Stock kam karein
        product.stock -= item.quantity;
        await product.save();
    }

    // 2. Order Create karein (User ID optional hai, guest ke liye null rahegi)
    const order = await Order.create({
        user: req.user ? req.user._id : null,
        customer,
        items,
        subtotal,
        deliveryCharges,
        totalAmount,
        paymentMethod,
    });

    res.status(201).json(order);
});

// @desc    Get all orders for Admin
// @route   GET /api/orders
exports.getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().sort('-createdAt');
    res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order nahi mila');
    }
});

// @desc    Dashboard Stats Logic
// @route   GET /api/orders/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Orders count karein
    const totalOrders = await Order.countDocuments();

    // 2. Aaj ke naye orders
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ 
        createdAt: { $gte: startOfToday } 
    });

    // 3. REAL REVENUE: Sirf 'delivered' orders ka paisa count hoga
    const revenueStats = await Order.aggregate([
        { $match: { status: 'delivered' } }, 
        { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
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

// Single Order Detail
exports.getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    res.json(order);
});