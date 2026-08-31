const user_model = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TeleSignSDK = require("telesignsdk");

const { getdata } = require("../Utils/redis");
const {sendOtp, verifyOtp} = require("../Utils/sendOtp");
const { getOtp } = require("../Utils/mapstore");
const { generateUserId } = require("../Utils/generate");

exports.user_login = async (req, res) => {
  try {
    const { mobile, password, fcm_token } = req.body;
    const existingUser = await user_model.findOne({ mobile });
    if (!existingUser) {
      return {
        status: 401,
        success: false,
        message: "Invalid mobile number or not registered!",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return {
        status: 401,
        success: false,
        message: "Invalid mobile number or password",
      };
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);
    if (!token) {
      return {
        status: 500,
        success: false,
        message: " Token generation failed"
      };
    }
    // Set the token to cookies
    res.cookie("token", token);
    const authKeyInsertion = await user_model.findOneAndUpdate(
      { _id: existingUser._id },
      { auth_key: token, notificationToken: fcm_token },
      { new: true }
    );

    if (!authKeyInsertion) {
      return {
        status: 500,
        success: false,
        message: "Token updation failed"
      };
    }

    return {
      status: 200,
      message: "User logged in successfully",
      success: true,
      token,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        mobile: existingUser.mobile,
        email: existingUser.email,
      },
    };
  } catch (error) {
    return {
      message: error.message || "Internal server error",
      success: false,
      status: 500,
    };
  }
};

exports.user_register = async (req, res) => {
  const {
    username,
    mobile,
    email,
    password,
    weight,
    height,
    dob,
    gender,
    food_preference,
  } = req.body;
  console.log(req.body);

  try {
    if (!username || !mobile || !password || !weight || !height || !dob) {
      return {
        status: 400,
        message: "Missing required fields",
        success: false,
      };
    }
    if (mobile.length < 10 || mobile.length > 15) {
      return {
        status: 400,
        message: "Mobile number must be between 10 and 15 digits",
        success: false,
      };
    }
    if (password.length < 6 || password.length > 20) {
      return {
        status: 400,
        message: "Password must be between 6 and 20 characters long",
        success: false,
      };
    }
    if (!weight || weight <= 0) {
      return {
        status: 400,
        message: "Weight must be a positive number",
        success: false,
      };
    }
    if (!height || height <= 0) {
      return {
        status: 400,
        message: "Height must be a positive number",
        success: false,
      };
    }
    if (!dob || isNaN(new Date(dob).getTime())) {
      return {
        status: 400,
        message: "Invalid date of birth",
        success: false,
      };
    }
    const existingUser = await user_model.findOne({ mobile });
    if (existingUser) {
      return {
        status: 400,
        message: "User already exists",
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user_model.create({
      userId: generateUserId(),
      username,
      mobile,
      email: email || 'user@example.com',
      password: hashedPassword,
      weight,
      height,
      dob,
      gender,
      food_preference,
    });
    if (newUser) {
      return {
        status: 200,
        message: "User created successfully",
        success: true,
      };
    } else {
      return {
        status: 500,
        message: "User creation failed",
        success: false,
      };
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal server error",
      success: false,
    };
  }
};

exports.user_logout = async (req, res) => {
  let user = req.user;
  try {
    const currentUser = await user_model.findOneAndUpdate(
      { _id: user._id },
      { auth_key: null }
    );
    res.clearCookie("token");
    if (currentUser) {
      return {
        status: 200,
        success: true,
        message: "User logged out successfully",
      };
    } else {
      return {
        status: 500,
        success: false,
        message: "User logout failed",
      };
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal server error",
      success: false,
    };
  }
};
exports.sendOtp = async (req, res) => {
  const {countryCode,mobile} = req.body;
  try {
    const existingUser = await user_model.findOne({ mobile });
    if (existingUser) {
      return {
        status: 400,
        success: false,
        message: "User already exists",
      };
    }
    if (!mobile || mobile.length < 10 || mobile.length > 15) {
      return {
        status: 400,
        success: false,
        message: "Mobile number must be between 10 and 15 digits",
      };
    }
    const result = await sendOtp(mobile);
    

    if (!result.success) {
      return {
        status: 500,
        success: false,
        message: "Failed to send OTP",
      };
    }

    if (result.success) {
      return {
        status: 200,
        success: true,
        message: "OTP sent successfully",
      };
    } else {
      return {
        status: 500,
        success: false,
        message: "Failed to send OTP",
      };
    }
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

exports.verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return {
      status: 400,
      success: false,
      message: "Mobile number and OTP are required",
    };
  }
  if (otp.length !== 6) {
    return {
      status: 400,
      success: false,
      message: "Invalid OTP format",
    };
  }
  try {
    const existingUser = await user_model.findOne({ mobile });
    if (existingUser) {
      return {
        status: 400,
        success: false,
        message: "User already exists",
      };
    }
    const result =  await verifyOtp(mobile, otp);
    
    if (!result.success) {
      return {
        status: 500,
        success: false,
        message: "OTP verification failed",
      };
    }
    return {
      status: 200,
      success: true,
      message: "OTP verified successfully",
    };

  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "An unexpected error occurred",
      error: error,
    };

  }
}

exports.user_profile = async (req, res) => {
  const user = req.user;
  try {
    if (!user) {
      return {
        status: 400,
        success: false,
        message: "User not found",
      };
    }

    return {
      status: 200,
      success: true,
      user:{
        userId: user.userId,
        username: user.username,
        mobile: user.mobile,
        email: user.email,
        weight: user.weight,
        height: user.height,
        dob: user.dob,
        gender: user.gender,
        food_preference: user.food_preference,
        profile_picture: user.profile_picture,
        created_at: user.created_at,
        avatar: user.avatar,
      },
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

exports.allUsers = async (req, res) => {
  const user = req.user;
  try {
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    const users = await user_model
      .find({})
      .select("-password -auth_key")
      .exec();

    if (!users) {
      return {
        success: false,
        message: "Users not fetched",
      };
    }
    return {
      success: false,
      message: "Users data fetched",
      data: users,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error,
    };
  }
};

exports.profile_update = async (req, res) => {
  const user = req.user;
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }
  const { username, height, weight, dob, food_preference } = req.body;

  try {
    if (username) {
      const existingUser = await user_model.findOne({ username: username });
      if (existingUser) {
        return {
          success: false,
          message: "Username already exists, try something else",
        };
      }
    }
    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (height) updatedFields.height = height;
    if (weight) updatedFields.weight = weight;
    if (food_preference) updatedFields.food_preference = food_preference;
    if (dob) updatedFields.dob = new Date(dob);

    updatedFields.updated_at = new Date();

    let updatedData = await user_model.findByIdAndUpdate(
      user._id,
      updatedFields,
      { new: true }
    );
    if (!updatedData) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedData,
    };
  } catch (err) {
    return {
      success: false,
      message: "An error occurred while updating the profile",
      error: err.message,
    };
  }
};

exports.update_Password = async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;
console.log(user);

  try {
    const existingUser = await user_model.findById(user._id);
    if (!existingUser) {
      return {
        status: 400,
        success: false,
        message: "User not found",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    console.log(isPasswordValid);
    
    if (!isPasswordValid) {
      return {
        status: 400,
        success: false,
        message: "Invalid old password",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedPassword = await user_model.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedPassword) {
      return {
        status: 500,
        success: false,
        message: "Password not updated",
      };
    }
    return {
      status: 200,
      success: true,
      message: "Password updated successfully",
    };

  } catch (error) {
    console.log("Error:", error);
    
    return {
      status: 500,
      success: false,
      message: "An unexpected error occurred",
      error: error,
    };

  }
}
