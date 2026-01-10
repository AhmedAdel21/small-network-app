const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    refreshToken: {
      type: String,
      default: null,
      required: false,
      select: false,
    },
  },
  { timestamps: true }
);

// userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
