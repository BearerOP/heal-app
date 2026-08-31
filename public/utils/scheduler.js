const reminderModel = require("../../src/models/reminder_model.js");
const schedule = require("node-schedule");
const {
  sendNotification,
  getUserToken,
} = require("../../public/utils/notification.js");

function convertISTtoGMT(istTimestamp) {
  // Create a Date object from the input timestamp
  let date = new Date(istTimestamp);

  // IST is UTC+5:30, so subtract 5 hours and 30 minutes to get GMT
  let istOffset = 5 * 60 + 30; // Total minutes offset for IST
  date.setMinutes(date.getMinutes() - istOffset);

  // Format the date to 24-hour format
  let year = date.getUTCFullYear();
  let month = String(date.getUTCMonth() + 1).padStart(2, '0');
  let day = String(date.getUTCDate()).padStart(2, '0');
  let hours = String(date.getUTCHours()).padStart(2, '0');
  let minutes = String(date.getUTCMinutes()).padStart(2, '0');
  let seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

const scheduleReminder = (reminderId, info) => {
  let { message, time, repeat } = info;
  time =  convertISTtoGMT(time);
  const date = new Date(time);
  // console.log(date);

  if (date > new Date()) {
    const job = schedule.scheduleJob(date, async () => {
      try {
        const reminder = await reminderModel
          .findById(reminderId)
          .populate("user_id");
        if (reminder) {
          const token = await getUserToken(reminder.user_id._id);
          sendNotification(token, message);
        }

        if (repeat === "daily") {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          scheduleReminder(reminderId, { ...info, time: nextDay });
        }
      } catch (error) {
        console.error("Error sending notification:", error.message);
      }
    });

    console.log(`Scheduled reminder ${reminderId} for ${date}`);
  }
};

module.exports = { scheduleReminder };
