const mongoose = require("mongoose"); // Import Mongoose for database schema

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // User's name is required
    email: { type: String, required: true, unique: true }, // Email must be unique
    password: { type: String, required: true }, // Password is required
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);



// Export the model
module.exports = mongoose.model("User", userSchema);
