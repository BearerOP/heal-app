const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId:{
    type:String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9]{8,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid userId! It must be at least 8 alphanumeric characters.`,
    },
  },
  username: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    default: 'user@example.com',
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/dvo4tvvgb/image/upload/v1737770516/Profile/image.jpg",
  },
  weight: {
    type: Number, // User's weight in kilograms
    required: true,
  },
  height: {
    type: Number, // User's height in centimeters
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "transMale", "transFemale", "nonBinary"],
  },
  food_preference: {
    type: String,
    enum: ["vegetarian", "nonVegetarian", "vegan", "other"],
    default: "other",
  },
  auth_key: {
    type: String,
    default: null,
  },
  notificationToken: {
    type: String,
    default: null,
  },
  connections: [mongoose.Schema.Types.ObjectId],
  requests: [
    {
      sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"],
      },
      send_to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
