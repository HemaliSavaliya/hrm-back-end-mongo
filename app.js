const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const connectDB = require("./config/config.js");
const authRouter = require("./routes/authRoute");
const empRouter = require("./routes/userRouter");
const projectsRouter = require("./routes/projectsRoute");
const timerRouter = require("./routes/timerRoute");
const leaveTypeRouter = require("./routes/leaveTypeRoute");
const leaveRequestRouter = require("./routes/leaveRequestRoute");
const departmentRouter = require("./routes/departmentRoute");
const designationRouter = require("./routes/designationRoute");
const jobsRouter = require("./routes/jobsRoute");
const applicantRouter = require("./routes/applicantListRoute");
const calendarTodoRouter = require("./routes/calendarTodoRoute");
const calendarEventRouter = require("./routes/calendarEventRoute");
const announcementRouter = require("./routes/announcementRoute");
const awardsRouter = require("./routes/awardsRouter");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const PORT = process.env.PORT || 9000;

app.get('/', (req, res) => {
    res.status(200).send("Welcome to Home page!");
});

app.use("/api", authRouter);
app.use("/api", empRouter);
app.use("/api", projectsRouter);
app.use("/api", timerRouter);
app.use("/api", leaveTypeRouter);
app.use("/api", leaveRequestRouter);
app.use("/api", departmentRouter);
app.use("/api", designationRouter);
app.use("/api", jobsRouter);
app.use("/api", applicantRouter);
app.use("/api", calendarTodoRouter);
app.use("/api", calendarEventRouter);
app.use("/api", announcementRouter);
app.use("/api", awardsRouter);

connectDB();
mongoose.connection.once("open", () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
});

mongoose.connection.on("error", (error) => {
    console.log("Error connecting to Mongoose", error);
});