const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const path       = require('path');
const connectDB  = require('./config/db');
const fs         = require('fs');

// 1. Load Environment Variables
dotenv.config();

// 2. Database Connection
connectDB();

const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Create Uploads folder if not exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. API Routes
// Existing Routes
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));
app.use('/api/inventory',  require('./routes/inventoryRoutes'));

// New Admin & Category Routes
app.use('/api/admin',      require('./routes/adminRoutes'));
app.use('/api/categories', require('./routes/CategoryRoutes'));

// 6. Root Route
app.get('/', (req, res) => {
    res.send('Abdullah VetCare API Running ✅');
});

// 7. Error Handling Middleware (Optional but recommended)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});