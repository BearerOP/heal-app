const { storage } = require("../../public/assets/firebaseConfig.js");
const { ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const user_model = require("../models/user_model");


exports.profile_picture = async (req, res) => {
  const user = req.user;
  if (!user) {
    return {
      success: false,
      message: "User not found",
    }
  }
  let file = req.file;
  if (!file) {
    return{
      success: false,
      message: "No file uploaded",
    }
  }

  try {
    const storageRef = ref(storage, `profile_pictures/${user.username}`);

    // Create file metadata including the content type
    const metadata = {
      contentType: file.mimetype,
    };

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update user's profile picture URL
    const updatedUser = await user_model.findByIdAndUpdate(
      user._id,
      { picture: downloadURL, updated_at: new Date() },
      { new: true }
    );

    if (!updatedUser) {
      return{
        success: false,
        message: "User not found",
      }
    }

    console.log('File successfully uploaded.');
    return{
      success: true,
      message: 'File uploaded to Firebase Storage',
      data: {
        name: file.originalname,
        type: file.mimetype,
        downloadURL: downloadURL,
      },
    }
  } catch (err) {
    console.error("Error uploading file: ", err);
    return {
      success: false,
      message: "An error occurred while uploading the profile picture",
      error: err.message,
    }
  }
};
