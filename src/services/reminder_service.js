const reminderModel = require("../models/reminder_model");

const { scheduleReminder } = require("../../public/utils/scheduler.js")
const { convertISTtoGMT} = require("../../public/utils/convertISTtoGMT.js")

const createOrUpdateReminder = async (user_id, reminderInfo) => {
  try {
    let reminderData = await reminderModel.findOne({ user_id });

    if (reminderData) {
      reminderData.reminder_info.push(reminderInfo);
      const updatedReminder = await reminderModel.findOneAndUpdate(
        { user_id },
        { reminder_info: reminderData.reminder_info },
        { new: true }
      );

      if (updatedReminder) {
        updatedReminder.reminder_info.forEach(async (item) => {
          scheduleReminder(updatedReminder._id, item);
        });

        return {
          message: "Reminder updated successfully",
          success: true,
          data: reminderInfo,
        };
      } else {
        return { message: "Reminder not updated", success: false };
      }
    } else {
      const newReminder = new reminderModel({
        user_id,
        reminder_info: [reminderInfo],
      });
      const createdReminder = await newReminder.save();

      if (createdReminder) {
        createdReminder.reminder_info.forEach(async (item) => {
          scheduleReminder(createdReminder._id, item);
        });

        return {
          message: "Reminder created successfully",
          success: true,
          data: reminderInfo,
        };
      } else {
        return { message: "Reminder not created", success: false };
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      message: error.message || "Internal server error",
      success: false,
    };
  }
};



exports.create_reminder = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    if (user_id) {
      let { type, title, message, time, repeat } = req.body;
      let format="";
      if (type == "sleep"|| type == "medication") {
        format = "long";
      }else{
        format = "short";
      }
      time = convertISTtoGMT(time);
      const reminderInfo = { type, message,format, time, repeat, title };
      const response = await createOrUpdateReminder(user_id, reminderInfo);
      if (response.success) {
        return {
          message: "Reminder created successfully",
          success: true,
          data: reminderInfo,
        };
      } else {
        return { message: "Reminder not created", success: false };
      }
    } else {
      return { message: "User not found", success: false };
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
};

exports.delete_reminders = async (req, res) => {
  try {
    let user_id = req.user.id;
    if (user_id) {
      let deletedReminder = await reminderModel.findOneAndDelete({
        user_id: user_id,
      });
      if (deletedReminder) {
        return { message: "Reminder deleted successfully", success: true };
      } else {
        return { message: "Reminder not deleted", success: false };
      }
    } else {
      return { message: "User not found", success: false };
    }
  } catch (error) {
    console.log("Error:", error);
    return {
      message: error.message || "Internal server error",
      success: false,
    };
  }
};

exports.update_reminder = async (req, res) => {
  try {
    let user_id = req.user.id;
    if (user_id) {
      const type = req.body.type;
      const message = req.body.message;
      const time = req.body.time;
      const repeat = req.body.repeat;

      let reminderData = await reminderModel.findOne({ user_id: user_id });
      if (reminderData) {
        reminderData.reminder_info.push({
          type: type,
          message: message,
          time: time,
          repeat: repeat,
        });

        let updatedReminder = await reminderModel.findOneAndUpdate(
          { user_id: user_id },
          { reminder_info: reminderData.reminder_info },
          { new: true }
        );
        if (updatedReminder) {
          return { message: "Reminder updated successfully", success: true };
        } else {
          return { message: "Reminder not updated", success: false };
        }
      } else {
        return { message: "Reminder not found", success: false };
      }
    } else {
      return { message: "User not found", success: false };
    }
  } catch (error) {
    console.log("Error:", error);

    console.log(error);
    return {
      message: error.message || "Internal server error",
      success: false,
    };
  }
};

exports.get_reminders = async (req, res) => {
  try {
    let user_id = req.user.id;
    if (user_id) {
      let reminderData = await reminderModel.findOne({ user_id: user_id });
      console.log(reminderData);
      const groupByReminderType = (reminderInfo) => {
        return reminderInfo.reduce((acc, reminder) => {
          const { type, title, message, time, repeat, created_at, _id } = reminder;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push({ title, message, time, repeat, created_at, _id });
          return acc;
        }, {});
      };
      
      const groupedReminders = groupByReminderType(reminderData.reminder_info);
      
      if (reminderData) {
        return {
          message: "Reminders fetched successfully",
          data: groupedReminders,
          success: true,
        };
      } else {
        return { message: "Reminders not found", success: false };
      }
    } else {
      return { message: "User not found", success: false };
    }
  } catch (error) {
    console.log("Error:", error);
    return {
      message: error.message || "Internal server error",
      success: false,
    };
  }
};