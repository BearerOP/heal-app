const express = require("express");
const router = express.Router();

const {
  getWaterController,
  updateWaterController,
  deleteWaterLogController,
  getWaterHistoryController,
} = require("../controllers/water_controller.js");

const user_auth = require("../../middleware/user_auth.js");
router.use(user_auth);

router.get("/", getWaterController);
router.put("/", updateWaterController);
router.post("/", updateWaterController);
router.get("/history", getWaterHistoryController);
router.delete("/log/:logId", deleteWaterLogController);
router.delete("/:logId", deleteWaterLogController);

module.exports = router;