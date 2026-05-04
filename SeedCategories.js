const mongoose  = require('mongoose');
const dotenv    = require('dotenv');
const Category  = require('./models/Category');

dotenv.config();

const categories = [
  { name: 'Medicine',    slug: 'medicine',    icon: '💊', description: 'Antibiotics, antiparasitics, antifungals', displayOrder: 1 },
  { name: 'Vaccine',     slug: 'vaccine',     icon: '💉', description: 'Newcastle, Gumboro, Marek\'s, IBD vaccines', displayOrder: 2 },
  { name: 'Supplement',  slug: 'supplement',  icon: '🧪', description: 'Vitamins, minerals, growth boosters', displayOrder: 3 },
  { name: 'Care',        slug: 'care',        icon: '🐔', description: 'Disinfectants, equipment, poultry care', displayOrder: 4 },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log('✅ Categories seeded!');
  process.exit();
}).catch(err => { console.error(err); process.exit(1); });