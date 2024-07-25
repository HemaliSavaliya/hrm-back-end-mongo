const CalendarTodo = require("../models/calendarTodo");

module.exports.addCreateTodos = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const newTodo = new CalendarTodo({
                name: req.body.name,
                color: req.body.color
            });

            const savedTodo = await newTodo.save();
            res.status(200).json(savedTodo);
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Creating Calendar todos", error);
        res.status(403).json({ error: "Internal Server Error" });
    }
}

module.exports.updateTodos = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const updateTodo = await CalendarTodo.updateOne(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )

            if (!updateTodo) {
                return res.status(404).json({ error: "Todos not found" });
            }

            res.status(200).json(updateTodo);
        } else {
            // User is not an admin and HR, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error updating calendar todos", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteTodos = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const todos = await CalendarTodo.deleteOne({ _id: req.params.id });
            res.status(200).json(todos);
        } else {
            // User is not an admin and HR, deny access
            res.status(403).json({ error: 'Access Denied' });
        }
    } catch (error) {
        console.error("Error deleting todos", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.createTodosList = async (req, res) => {
    try {
        let todosList = await CalendarTodo.find();
        if (todosList.length > 0) {
            res.status(200).json(todosList);
        } else {
            res.status(404).json({ result: "No Calendar Todos" });
        }
    } catch (error) {
        console.error("Error Fetching Calendar Todos", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}