const CalendarEvent = require("../models/calendarEvent");
const CalendarTodo = require("../models/calendarTodo");

module.exports.addCalendarEvent = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            // Check if the provided todoId exist in the users collection or not
            const todoExists = await CalendarTodo.findOne({
                _id: req.body.todoId,
            });

            if (!todoExists) {
                // If the user does't exist, return an error
                return res.status(404).json({ error: "Invalid todoName" });
            }

            // If the user exists and no existing event, proceed to save the award
            const newEvent = new CalendarEvent({
                description: req.body.description,
                start: req.body.start,
                end: req.body.end,
                todoId: todoExists._id,
            });

            const savedEvents = await newEvent.save();
            res.status(200).json(savedEvents);
        } else {
            // User is not an admin and HR, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Creating calendar event", error);
        res.status(403).json({ error: "Internal Server Error" });
    }
}

module.exports.updateCalendarEvent = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const updatedEvents = await CalendarEvent.updateOne(
                { _id: req.params.id },
                { $set: req.body },
                { new: true },
            )

            if (!updatedEvents) {
                return res.status(404).json({ error: "Calendar Event not Found" });
            }

            res.status(200).json(updatedEvents);
        } else {
            // User is not an admin and HR, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error updating calendar event", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteCalendarEvent = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const event = await CalendarEvent.deleteOne({ _id: req.params.id });
            res.status(200).json(event);
        } else {
            // User is not an admin and Hr, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error deleting calendar events", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.calendarEventList = async (req, res) => {
    try {
        let calendarEventList = await CalendarEvent.find();
        if (calendarEventList.length > 0) {
            res.status(200).json(calendarEventList);
        } else {
            res.status(404).json({ results: "No Calendar Events Found!" });
        }
    } catch (error) {
        console.error("Error Listing Events", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}