const {
  getWater,
  updateWater,
  deleteWaterLog,
  getWaterHistory,
} = require("../services/water_service");

const getWaterController = async (req, res) => {
  try {
    const data = await getWater(req, res);
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateWaterController = async (req, res) => {
  try {
    const data = await updateWater(req);
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteWaterLogController = async (req, res) => {
  try {
    const data = await deleteWaterLog(req);
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWaterHistoryController = async (req, res) => {
  try {
    const data = await getWaterHistory(req);
    res.status(data.success ? 200 : 400).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWaterController,
  updateWaterController,
  deleteWaterLogController,
  getWaterHistoryController,
};