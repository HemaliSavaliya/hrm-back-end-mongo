const Timer = require("../models/timer");

module.exports.addTimerData = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "HR" || req.user.role === "Employee")) {
            // Assuming startTime, stopTime are in the format "hh:mm:ss AM/PM"
            const startTime = new Date(req.body.date + ' ' + req.body.startTime);
            const stopTime = new Date(req.body.date + ' ' + req.body.stopTime);

            // Check if the date parsing is successful
            if (isNaN(startTime) || isNaN(stopTime)) {
                throw new Error("Invalid date format");
            }

            // Calculate the time difference in milliseconds
            const timeDifference = stopTime - startTime;

            // Check if the time difference is a valid number
            if (isNaN(timeDifference)) {
                throw new Error("Invalid time difference");
            }

            // Calculate the time difference to hours
            const totalHours = timeDifference / (1000 * 60 * 60);

            // Set a threshold for total working hours (e.g., 8 hours)
            const requiredHours = 8;

            // Determine the status based on total working hours
            let status = "Absent";
            if (totalHours >= requiredHours) {
                status = "Present";
            } else if (totalHours > 0) {
                status = "Late";
            }

            const newTimerData = new Timer({
                date: req.body.date,
                userId: req.user.id,
                userName: req.user.name,
                projectName: req.body.projectName,
                description: req.body.description,
                role: req.user.role,
                startTime: req.body.startTime,
                resumeTime: req.body.resumeTime,
                pauseTime: req.body.pauseTime,
                stopTime: req.body.stopTime,
                hours: req.body.hours,
                minutes: req.body.minutes,
                seconds: req.body.seconds,
                totalHours: totalHours.toFixed(2),
                status,
            });

            const savedTimer = await newTimerData.save();
            res.status(200).json(savedTimer);
        }
    } catch (error) {
        console.error("Error adding timer", error);
        res.status(403).json({ error: "Internal Server Error" });
    }
}

module.exports.timerList = async (req, res) => {
    try {
        // Retrieve the userId from the authenticated user
        const userId = req.user.id;

        // Fetch timer data for the logged in user
        const timerData = await Timer.find({ userId });

        if (timerData.length > 0) {
            res.status(200).json(timerData);
        } else {
            res.status(404).json({ result: "No Timer Data Found!" });
        }
    } catch (error) {
        console.error("Error Fetching Leave Type", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.timerListRoleWise = async (req, res) => {
    try {
        let timerData = await Timer.find();
        if (timerData.length > 0) {
            res.status(200).json(timerData);
        } else {
            res.status(404).json({ result: "No Data found!" });
        }
    } catch (error) {
        console.error("Error Fetching Role wise attendance", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// module.exports.timerList = async (req, res) => {
//     try {
//         // Retrieve the userId from the authenticated user
//         const userId = req.user.id;

//         // Filter projects to only include those less than one month old
//         const oneMonthAgo = new Date();
//         oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//         const timerData = await Timer.find({ userId, date: { $gte: oneMonthAgo } });

//         if (timerData.length > 0) {
//             res.send(timerData);
//         } else {
//             res.send({ result: "No Timer Data Found!" });
//         }
//     } catch (error) {
//         console.error("Error Fetching Leave Type", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }