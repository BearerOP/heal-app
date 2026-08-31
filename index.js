const cookieParser = require("cookie-parser");
const express = require("express");
let dotenv = require("dotenv");
let path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const user = require("./src/routes/user_routes.js");
const workoutPlanner = require("./src/routes/workout_planner_routes.js");
const connection = require("./src/routes/connection_routes.js")
const medication = require("./src/routes/medication_routes.js");
const goals = require("./src/routes/goal_setting_routes.js");
const reminder = require("./src/routes/reminder_routes.js");
const step = require("./src/routes/step_routes.js");
const sleep = require("./src/routes/sleep_patterns_routes.js");
const meal = require("./src/routes/generate_meal_plan_routes.js");
const leaderboard = require("./src/routes/leaderboard_routes.js");
const water = require("./src/routes/water_routes.js");
const dashboard = require("./src/routes/dashboard_routes.js");

// // CORS configuration
// const corsOptions = {
//   origin: ["https://theslug.netlify.app", "http://localhost:5173"],
//   methods: 'GET,POST',
//   credentials: true,
//   allowedHeaders: 'Content-Type,Authorization',
// };
// app.options('*', cors(corsOptions));
// app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "/public")));
app.use("/public", express.static("public"));

app.use("/status", (req, res) => {
  res.send(`Swasthya Server is up and running..... on port ${process.env.PORT}`);
});

app.use("/user", user);
app.use("/connection", connection);
app.use("/medication", medication);
app.use("/workout", workoutPlanner);
app.use("/goals", goals);
app.use("/reminder", reminder);
app.use("/step", step);
app.use("/Sleep", sleep);
app.use("/meal", meal);
app.use("/leaderboard", leaderboard);
// app.use("/", require('./src/routes/relatives_routes.js'));
app.use("/water", water);
app.use("/dashboard", dashboard);

let { connectDB } = require("./db/dbconnection.js");

connectDB();
app.listen(process.env.PORT, () => {
  console.log(`app listening on ${process.env.HOST}:${process.env.PORT}`);
});
