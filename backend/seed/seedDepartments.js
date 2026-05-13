import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../models/department.model.js';

dotenv.config();

const departments = [
  {
    name: "Department of Infrastructure",
    code: "INF",
    description: "Roads, utilities, and waste management",
    slaHours: {
      low: 72,
      medium: 48,
      high: 24,
      emergency: 4,
    },
  },
  {
    name: "Department of Permits & Licensing",
    code: "PER",
    description: "Construction, event, and business permits",
    slaHours: {
      low: 96,
      medium: 72,
      high: 48,
      emergency: 24,
    },
  },
  {
    name: "Department of Public Safety",
    code: "SAF",
    description: "Emergency reporting and incident tracking",
    slaHours: {
      low: 48,
      medium: 24,
      high: 12,
      emergency: 2,
    },
  },
];

const seedDepartments = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aurex';
    await mongoose.connect(mongoUri);

    await Department.deleteMany({});
    await Department.insertMany(departments);

    console.log("Departments seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDepartments();