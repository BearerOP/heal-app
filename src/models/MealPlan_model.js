const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      mealplan_details:[{
        mealPlan: { type: Object, required: true },
        createdAt: { type: Date, default: Date.now },
      }]

});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = MealPlan;
