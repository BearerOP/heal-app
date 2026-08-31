const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
    create_medication,
    delete_medication,
    update_medication,
    view_medication,
    view_all_medication,
    
} = require("../controllers/medication_controller.js");

<<<<<<< HEAD
router.use(user_auth);

router.post("/", create_medication); // Create a new medication
router.delete("/", delete_medication); // Delete a medication
// router.put("/", update_medication); // Update a medication
router.get("/", view_medication);
router.get("/all", view_all_medication);

// reminder_router.post("/medication/update", user_auth, update_medication);


module.exports = router;
=======
reminder_router.post("/create", user_auth, create_medication);

reminder_router.delete("/delete", user_auth, delete_medication);

// reminder_router.post("/medication/update", user_auth, update_medication);

reminder_router.get("/view", user_auth, view_medication);

reminder_router.get("/view/all", user_auth, view_all_medication);



module.exports = reminder_router;
>>>>>>> 35ade63db8b0b9408db9e3a1479990ac7ec80e02
