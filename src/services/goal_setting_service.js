const userModel = require("../models/user_model");
const goalModel = require("../models/goal_model");

exports.user_goal_added = async (req, res) => {
  try {
    const user_id = req.user._id;

    if (!user_id) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const {
      type,
      title,
      description,
      target_value,
      current_value,
      unit,
      deadline,
    } = req.body;

    if (
      !type ||
      !title ||
      !description ||
      !target_value ||
      !current_value ||
      !unit ||
      !deadline
    ) {
      return res.status(400).json({
        message: "Please enter complete details about the goal",
        success: false,
      });
    }

    let goal_data = await goalModel.findOne({ user_id });

    if (goal_data) {
      goal_data.goal_details.push({
        type,
        title,
        description,
        target_value,
        current_value,
        unit,
        deadline,
      });
      const savedData = await goal_data.save();
      if (savedData) {
        return {
          message: "New goal added successfully",
          success: true,
        };
      } else {
        return {
          message: "Failed to add new goal",
          success: false,
        };
      }
    } else {
      goal_data = new goalModel({
        user_id,
        goal_details: [
          {
            type,
            title,
            description,
            target_value,
            current_value,
            unit,
            deadline,
          },
        ],
      });
      const savedData = await goal_data.save();
      if (savedData) {
        return {
          message: "New goal added successfully",
          success: true,
        };
      } else {
        return {
          message: "Failed to add new goal",
          success: false,
        };
      }
    }
  } catch (error) {
    console.error(error);
    return {
      message: error.message || "Internal server error",
      success: false,
    }
  }
};

exports.user_goal_update = async (req, res) => {
  try {
    const user_id = req.user._id;
    if (!user_id) {
      return res.status(400).json({
        message: "User not found",
        data: [],
        success: false,
      });
    }

    const { _id, title, description, target_value, deadline, current_value } =
      req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Goal ID is not given",
        data: [],
        success: false,
      });
    }

    let goal_data = await goalModel.findOne({ user_id });
    if (!goal_data) {
      return res.status(404).json({
        message: "This user has no goal data",
        data: [],
        success: false,
      });
    }

    let goal_details = goal_data.goal_details.find((goal) => goal._id == _id);
    if (!goal_details) {
      return res.status(404).json({
        message: "No goal data found",
        data: [],
        success: false,
      });
    }

    // Update goal details if provided
    if (title !== undefined) goal_details.title = title;
    if (description !== undefined) goal_details.description = description;
    if (target_value !== undefined) goal_details.target_value = target_value;
    if (deadline !== undefined) goal_details.deadline = deadline;
    if (current_value !== undefined) goal_details.current_value = current_value;

    const savedData = await goal_data.save();

    if (savedData) {
      return {
        message: "Update successful",
        success: true,
      };
    } else {
      return {
        message: "Something went wrong",
        data: [],
        success: false,
      };
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: [],
      success: false,
    });
  }
};

exports.user_goal_delete = async (req, res) => {
  try {
    const user_id = req.user._id;
    if (user_id) {
      let arr = [];
      const _id = req.body._id;
      if (_id) {
        let goal_data = await goalModel.findOne({ user_id: user_id });
        if (goal_data) {
          let goal_details = goal_data.goal_details.findIndex(
            (goal_details) => goal_details._id == _id
          );

          if (goal_details != -1) {
            for (let i = 0; i < goal_data.goal_details.length; i++) {
              if (
                goal_data.goal_details[i] !==
                goal_data.goal_details[goal_details]
              ) {
                arr.push(goal_data.goal_details[i]);
                await goal_data.save();
              }
            }

            await goalModel.findOneAndUpdate(
              { user_id: user_id },
              { $set: { goal_details: arr } }
            );

            return {
              message: "goal delet successfully",
              success: true,
            };
          } else {
            return {
              message: "goal not found",
              data: [],
              success: false,
            };
          }
        } else {
          return {
            message: "users goal is empty",
            data: [],
            success: false,
          };
        }
      } else {
        return {
          message: "_id not recive",
          data: [],
          success: false,
        };
      }
    } else {
      return {
        message: "user not found",
        data: [],
        success: false,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

exports.view_user_goal = async (req, res) => {
  try {
    let user_id = req.user._id;
    if (user_id) {
      const goal_data = await goalModel.findOne({ user_id: user_id });
      const groupByType = (goalDetails) => {
        return goalDetails.reduce((acc, goal) => {
          const {
            type,
            title,
            description,
            target_value,
            current_value,
            unit,
            deadline,
            created_at,
            _id,
          } = goal;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push({
            type,
            title,
            description,
            target_value,
            current_value,
            unit,
            deadline,
            created_at,
            _id,
          });
          return acc;
        }, {});
      };

      const groupedGoals = groupByType(goal_data.goal_details);

      // console.log(groupedGoals);
      if (groupedGoals) {
        return {
          success: true,
          message: "View All goal",
          data: groupedGoals,
        };
      } else {
        return {
          message: "goal not found",
          data: [],
          success: false,
        };
      }
    } else {
      return {
        message: "user not found",
        data: [],
        success: false,
      };
    }
  } catch (error) {
    return {
      message: error,
      data: [],
      success: false,
    };
  }
};
