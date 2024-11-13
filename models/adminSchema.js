const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const connect = require("../dbConnection");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase : true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase : true
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


// Pre-save hook to hash the password if it has been modified
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
  }
  next(); // Proceed to save the admin
});

// Optionally, you can create a method to compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = connect.sattaFastDB.model("Admins", adminSchema);
