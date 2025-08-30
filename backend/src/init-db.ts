import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from './models/Resource';

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_bed_alloc';

async function initializeDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if ICU_BED resource exists
    const existingICU = await Resource.findOne({ name: 'ICU_BED' });

    if (!existingICU) {
      // Create initial ICU resource with 10 total beds
      await Resource.create({
        name: 'ICU_BED',
        totalUnits: 10,
        allocatedUnits: 0,
      });
      console.log('Created initial ICU_BED resource with 10 total beds');
    } else {
      console.log('ICU_BED resource already exists:', existingICU);
    }

    await mongoose.disconnect();
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
