const {
  create_medication,
  delete_medication,
  update_medication,
  update_medication_status,
  view_medication,
  view_all_medication,
  view_medication_by_date,
  get_refill_alerts,
  refill_medication,
} = require("../services/medication_service.js");

exports.create_medication = async (req, res) => {
  try {
    const data = await create_medication(req, res);
    console.log("Data:", data);

    if (data.success) {
      res.status(201).json(data);
    } else {
      res.status(data.status).json(data);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.update_medication = async (req, res) => {
  try {
    const data = await update_medication(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(data.status || 500).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update_medication_status = async (req, res) => {
  try {
    const data = await update_medication_status(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(data.status || 500).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.view_medication = async (req, res) => {
  try {
    const data = await view_medication(req, res);
    console.log("Data:", data);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(data.status).json(data);
    }
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
};
exports.view_all_medication = async (req, res) => {
  try {
    const data = await view_all_medication(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(500).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
exports.view_medication_by_date = async (req, res) => {
  try {
    const data = await view_medication_by_date(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(500).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.delete_medication = async (req, res) => {
  try {
    const data = await delete_medication(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(500).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.get_refill_alerts = async (req, res) => {
  try {
    const data = await get_refill_alerts(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(data.status || 500).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refill_medication = async (req, res) => {
  try {
    const data = await refill_medication(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(data.status || 500).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
