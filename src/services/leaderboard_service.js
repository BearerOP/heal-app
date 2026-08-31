const user_model = require("../models/user_model");
const step_model = require("../models/step_model");

exports.overall = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    const { period } = req.body;
    let dateFilter;

    const now = new Date();
    now.setHours(5, 30, 0, 0); // Adjust the time zone as needed

    if (period === "today") {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      dateFilter = { $gte: today, $lte: now };
    } else if (period === "weekly") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the current week
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { $gte: startOfWeek, $lte: now };
    } else if (period === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
      startOfMonth.setHours(0, 0, 0, 0);
      dateFilter = { $gte: startOfMonth, $lte: now };
    } else {
      return {
        status: 400,
        success: false,
        message: "Invalid period specified!",
      };
    }

    const allUsers = await user_model.find({});
    if (!allUsers || allUsers.length === 0) {
      return {
        status: 404,
        success: false,
        message: "Users not found!",
      };
    }

    const leaderboard = [];

    for (const user of allUsers) {
      const { _id, username } = user;

      const steps = await step_model.find({
        user_id: _id,
        "record.date": dateFilter,
      });

      let totalSteps = 0;
      let totalCalories = 0;
      for (const stepRecord of steps) {
        for (const record of stepRecord.record) {
          const recordDate = new Date(record.date);
          if (recordDate >= dateFilter.$gte && recordDate <= dateFilter.$lte) {
            totalSteps += record.steps;
            totalCalories += record.caloriesBurned;
          }
        }
      }

      leaderboard.push({
        user_id: _id,
        username,
        totalSteps,
        totalCalories,
      });
    }

    // Sort the leaderboard by totalSteps in descending order
    leaderboard.sort((a, b) => b.totalSteps - a.totalSteps);

    return {
      status: 200,
      success: true,
      message: "Overall leaderboard fetched successfully!",
     leaderboard,
    };
  } catch (error) {
    console.error("Error fetching overall leaderboard:", error);
    return {
      success: false,
      message: "Error fetching overall leaderboard",
      error: error.message,
    };
  }
};

exports.relatives = async (req, res) => {
  try {
    const user = req.user; // Assuming req.user is properly populated by middleware
    if (!user) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    const { period } = req.body;
    let dateFilter;

    const now = new Date();
    now.setHours(5, 30, 0, 0); // Adjust the time zone as needed

    if (period === "today") {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      dateFilter = { $gte: today, $lte: now };
    } else if (period === "weekly") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the current week
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { $gte: startOfWeek, $lte: now };
    } else if (period === "monthly") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
      startOfMonth.setHours(0, 0, 0, 0);
      dateFilter = { $gte: startOfMonth, $lte: now };
    } else {
      return {
        success: false,
        message: "Invalid period specified!",
      };
    }

    // Fetch relatives of the current user
    const relatives = await user_model.find({
      relatives: user._id,
    });

    const leaderboard = [];

    for (const relative of relatives) {
      // Query steps records for each relative for the specified date range
      const steps = await step_model.find({
        user_id: relative._id,
        "record.date": dateFilter,
      });

      let totalSteps = 0;
      let totalCalories = 0;

      for (const stepRecord of steps) {
        for (const record of stepRecord.record) {
          const recordDate = new Date(record.date);
          if (recordDate >= dateFilter.$gte && recordDate <= dateFilter.$lte) {
            totalSteps += record.steps;
            totalCalories += record.caloriesBurned;
          }
        }
      }

      leaderboard.push({
        _id: relative._id,
        username: relative.username,
        steps: totalSteps,
        caloriesBurned: totalCalories,
      });
    }

    // Fetch steps for the current user for the specified date range
    const userSteps = await step_model.find({
      user_id: user._id,
      "record.date": dateFilter,
    });

    let userTotalSteps = 0;
    let userTotalCalories = 0;

    for (const stepRecord of userSteps) {
      for (const record of stepRecord.record) {
        const recordDate = new Date(record.date);
        if (recordDate >= dateFilter.$gte && recordDate <= dateFilter.$lte) {
          userTotalSteps += record.steps;
          userTotalCalories += record.caloriesBurned;
        }
      }
    }

    leaderboard.push({
      _id: user._id,
      username: user.username,
      steps: userTotalSteps,
      caloriesBurned: userTotalCalories,
    });

    // Sort the leaderboard by steps in descending order
    leaderboard.sort((a, b) => b.steps - a.steps);

    return {
      success: true,
      data: leaderboard,
      message: "Relatives leaderboard fetched successfully!",
    };
  } catch (error) {
    console.error("Error fetching relatives leaderboard:", error);
    return {
      success: false,
      message: "Error fetching relatives leaderboard",
      error: error.message,
    };
  }
};

exports.overall_ranking = async (req, res) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const dateString = req.body.date;
    const date = new Date(dateString);
    date.setHours(5, 30, 0, 0);

    const allUsers = await user_model.find({});
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found!",
      });
    }

    const leaderboard = [];

    for (const user of allUsers) {
      const { _id, username } = user;

      const steps = await step_model.find({
        user_id: _id,
        "record.date": { $lte: date },
      });

      let totalSteps = 0;
      for (const stepRecord of steps) {
        for (const record of stepRecord.record) {
          const recordDate = new Date(record.date);
          if (recordDate.toDateString() === date.toDateString()) {
            totalSteps += record.steps;
          }
        }
      }

      leaderboard.push({
        user_id: _id,
        username,
        totalSteps,
      });
    }

    // Sort the leaderboard by totalSteps in descending order
    leaderboard.sort((a, b) => b.totalSteps - a.totalSteps);

    // Find user's ranking
    let userRanking = -1;
    leaderboard.forEach((entry, index) => {
      if (entry.user_id.toString() === user._id.toString()) {
        userRanking = index + 1;
      }
    });

    // If user not found in leaderboard, handle accordingly
    if (userRanking === -1) {
      return{
        success: false,
        message: "User not found in leaderboard",
      }
    }

    return {
      success: true,
      message: "Overall ranking fetched successfully!",
      ranking:userRanking
    }
  } catch (error) {
    console.error("Error fetching overall ranking:", error);
    return {
    success: false,
    message: "Error fetching overall ranking",
    error: error.message,
    }
  }
};
