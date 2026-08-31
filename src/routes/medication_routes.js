const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

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
} = require("../controllers/medication_controller.js");

router.use(user_auth);

router.post("/", create_medication); // Create a new medication
router.delete("/", delete_medication); // Delete a medication
router.put("/", update_medication); // Update a medication
router.post("/status", update_medication_status); // Update medication intake status (taken, skipped, not taken yet)
router.get("/", view_medication);
router.get("/all", view_all_medication);
router.get("/bydate", view_medication_by_date);
router.get("/refills", get_refill_alerts); // Get low stock and refill alerts
router.post("/refill", refill_medication); // Refill medication stock

// reminder_router.post("/medication/update", user_auth, update_medication);


module.exports = router;
