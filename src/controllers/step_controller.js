const {
  add_step,
  view_step_daily,
  view_step_weekly,
  view_step_monthly,
} = require("../services/step_service.js");

exports.add_step = async (req, res) => {
  try {
    const data = await add_step(req, res);
    if (data.success) {
      res.status(200).json(data.data);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.view_step_daily = async (req, res) => {
  try {
    const data = await view_step_daily(req, res);
    if (data.success) {
      res.status(200).json(data.data);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.view_step_weekly = async (req, res) => {
  try {
    const data = await view_step_weekly(req, res);
    if (data.success) {
      res.status(200).json(data.data);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.view_step_monthly = async (req, res) => {
  try {
    const data = await view_step_monthly(req, res);
    if (data.success) {
      res.status(200).json(data.data);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
