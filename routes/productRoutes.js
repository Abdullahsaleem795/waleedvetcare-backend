const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { adminProtect } = require('../middleware/adminMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/',           getProducts);
router.get('/:id',        getProductById);
router.post('/',          adminProtect, upload.single('image'), createProduct);
router.put('/:id',        adminProtect, upload.single('image'), updateProduct);
router.delete('/:id',     adminProtect, deleteProduct);
module.exports = router;