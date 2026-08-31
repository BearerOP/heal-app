const Water = require("../models/water_model");

const getTodayDateString = (dateInput) => {
  if (dateInput) {
    return new Date(dateInput).toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
};

const getWater = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const targetDateStr = getTodayDateString(req.query.date);
    let currentDate = new Date();
    currentDate.setHours(5, 30, 0, 0);

    // Fetch water data for the user
    const water = await Water.findOne({ userId: user._id });

    if (!water || !water.dates) {
      return {
        success: true,
        message: "No water data found for today",
        data: {
          date: currentDate,
          waterIntake: [],
          intakeTarget: 2500,
          totalIntake: 0,
        },
      };
    }

    // Find date entry
    const dayData = water.dates.find((entry) => {
      if (!entry.date) return false;
      const entryStr = new Date(entry.date).toISOString().split("T")[0];
      return entryStr === targetDateStr;
    });

    return {
      success: true,
      message: "Water data retrieved successfully",
      data: dayData
        ? {
            ...dayData.toObject(),
            intakeTarget: dayData.intakeTarget || 2500,
          }
        : {
            date: currentDate,
            waterIntake: [],
            intakeTarget: 2500,
            totalIntake: 0,
          },
    };
  } catch (error) {
    console.error("Error in getWater: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    };
  }
};

const updateWater = async (req) => {
  try {
    const user = req.user;
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const { waterIntake, intakeTarget = 2500 } = req.body;

    if (!waterIntake || !waterIntake.quantity) {
      return {
        success: false,
        message: "Missing waterIntake or quantity in request body",
      };
    }

    const targetDateStr = getTodayDateString(req.body.date || req.query.date);
    let currentDate = new Date();
    currentDate.setHours(5, 30, 0, 0);

    let water = await Water.findOne({ userId: user._id });
    if (!water) {
      water = new Water({
        userId: user._id,
        dates: [],
      });
    }

    // Normalize drink title
    const quantity = Number(waterIntake.quantity) || 250;
    const defaultTitle =
      quantity === 200
        ? "Small Glass"
        : quantity === 350
        ? "Cup / Mug"
        : quantity === 500
        ? "Sports Bottle"
        : quantity === 750
        ? "Large Flask"
        : "Water Intake";

    const entryToPush = {
      quantity,
      time: waterIntake.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      title: waterIntake.title || defaultTitle,
    };

    // Find the entry for the target date
    let dayData = water.dates.find((entry) => {
      if (!entry.date) return false;
      const entryStr = new Date(entry.date).toISOString().split("T")[0];
      return entryStr === targetDateStr;
    });

    if (dayData) {
      dayData.waterIntake.push(entryToPush);
      dayData.totalIntake = dayData.waterIntake.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
      if (intakeTarget) {
        dayData.intakeTarget = Number(intakeTarget);
      }
    } else {
      dayData = {
        date: currentDate,
        waterIntake: [entryToPush],
        intakeTarget: Number(intakeTarget) || 2500,
        totalIntake: quantity,
      };
      water.dates.push(dayData);
    }

    await water.save();

    // Re-fetch saved version with generated ObjectIds
    const savedDayData = water.dates.find((entry) => {
      if (!entry.date) return false;
      const entryStr = new Date(entry.date).toISOString().split("T")[0];
      return entryStr === targetDateStr;
    });

    return {
      success: true,
      message: "Water data updated successfully",
      data: savedDayData || dayData,
    };
  } catch (error) {
    console.error("Error in updateWater: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    };
  }
};

const deleteWaterLog = async (req) => {
  try {
    const user = req.user;
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const { logId } = req.params;
    if (!logId) {
      return {
        success: false,
        message: "Missing logId parameter",
      };
    }

    const targetDateStr = getTodayDateString(req.query.date);
    let water = await Water.findOne({ userId: user._id });

    if (!water || !water.dates) {
      return {
        success: false,
        message: "No water logs found",
      };
    }

    let dayData = water.dates.find((entry) => {
      if (!entry.date) return false;
      const entryStr = new Date(entry.date).toISOString().split("T")[0];
      return entryStr === targetDateStr;
    });

    if (!dayData) {
      return {
        success: false,
        message: "No logs found for this date",
      };
    }

    // Filter out item by _id
    const initialLen = dayData.waterIntake.length;
    dayData.waterIntake = dayData.waterIntake.filter(
      (item) => item._id.toString() !== logId.toString()
    );

    if (dayData.waterIntake.length === initialLen) {
      return {
        success: false,
        message: "Log entry not found",
      };
    }

    // Recalculate total
    dayData.totalIntake = dayData.waterIntake.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0
    );

    await water.save();

    return {
      success: true,
      message: "Log entry deleted successfully",
      data: dayData,
    };
  } catch (error) {
    console.error("Error in deleteWaterLog: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    };
  }
};

const getWaterHistory = async (req) => {
  try {
    const user = req.user;
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const water = await Water.findOne({ userId: user._id });
    if (!water || !water.dates || water.dates.length === 0) {
      return {
        success: true,
        message: "No history found",
        data: [],
      };
    }

    // Sort ascending by date
    const sorted = [...water.dates].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Return last 7 to 14 entries
    const recent = sorted.slice(-14);

    return {
      success: true,
      message: "Water history retrieved successfully",
      data: recent,
    };
  } catch (error) {
    console.error("Error in getWaterHistory: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    };
  }
};

module.exports = {
  getWater,
  updateWater,
  deleteWaterLog,
  getWaterHistory,
};
