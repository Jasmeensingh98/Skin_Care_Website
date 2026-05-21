import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';

dotenv.config();

async function seedDermatologist() {
  const mongoUri = process.env.DB || 'mongodb://localhost:27017/vulpine';
  await mongoose.connect(mongoUri);

  const email = 'derm@vulpine.com';
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'dermatologist';
    await existing.save();
    console.log('Updated existing user to dermatologist:', email);
  } else {
    await User.create({
      name: 'Dr. Vulpine',
      email,
      password: 'derm123456',
      phone: '9876543210',
      role: 'dermatologist',
    });
    console.log('Created dermatologist account:', email, 'password: derm123456');
  }

  await mongoose.disconnect();
}

seedDermatologist().catch((e) => {
  console.error(e);
  process.exit(1);
});
