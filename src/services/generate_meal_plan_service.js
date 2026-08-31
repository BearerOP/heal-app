const axios = require("axios");
const MealPlan = require("../models/MealPlan_model");

exports.generateMealPlan = async (req, res) => {
  // working on it
};

exports.view_MealPlan = async (req, res) => {
  let user_id = req.user._id;
  if (user_id) {
    let meal_data = await MealPlan.findOne({ user_id: user_id });
    if (meal_data) {
      let mealplan_details = meal_data.mealplan_details;
      console.log(mealplan_details[0]);

      if (mealplan_details) {
        return {
          success: true,
          message: "View All goal",
          meal_data: mealplan_details,
        };
      } else {
        return {
          message: "emty meal plan first you add meal plan",
          success: false,
        };
      }
    } else {
      return {
        message: "emty meal plan first you add meal plan",
        success: false,
      };
    }
  } else {
    return {
      message: "user not found",
      success: false,
    };
  }
};
exports.makeweekMealPlan = async (req, res) => {
  const user_id = req.user._id;
  const { protein, Calories, foodType } = req.query;
  // const apiKey = process.env.GEMINAI_API_KEY;


  try {



  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500,
      success: false,
      message: "An unexpected error occurred",
    };

  }


}
exports.getOneMeal = async (req, res) => {
  try {
    const { protein, Calories, foodType } = req.query;

    // Ensure foodType is defined, otherwise use an empty array
    const foodPreferences = foodType
      ? foodType.split(",").map((item) => item.trim())
      : [];

    // Construct `health` query parameters correctly
    const healthParams = foodPreferences.map((pref) => `&health=${pref}`).join("");

    const url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&calories=${Calories}&protein=${protein}&cuisineType=Indian${healthParams}`;

    const response = await axios.get(url, {
      headers: {
        "Edamam-Account-User": process.env.EDAMAM_ACCOUNT_USERNAME,
      },
    });

    if (response.status !== 200) {
      return {
        status: 500,
        success: false,
        message: "An unexpected error occurred",
      };
    }

    return {
      status: 200,
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching meal:", error);

    return {
      status: 500,
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    };
  }
};
