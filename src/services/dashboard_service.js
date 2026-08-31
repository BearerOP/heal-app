const mongoose = require("mongoose");
const Medication = require("../models/medication_model");
const Sleep = require("../models/sleep_model");
const Water = require("../models/water_model");

exports.get_dashboard_data = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return { success: false, status: 404, message: "User not found" };
    }

    let currentDate = new Date();
    currentDate.setHours(5, 30, 0, 0); // As per water_service.js logic
    const formattedCurrentDate = currentDate.toISOString().split("T")[0];

    // 1. Get today's medication
    const allMedication = await Medication.findOne({ user_id: user._id });

    let todayMedications = [];
    if (allMedication && allMedication.record) {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentDayName = daysOfWeek[currentDate.getDay()];

      todayMedications = allMedication.record.filter((med) => {
        const startDate = new Date(med.start_date);
        startDate.setHours(5, 30, 0, 0);

        if (startDate > currentDate) return false;

        if (med.frequency.type === "Daily" || med.frequency.type === "As Needed" || med.frequency.type === "At Regular Intervals") {
          return true;
        } else if (med.frequency.type === "On Specific Days Of Week") {
          return med.frequency.specificDays && med.frequency.specificDays.includes(currentDayName);
        } else if (med.frequency.type === "Weekly") {
          const diffDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
          return diffDays % 7 === 0;
        } else if (med.frequency.type === "Monthly") {
          return startDate.getDate() === currentDate.getDate();
        }
        return true;
      });

      todayMedications = todayMedications.map(med => {
        let medObj = med.toObject ? med.toObject() : med;
        if (medObj.logs) {
          medObj.logs = medObj.logs.filter(log => {
            let logDate = new Date(log.time);
            logDate.setHours(5, 30, 0, 0);
            return logDate.toISOString().split("T")[0] === formattedCurrentDate;
          });
        }
        return medObj;
      });
    }

    // 2. Get Sleep Data
    const sleepData = await Sleep.findOne({ user_id: user._id });
    let latestSleep = null;
    if (sleepData && sleepData.record && sleepData.record.length > 0) {
      latestSleep = sleepData.record.find((entry) => {
        let sleepDate = new Date(entry.sleepTime);
        sleepDate.setHours(5, 30, 0, 0);
        return sleepDate.toISOString().split("T")[0] === formattedCurrentDate;
      }) || null;
    }

    // 3. Get Water Data
    const water = await Water.findOne({ userId: user._id });
    let todayWater = {
      date: currentDate,
      waterIntake: [],
      intakeTarget: 0,
      totalIntake: 0,
    };

    if (water && water.dates) {
      const found = water.dates.find(
        (entry) => {
          let waterDate = new Date(entry.date);
          waterDate.setHours(5, 30, 0, 0);
          return waterDate.toISOString().split("T")[0] === formattedCurrentDate;
        }
      );
      if (found) {
        todayWater = found;
      }
    }

    return {
      success: true,
      status: 200,
      message: "Dashboard data fetched successfully",
      data: {
        medication: todayMedications,
        sleep: latestSleep,
        hydration: todayWater
      }
    };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, message: error.message };
  }
};
