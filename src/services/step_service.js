const mongoose = require("mongoose");
const step_model = require("../models/step_model.js");

exports.add_step = async (req, res) => {
  const user = req.user;
  const { date, stepsIncrement } = req.body; // Using updatedSteps from frontend
  const formattedDate = new Date(`${date}T00:00:00.000Z`);
  const updatedSteps = stepsIncrement;

  try {
    let stepData = await step_model.findOne({
      user_id: user._id,
    });

    if (!stepData) {
      // Create new document if no record found
      stepData = new step_model({
        user_id: user._id,
        record: [],
      });
    }

    // Find index of the existing record with the same date
    const existingRecordIndex = stepData.record.findIndex(
      (record) => record.date.getTime() === formattedDate.getTime()
    );

    if (existingRecordIndex !== -1) {
      // Update existing record with new steps value
      stepData.record[existingRecordIndex].steps = updatedSteps; // Update steps directly
      stepData.record[existingRecordIndex].caloriesBurned =
        calculateCaloriesBurned(
          updatedSteps,
          user.weight,
          user.height,
          user.gender,
          user.genderIdentity
        );
    } else {
      // Push a new item into the array if no record with the same date is found
      stepData.record.push({
        date: formattedDate,
        steps: updatedSteps, // Assign new steps value
        caloriesBurned: calculateCaloriesBurned(
          updatedSteps,
          user.weight,
          user.height,
          user.gender,
          user.genderIdentity
        ),
      });
    }

    const savedData = await stepData.save();

    if (savedData) {
      return {
        success: true,
        message: "Daily increments stored successfully",
        data: stepData,
      };
    } else {
      throw new Error("Error storing daily increments"); // Throw error if save operation fails
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "Error storing daily increments",
      error: error.message, // Pass error message
    };
  }
};

function calculateCaloriesBurned(
  steps,
  weight,
  height,
  gender,
  genderIdentity
) {
  // Constants representing the energy expenditure per step for different genders (in calories per step)
  const energyExpenditurePerstep_modelMale = 0.05; // Adjust these values as needed
  const energyExpenditurePerstep_modelFemale = 0.04;
  const energyExpenditurePerstep_modelTransMale = 0.045;
  const energyExpenditurePerstep_modelTransFemale = 0.035;
  const energyExpenditurePerstep_modelNonBinary = 0.04;

  // Adjusted factor based on gender identity
  let energyExpenditurePerstep_model;
  if (genderIdentity === "transMale") {
    energyExpenditurePerstep_model = energyExpenditurePerstep_modelTransMale;
  } else if (genderIdentity === "transFemale") {
    energyExpenditurePerstep_model = energyExpenditurePerstep_modelTransFemale;
  } else if (genderIdentity === "nonBinary") {
    energyExpenditurePerstep_model = energyExpenditurePerstep_modelNonBinary;
  } else {
    // For cisgender individuals
    energyExpenditurePerstep_model =
      gender === "male"
        ? energyExpenditurePerstep_modelMale
        : energyExpenditurePerstep_modelFemale;
  }

  // Calculate calories burned based on steps taken, weight, height, and gender
  // Here you would use a more sophisticated equation like Harris-Benedict or Mifflin-St Jeor
  // For demonstration purposes, I'm using a simplified formula
  const caloriesBurnedPerstep_model =
    (energyExpenditurePerstep_model * weight * height) / 100 / 100; // Convert height from cm to m
  return steps * caloriesBurnedPerstep_model;
}

exports.view_step_daily = async (req, res) => {
  const user = req.user;
  console.log(typeof req.body.date);
  
  let date = req.body.date ? new Date(req.body.date) : new Date();
  date.setHours(5, 30, 0, 0);

  try {
    let stepData = await step_model.findOne({
      user_id: user._id,
    });

    if (stepData) {
      stepData.record = stepData.record.filter(
        (record) => record.date.getTime() === date.getTime()
      );
      return {
        success: true,
        message: "Daily increments fetched successfully",
        data: stepData,
      }
    } else {
      return {
        success: false,
        message: "Daily increments not found",
        data: [],
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Error fetching daily increments",
      error: error,
    };
  }
};

exports.view_step_weekly = async (req, res) => {
  const user = req.user;
  const currentDate = new Date();
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  try {
    const stepData = await step_model.findOne({
      user_id: new mongoose.Types.ObjectId(user._id),
    });

    if (stepData) {
      const filteredRecords = stepData.record.filter(
        (record) => record.date >= oneWeekAgo && record.date <= currentDate
      );
      return res.status(200).json({
        success: true,
        message: "Weekly data fetched successfully",
        data: filteredRecords,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Weekly data not found",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching weekly data",
      error: error.message,
    });
  }
};

exports.view_step_monthly = async (req, res) => {
  const user = req.user;
  const currentDate = new Date();
  const oneMonthAgo = new Date(
    currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
  ); // 30 days ago

  try {
    const stepData = await step_model.findOne({
      user_id: new mongoose.Types.ObjectId(user._id),
    });

    if (stepData) {
      const filteredRecords = stepData.record.filter(
        (record) => record.date >= oneMonthAgo && record.date <= currentDate
      );
      return res.status(200).json({
        success: true,
        message: "Monthly data fetched successfully",
        data: filteredRecords,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Monthly data not found",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching monthly data",
      error: error.message,
    });
  }
};
