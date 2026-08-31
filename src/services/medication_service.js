const mongoose = require("mongoose");
const medication_model = require("../models/medication_model");
const reminderModel = require("../models/reminder_model");
const { scheduleReminder } = require("../../public/utils/scheduler");
const User = require("../models/user_model");



exports.create_medication = async (req) => {
  const user_id = req.user._id;
  const {
    medicine_name, forms, strength, unit, frequency,
    times, start_date, description, forWhom, relative_id
  } = req.body;
<<<<<<< HEAD
  console.log("User ID in create_medication:", forWhom, relative_id);
  

  if (!user_id) {
    return { status: 404, success: false, message: "User not found" };
  }
  if (!medicine_name || !forms || !strength || !unit || !frequency || !times || !start_date) {
    return { status: 400, success: false, message: "Missing required medication fields" };
  }
  if (!['myself', 'connection'].includes(forWhom)) {
    return { status: 400, success: false, message: "forWhom must be either 'myself' or 'connection'" };
=======
  console.log(req.body);
  

  if (!user_id) {
    return {
      status: 404,
      success: false,
      message: "User not found",
    };
>>>>>>> 35ade63db8b0b9408db9e3a1479990ac7ec80e02
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let targetUserId = user_id; // default to self
    let medForWhom = forWhom;
    let medRelativeId = null;
    console.log("Target User ID:", targetUserId);
    console.log("For Whom:", medForWhom);
    console.log("Relative ID:", medRelativeId);

    if (forWhom === "connection") {
      if (!relative_id) {
        await session.abortTransaction();
        session.endSession();
        return { status: 400, success: false, message: "Relative ID is required for relative medication" };
      }
<<<<<<< HEAD
      const relativeUser = await User.findOne({ userId: relative_id }).session(session);
      if (!relativeUser) {
        await session.abortTransaction();
        session.endSession();
        return { status: 404, success: false, message: "Relative user not found" };
=======
    } else {
      updatedUser = await medication_model.findOneAndUpdate(
        { user_id },
        {
          $push: {
            record: {
              medicine_name,
              forms,
              strength,
              unit,
              frequency,
              times,
              start_date,
              description,
            },
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return {
          status: 400,
          success: false,
          message: "Medication not added",
        };
>>>>>>> 35ade63db8b0b9408db9e3a1479990ac7ec80e02
      }
      targetUserId = relativeUser._id;
      medRelativeId = user_id; // who is adding for the relative
    }

    // ADD "created_by"
    const medicationData = {
      medicine_name,
      forms,
      strength,
      unit,
      frequency,
      times,
      start_date,
      description,
    };

    // Add medication (append, don't overwrite)
    let result = await medication_model.findOneAndUpdate(
      { user_id: targetUserId },
      { $push: { record: medicationData },created_by: user_id ,relative_id: medRelativeId,forWhom: medForWhom },
      { upsert: true, new: true, session }

    );
    console.log("Medication Result:", result);
    if (!result) {
      await session.abortTransaction();
      session.endSession();
      return { status: 500, success: false, message: "Failed to create or update medication record" };
    }

    await scheduleMedicationReminders([medicationData], targetUserId);

    await session.commitTransaction();
    session.endSession();
    return {
      status: 200,
      success: true,
      message: "Medication added successfully",
      data: result
    };
  } catch (error) {
    console.log("Error in create_medication:", error);
    
    await session.abortTransaction();
    session.endSession();
    return {
<<<<<<< HEAD
      status: 500,
=======
      status: 400,
>>>>>>> 35ade63db8b0b9408db9e3a1479990ac7ec80e02
      success: false,
      message: "An error occurred while adding medication",
      error: error.message,
    };
  }
};



const scheduleMedicationReminders = async (medicationRecords, user_id) => {
  try {
    for (let medication of medicationRecords) {
      // Ensure forWhom is set to a default value if not present
      if (!medication.forWhom) {
        medication.forWhom = "self"; // Default to "self" if not specified
      }
      
      for (let timeEntry of medication.times) {
        //  let time =  convertUTCToIST(timeEntry.time);
        let time = timeEntry.time;
        let repeat = "none";
        if (medication.frequency.type === "As Needed") {
          repeat = "daily";
        }

        // Create or update reminder in the database
        let reminderEntry = await reminderModel.updateOne(
          { user_id: user_id },
          {
            $push: {
              reminder_info: {
                type: "medication",
                title: medication.medicine_name,
                message: `It's time to take your ${medication.medicine_name}`,
                time: time,
                repeat: repeat, // Adjust repeat logic based on your requirements
              },
            },
          },
          { upsert: true }
        );

        if (!reminderEntry) {
          console.error(
            `Failed to create/update reminder in the database for ${time}`
          );
          continue; // Skip to the next time entry if this fails
        }

        const reminder = await reminderModel.findOne({ user_id: user_id });

        scheduleReminder(reminder._id, {
          message: `It's time to take your ${medication.medicine_name}`,
          time: time,
          repeat: repeat, // Adjust repeat logic based on your requirements
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};


exports.view_medication = async (req, res) => {
  try {
    const user_id = req.user._id;
    console.log("User ID in view_medication:", user_id);
    
    const medication_id = new mongoose.Types.ObjectId(req.query.medication_id);
    let allMedication = await medication_model.findOne({ user_id: user_id });

    let queryMedication={}
    allMedication.record.forEach((medication)=>{
      if(medication._id.equals(medication_id)){
        queryMedication=medication
      }
    })
    if(!queryMedication){
      return{
        status: 404,
        success:false,
        message:"Medication not found"
      }
    }
    return{
      status: 200,
      success:true,
      message:"Fetched Medication successfully",
      medication:queryMedication
    }

  } catch (error) {
    console.log(error);
    
    return {
      status: 500,
      success: false,
      message: error.message,
    };
  }
}

exports.view_all_medication = async (req, res) => {
  try {
    const user_id = req.user._id;
    const allMedication = await medication_model.find({ user_id: user_id });
    if (!allMedication) {
      return { success: false, message: "No Medication Found" };
    }
    return {
      success: true,
      medications:allMedication,
      message: "All Medications fetched succesfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};


exports.delete_medication = async (req, res) => {
  try {
    const user_id = req.user._id;
    const medication_id = new mongoose.Types.ObjectId(req.query.medication_id);
    let allMedication = await medication_model.findOne({ user_id: user_id });

    if (!allMedication) {
      return {
        success: false,
        message: "Medication record not found",
      };
    }

    const medicationIndex = allMedication.record.findIndex((medication) => medication._id.equals(medication_id));

    if (medicationIndex === -1) {
      return{
        success: false,
        message: "Medication not found",
      };
    }

    allMedication.record.splice(medicationIndex, 1);
    await allMedication.save();

    return{
      success: true,
      message: "Deleted Medication successfully",
    };
  } catch (error) {
    return{
      success: false,
      message: error.message,
    };
  }
};
