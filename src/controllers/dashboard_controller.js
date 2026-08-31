const dashboard_service = require("../services/dashboard_service");

exports.get_dashboard_data = async (req, res) => {
  try {
    const data = await dashboard_service.get_dashboard_data(req, res);
    if (data.success) {
      res.status(data.status || 200).json(data);
    } else {
      res.status(data.status || 500).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
