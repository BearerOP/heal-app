const mongoose = require("mongoose");
const user_model = require("../models/user_model.js");
const sleep_model = require("../models/sleep_model.js");

exports.sleep_duration_add = async (req, res) => {
  try {
    // Check if req.user exists and has _id property
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const sleepTime = Date.now();

    // Find the user
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if sleep data already exists
    const sleepData = await sleep_model.findOne({ user_id: user._id });

    if (!sleepData) {
      // Create new sleep data
      const newSleepData = new sleep_model({
        user_id: user._id,
        record: [{ sleepTime }],
      });
      const savedSleepData = await newSleepData.save();
      if (savedSleepData) {
        return {
          success: true,
          message: "Sleep starting entry added successfully",
        };
      }
    } else {
      // Update existing sleep data
      sleepData.record.push({ sleepTime });
      const updatedSleepData = await sleepData.save();
      if (updatedSleepData) {
        return {
          success: true,
          message: "Sleep starting entry added successfully",
        };
      }
    }
    return {
      success: false,
      message: "Internal server error",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      error,
    };
  }
};

const calculateDuration = (startTime, endTime) => {
  const diff = endTime - startTime; // difference in milliseconds
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
};

exports.sleep_duration_end = async (req, res) => {
  try {
    let { sleepQuality, sleep_id } = req.body;
    const sleepObjectId = new mongoose.Types.ObjectId(sleep_id);
    const wakeTime = Date.now();

    // Check if req.user exists and has _id property
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find the user and their sleep data
    const user = req.user;
    const sleepData = await sleep_model.findOne({ user_id: user._id });

    if (!sleepData) {
      return res.status(404).json({
        success: false,
        message: "Sleep data not found",
      });
    }

    let entryFound = false;
    sleepData.record.forEach((entry) => {
      if (entry._id.equals(sleepObjectId)) {
        // Check if wakeTime is already set
        if (entry.wakeTime) {
          return res.status(400).json({
            success: false,
            message: "Wake time is already set, duration cannot be updated",
          });
        }
        
        // Update wakeTime and sleepQuality
        entry.wakeTime = wakeTime;
        entry.sleepQuality = sleepQuality;

        // Calculate duration only if it's not already set
        if (entry.duration.hour === 0 && entry.duration.minute === 0) {
          const duration = calculateDuration(entry.sleepTime.getTime(), wakeTime);
          entry.duration.hour = duration.hours;
          entry.duration.minute = duration.minutes;
        }
        entryFound = true;
      }
    });

    if (!entryFound) {
      return res.status(404).json({
        success: false,
        message: "Sleep entry not found",
      });
    }

    const updatedSleepData = await sleepData.save();

    if (updatedSleepData) {
      return {
        success: true,
        message: "Sleep ending entry added successfully",
      }
    } else {
      return {
        success: false,
        message: "Sleep ending entry not added",
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      error: error.message,
    }
  }
};

exports.sleep_view_all = async (req, res) => {
  try {
    // Check if req.user exists and has _id property
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const sleepData = await sleep_model.findOne({ user_id: user._id });
    if (!sleepData) {
      return {
        success: false,
        message: "No sleep data found",
      };
    }
    return {
      success: true,
      message: "Sleep data fetched successfully",
      data: sleepData.record,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      error,
    };
  }
};

exports.sleep_view = async (req, res) => {
  try {
    const { sleep_id } = req.body;
    const sleepObjectId = new mongoose.Types.ObjectId(sleep_id);
    // Check if req.user exists and has _id property
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const user = req.user;
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const sleepData = await sleep_model.findOne({ user_id: user._id }).exec();
    if (!sleepData) {
      return {
        success: false,
        message: "No sleep data found",
      };
    }

    const sleepEntry = sleepData.record.find((entry) =>
      entry._id.equals(sleepObjectId)
    );
    if (!sleepEntry) {
      return {
        success: false,
        message: "Sleep entry not found",
      };
    }
    return {
      success: true,
      message: "Sleep data fetched successfully",
      data: sleepEntry,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      error,
    };
  }
};

exports.sleep_weekly_avg = async (req, res) => {
  try {
    let weekDate = req.body.weekDate;
    if (!weekDate) {
      weekDate = new Date();
    } else {
      weekDate = new Date(weekDate);
    }

    weekDate.setHours(0, 0, 0, 0);
    // Check if req.user exists and has _id property
    if (!req.user || !req.user._id) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }
    const user = req.user;

    const sleepData = await sleep_model.findOne({ user_id: user._id });
    if (!sleepData) {
      return {
        success: false,
        message: "No sleep data found",
      };
      51;
    }
    const lastWeekRecords = sleepData.record.filter((entry) => {
      const entryDate = new Date(entry.sleepTime);
      return entryDate >= weekDate - 7 * 24 * 60 * 60 * 1000;
    });

    if (lastWeekRecords.length === 0) {
      return {
        success: false,
        message: "No sleep data found for the last week",
      };
    }

    // Calculate total hours and minutes for the last week
    let totalHours = 0;
    let totalMinutes = 0;
    lastWeekRecords.forEach((entry) => {
      totalHours += entry.duration.hour;
      totalMinutes += entry.duration.minute;
    });

    // Calculate average sleep duration
    const totalEntries = lastWeekRecords.length;
    const totalSleepMinutes = totalHours * 60 + totalMinutes;
    const avgMinutes = totalSleepMinutes / totalEntries;
    const avgHours = Math.floor(avgMinutes / 60);
    const remainingMinutes = Math.floor(avgMinutes % 60);

    return {
      success: true,
      message: "Last week's sleep data fetched successfully",
      data: {
        hour: avgHours,
        minute: remainingMinutes,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      error,
    };
  }
};
