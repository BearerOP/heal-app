const {
  generateMealPlan,
  view_MealPlan,
  getPrompt,
  getOneMeal,
} = require("../services/generate_meal_plan_service");

exports.generateMealPlan = async (req, res) => {
  try {
    const data = await generateMealPlan(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.view_MealPlan = async (req, res) => {
  try {
    const data = await view_MealPlan(req, res);
    if (data.success) {
      res.status(200).send(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.getPrompt = async (req, res) => {
  try {
    const data = await getPrompt(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.getOneMeal = async (req, res) => {
  try {
    const data = await getOneMeal(req, res);
    if (data.success) {
      res.status(data.status).json(data);
    } else {
      res.status(data.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
}
