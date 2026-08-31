const {user_goal_added,user_goal_update,user_goal_delete,view_user_goal } = require("../services/goal_setting_service")

exports.user_goal_added = async (req, res) => {
    try {
      const data = await user_goal_added(req, res);
      if (data.success) {
        res.status(200).json(data);
      }else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.user_goal_update = async (req, res) => {
    try {
      const data = await user_goal_update(req, res);
      if (data.success) {
        res.status(200).json(data);
      }else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.user_goal_delete = async (req, res) => {
    try {
      const data = await user_goal_delete(req, res);
      if (data.success) {
        res.status(200).json(data);
      }else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.view_user_goal = async (req, res) => {
    try {
      const data = await view_user_goal(req, res);
      if(data.success) {
        res.status(200).send(data.data)
      } else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };