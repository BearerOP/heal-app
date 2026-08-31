const user_model = require("../models/user_model");
const medication_model = require("../models/medication_model");

exports.getAllRelatives = async (req, res) => {
  let user = req.user;
  try {
    if (!user) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    user = await user_model.findOne({ _id: user._id });
    if (!user) {
      return {
        success: false,
        message: "User not found in the database!",
      };
    }

    let allRelativesData = [];
    for (const relative of user.relatives) {
      let relativeData = await user_model
        .findOne({ _id: relative._id })
        .select("-password -auth_key -notificationToken")
        .exec();

      allRelativesData.push(relativeData);
    }
    return {
      success: true,
      message: "All Relatives fetched",
      data: allRelativesData,
    };
  } catch (error) {
    console.error("Error fetching Relatives", error);
    return {
      success: false,
      message: "Error fetching Relatives",
      error: error.message,
    };
  }
};

exports.getRelativeMedication = async (req, res) => {
  let user = req.user;
  let relative_id = req.body.relative_id;
  try {
    if (!user) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    const relativeMedicationData = await medication_model.findOne({user_id:relative_id})
    if(!relativeMedicationData){
        return {
            success: false,
            message: "Relatives' Medication data not fetched",
          };
    }

    return {
      success: true,
      message: "All Relatives' Medication fetched",
      data: relativeMedicationData,
    };
  } catch (error) {
    console.error("Error fetching Relatives' Medication", error);
    return {
      success: false,
      message: "Error fetching Relatives' medication",
      error: error.message,
    };
  }
};
