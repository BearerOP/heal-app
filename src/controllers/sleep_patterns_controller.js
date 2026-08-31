const {
  sleep_duration_add,
  sleep_duration_end,
  sleep_view,
  sleep_view_all,
  sleep_weekly_avg
} = require("../services/sleep_patterns_service");

exports.sleep_duration_add = async (req, res) => {
  try {
    const data = await sleep_duration_add(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(data);
    res.status(500).json(data);
  }
};
exports.sleep_duration_end = async (req, res) => {
  try {
    const data = await sleep_duration_end(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json(data);
  }
};
exports.sleep_view = async (req, res) => {
  try {
    const data = await sleep_view(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json(data);
  }
};
exports.sleep_view_all = async (req, res) => {
  try {
    const data = await sleep_view_all(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json(data);
  }
};
exports.sleep_weekly_avg = async (req, res) => {
  try {
    const data = await sleep_weekly_avg(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json(data);
  }
};
