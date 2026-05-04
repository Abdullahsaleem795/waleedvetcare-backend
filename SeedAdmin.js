const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const admins = require('./admins.json');

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/WaleedVetCare');
    console.log('✅ Connected specifically to WaleedVetCare DB');

    await Admin.deleteMany({});
    console.log('🗑️ Old data cleared.');

    // Har admin ka password yahan hash hoga
    const hashedAdmins = await Promise.all(admins.map(async (admin) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admin.password, salt);
      return { ...admin, password: hashedPassword };
    }));

    await Admin.insertMany(hashedAdmins);
    
    console.log('🚀 SUCCESS: Admin data with hashed passwords imported!');
    process.exit();
  } catch (error) {
    console.error(`❌ ERROR: ${error.message}`);
    process.exit(1);
  }
};

seedData();