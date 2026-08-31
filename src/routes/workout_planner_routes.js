const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  exercises_all,
  exercises_bodyPart,
  exercises_equipment,
  exercises_target_muscle,
  all_body_parts,
  all_equipments,
  all_target_muscles,
  exercises_name,
  exercises_bodyPart_target,
  all_workout_plans,
  workout_plans_muscles,
  add_workout,
} = require("../controllers/workout_planner_controller.js");

router.get("/all_exercises", user_auth, exercises_all);

router.post("/bodyPart", user_auth, exercises_bodyPart);

router.post("/equipment", user_auth, exercises_equipment);

router.post("/target", user_auth, exercises_target_muscle);

router.get("/all/body_parts", user_auth, all_body_parts);

router.get("/all/equipments", user_auth, all_equipments);

router.get("/all/target_muscles", user_auth, all_target_muscles);

router.get("/exercises/name", user_auth, exercises_name);

router.get("/exercises/bodyPart/target", user_auth, exercises_bodyPart_target);

router.get("/all/workout_plans", user_auth, all_workout_plans);

router.get("/workout_plans/muscles", user_auth, workout_plans_muscles);

router.post("/add_workout", user_auth, add_workout);

module.exports = router;
