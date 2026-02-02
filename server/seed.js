const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");
const Task = require("./models/Task");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const users = await User.create([
      {
        name: "Alice Admin",
        email: "alice@example.com",
        password: hashedPassword,
      },
      {
        name: "Bob Builder",
        email: "bob@example.com",
        password: hashedPassword,
      },
    ]);

    console.log("Users Created");

    // Create Tasks
    const tasks = await Task.create([
      {
        user: users[0]._id,
        title: "Review Project Requirements",
        description: "Analyze the PDF document and extract key features.",
        status: "completed",
        dueDate: new Date(),
      },
      {
        user: users[0]._id,
        title: "Design Database Schema",
        description: "Create Mongoose models for Users and Tasks.",
        status: "in-progress",
        dueDate: new Date(Date.now() + 86400000),
      },
      {
        user: users[1]._id,
        title: "Frontend Setup",
        description: "Initialize Vite React app with Tailwind CSS.",
        status: "pending",
        dueDate: new Date(Date.now() + 172800000),
      },
    ]);

    console.log("Tasks Created");
    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
