import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const menuItems = [
  { name: 'Lemon Juice', nameBn: 'লেমন জুস', price: 35, category: 'juice', description: 'Fresh lemon juice' },
  { name: 'Mint Lemon', nameBn: 'মিন্ট লেমন', price: 45, category: 'juice', description: 'Refreshing mint with lemon' },
  { name: 'Tamarind Juice', nameBn: 'তেঁতুল জুস', price: 35, category: 'juice', description: 'Tangy tamarind drink' },
  { name: 'Malta Juice', nameBn: 'মাল্টা জুস', price: 100, category: 'juice', description: 'Fresh Malta orange juice' },
  { name: 'Raw Mango Juice', nameBn: 'কাঁচা আমের জুস', price: 50, category: 'juice', description: 'Raw mango summer drink' },
  { name: 'Ripe Mango Juice', nameBn: 'পাকা আমের জুস', price: 60, category: 'juice', description: 'Sweet ripe mango juice' },
  { name: 'Papaya Juice', nameBn: 'পেঁপে জুস', price: 40, category: 'juice', description: 'Fresh papaya juice' },
  { name: 'Wood Apple Juice', nameBn: 'বেল জুস', price: 40, category: 'juice', description: 'Wood apple refreshment' },
  { name: 'Chocolate Juice', nameBn: 'চকলেট জুস', price: 80, category: 'juice', description: 'Rich chocolate drink' },
  { name: 'Tokma Lemon', nameBn: 'তোকমা লেবু', price: 25, category: 'juice', description: 'Roasted gram with lemon' },
  { name: 'Chili Lemon', nameBn: 'চিলি লেমন', price: 30, category: 'juice', description: 'Spicy chili lemon drink' },
  { name: 'Orange Juice', nameBn: 'অরেঞ্জ জুস', price: 30, category: 'juice', description: 'Fresh orange juice' },
  { name: 'Cumin Water', nameBn: 'জিরা পানি', price: 40, category: 'juice', description: 'Cumin infused water' },
  { name: 'Watermelon Juice', nameBn: 'তরমুজের জুস', price: 50, category: 'juice', description: 'Fresh watermelon juice' },
  { name: 'Lassi', nameBn: 'লাচ্ছি', price: 70, category: 'lassi', description: 'Traditional yogurt drink' },
  { name: 'Chocolate Lassi', nameBn: 'চকলেট লাচ্ছি', price: 100, category: 'lassi', description: 'Chocolate flavored lassi' },
  { name: 'Chocolate Milkshake', nameBn: 'চকলেট মিল্ক শেক', price: 90, category: 'milkshake', description: 'Creamy chocolate milkshake' },
  { name: 'Date Milkshake', nameBn: 'খেজুর মিল্ক শেক', price: 80, category: 'milkshake', description: 'Dates and milk blend' },
  { name: 'Date Almond Milkshake', nameBn: 'খেজুর বাদাম শেক', price: 100, category: 'milkshake', description: 'Dates and almonds milkshake' },
  { name: 'Vanilla Milkshake', nameBn: 'ভ্যানিলা মিল্ক শেক', price: 90, category: 'milkshake', description: 'Classic vanilla milkshake' },
  { name: 'Papaya Milkshake', nameBn: 'পেঁপে শেক', price: 60, category: 'milkshake', description: 'Papaya milkshake' },
  { name: 'Mango Milkshake', nameBn: 'আমের শেক', price: 70, category: 'milkshake', description: 'Sweet mango milkshake' },
  { name: 'Cold Coffee', nameBn: 'কোল্ড কফি', price: 80, category: 'coldcoffee', description: 'Iced coffee' },
  { name: 'Chocolate Cold Coffee', nameBn: 'চকলেট কোল্ড কফি', price: 100, category: 'coldcoffee', description: 'Chocolate iced coffee' },
  { name: 'Color Tea', nameBn: 'রং চা', price: 10, category: 'colorTea', description: 'Simple color tea' },
  { name: 'Special Color Tea', nameBn: 'স্পেশাল রং চা', price: 15, category: 'colorTea', description: 'Special color tea' },
  { name: 'Malta Tea', nameBn: 'মাল্টা চা', price: 30, category: 'colorTea', description: 'Malta flavored tea' },
  { name: 'Lemon Tea', nameBn: 'লেমন টি', price: 25, category: 'colorTea', description: 'Lemon flavored tea' },
  { name: 'Green Chili Tea', nameBn: 'মরিচ চা', price: 20, category: 'colorTea', description: 'Spicy green chili tea' },
  { name: 'Green Tea', nameBn: 'গ্রীন টি', price: 20, category: 'colorTea', description: 'Healthy green tea' },
  { name: 'Tulsi Tea', nameBn: 'তুলসি টি', price: 20, category: 'colorTea', description: 'Holy basil tea' },
  { name: 'Tamarind Tea', nameBn: 'তেঁতুল টি', price: 35, category: 'colorTea', description: 'Tamarind infused tea' },
  { name: 'Condensed Milk Tea', nameBn: 'কনডেন্স মিল্কের চা', price: 10, category: 'milkTea', description: 'Sweet condensed milk tea' },
  { name: 'Powder Milk Tea', nameBn: 'পাউডার দুধের চা', price: 20, category: 'milkTea', description: 'Powder milk tea' },
  { name: 'Date Jaggery Tea', nameBn: 'খেজুরের গুড়ের চা', price: 30, category: 'milkTea', description: 'Date jaggery tea' },
  { name: 'Almond Tea', nameBn: 'বাদাম চা', price: 30, category: 'milkTea', description: 'Almond flavored tea' },
  { name: 'Chocolate Tea', nameBn: 'চকলেট চা', price: 50, category: 'milkTea', description: 'Chocolate tea' },
  { name: 'Coffee Tea', nameBn: 'কফি চা', price: 30, category: 'milkTea', description: 'Coffee mixed tea' },
  { name: 'Milk Coffee', nameBn: 'মিল্ক কফি', price: 50, category: 'coffee', description: 'Milk coffee' },
  { name: 'Cream Milk Coffee', nameBn: 'ক্রিম মিল্ক কফি', price: 80, category: 'coffee', description: 'Creamy milk coffee' },
  { name: 'Cappuccino Coffee', nameBn: 'ক্যাপাচিনো কফি', price: 100, category: 'coffee', description: 'Cappuccino' },
  { name: 'Chocolate Coffee', nameBn: 'চকলেট কফি', price: 100, category: 'coffee', description: 'Chocolate coffee' },
  { name: 'Almond Coffee', nameBn: 'বাদাম কফি', price: 100, category: 'coffee', description: 'Almond coffee' },
  { name: 'Black Coffee', nameBn: 'ব্ল্যাক কফি', price: 30, category: 'coffee', description: 'Black coffee' }
];

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('hridoy_tea_2026', 12);

  await prisma.user.upsert({
    where: { username: 'admin_hridoy' },
    update: {},
    create: {
      username: 'admin_hridoy',
      password: hashedPassword,
      role: 'admin'
    }
  });
  console.log('Admin user created.');

  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({
      where: { name: item.name }
    });
    if (!existing) {
      await prisma.menuItem.create({ data: item });
    }
  }
  console.log(`Created ${menuItems.length} menu items.`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });