const LeaveRequest = require("../models/leaveRequest");
const LeaveType = require("../models/leaveType");

module.exports.addLeaveRequest = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "HR" || req.user.role === "Employee")) {
            // Fetch the leave type details based on the leaveName received in the request
            const leaveTypeDetails = await LeaveType.findOne({ leaveName: req.body.leaveName });

            if (!leaveTypeDetails) {
                return res.status(404).json({ error: "Leave type not found" });
            }

            // Fetch the entitlement from the leaveTypeDetails and store it in entitled
            const entitled = leaveTypeDetails.leaveBalance;

            // Calculate the total days according to the leaveType
            let totalDays;
            if (req.body.leaveType === "Full Day") {
                if (req.body.startDate === req.body.endDate) {
                    totalDays = 1; // Single full day
                } else {
                    const startDate = new Date(req.body.startDate);
                    const endDate = new Date(req.body.endDate);
                    totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
                }
            } else {
                totalDays = 0.5; // Half day
            }

            // Convert Date
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndex = currentDate.getMonth() + 1;
            const monthAbbreviation = monthNames[monthIndex - 1];
            const day = currentDate.getDate();
            const todayDate = `${day < 10 ? '0' : ''}${day} ${monthAbbreviation} ${year}`;

            // Fetch leave requests data for the previous month
            const previousMonthStartDate = new Date(year, monthIndex - 2, 1);
            const previousMonthEndDate = new Date(year, monthIndex - 1, 0);

            const previousMonthLeaveRequests = await LeaveRequest.find({
                userId: req.user._id,
                startDate: { $gte: previousMonthStartDate },
                endDate: { $lte: previousMonthEndDate }
            });

            // Calculate the total balanced leave for the previous month
            const previousMonthTotalBalanced = previousMonthLeaveRequests.reduce((total, request) => {
                return total + request.balanced;
            }, 0);

            const carriedForward = previousMonthTotalBalanced;

            // // Fetch leave requests data for the previous year
            // const previousYear = year - 1;
            // const previousYearStartDate = `${previousYear}-01-01`;
            // const previousYearEndDate = `${previousYear}-12-31`;

            // const previousYearLeaveRequests = await LeaveRequest.find({
            //     userId: req.user._id,
            //     startDate: { $gte: previousYearStartDate },
            //     endDate: { $lte: previousYearEndDate }
            // });

            // // Calculate the total balanced leave for the previous year
            // const previousYearTotalBalanced = previousYearLeaveRequests.reduce((total, request) => {
            //     return total + request.balanced;
            // }, 0);

            // // Calculate carriedForward for the current year
            // const carriedForward = previousYearTotalBalanced;

            const newLeaveRequest = new LeaveRequest({
                userId: req.user._id,
                userIndex: req.user.userId,
                userName: req.user.name,
                leaveType: req.body.leaveType,
                leaveName: leaveTypeDetails.leaveName, // Save the leave type ID instead of the name
                applyingDate: todayDate,
                totalDays: totalDays,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                description: req.body.description,
                status: req.body.status || "Pending",
                entitled: entitled, // Store the entitled value
                utilized: req.body.utilized,
                balanced: entitled,
                carriedForward: carriedForward,
            });

            const savedLeaveRequest = await newLeaveRequest.save();
            res.status(200).json(savedLeaveRequest);
        } else {
            // User is not an HR, deny access
            res.status(403).json({ error: "Access Denied" });
        }
    } catch (error) {
        console.error("Error Creating Leave Request", error);
        res.status(403).json({ error: "Internal Server Error" });
    }
}

module.exports.updateLeaveReqStatus = async (req, res) => {
    try {
        // Check if the user making the request is an admin
        if (req.user && (req.user.role === "Admin" || req.user.role === "HR")) {
            const { leaveRequestId, newStatus } = req.body;

            // Validate if newStatus is one of the allowed values
            const allowedStatusValues = ["Approved", "Rejected"];

            if (!allowedStatusValues.includes(newStatus)) {
                return res.status(400).json({ error: 'Invalid status value' });
            }

            // Find the leave request by ID
            const leaveRequest = await LeaveRequest.findById(leaveRequestId);

            if (!leaveRequest) {
                return res.status(404).json({ error: 'Leave request not found' });
            }

            // If the status is being updated to 'Approved'
            if (newStatus === 'Approved') {
                // Update the utilized and balanced fields based on the total days of leave
                const totalDays = leaveRequest.totalDays;

                // Calculate the leave request with the new values
                const utilized = leaveRequest.utilized + totalDays;
                const balanced = leaveRequest.entitled - utilized;

                // Update the leave request with the new values
                const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
                    leaveRequestId,
                    { status: newStatus, utilized, balanced },
                    { new: true }
                );

                return res.status(200).json({ message: "Leave status updated successfully", leaveRequest: updatedLeaveRequest });
            } else {
                // For other status updates, simply update the status
                const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
                    leaveRequestId,
                    { status: newStatus },
                    { new: true }
                );

                res.status(200).json({ message: "Leave status updated successfully", leaveRequest: updatedLeaveRequest });
            }
        } else {
            // User is not an admin, deny access
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (error) {
        console.error('Error Updating Leave Request Status', error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports.leaveRequestList = async (req, res) => {
    try {
        // Retrieve the user ID from the authenticated user
        const userId = req.user._id;

        // Fetch Leave requests for the logged-in-user
        const leaveRequests = await LeaveRequest.find({ userId });

        if (leaveRequests.length > 0) {
            res.status(200).json(leaveRequests);
        } else {
            res.status(404).json({ result: "No Leave Request Found!" });
        }
    } catch (error) {
        console.error("Error Fetching Leave Request", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.leaveRequestListRoleWise = async (req, res) => {
    try {
        // Retrieve the use role and ID from the authenticated user
        const { role, _id: userId } = req.user;

        let leaveRequests;

        if (role === "Admin") {
            // If the user is an admin, fetch all leave requests
            leaveRequests = await LeaveRequest.find();
        } else if (role === "HR") {
            // If the user is HR, fetch only employee leave requests
            leaveRequests = await LeaveRequest.find({ userId: 'Employee', userId: { $ne: userId } });
        } else {
            // If the user is an employee, fetch only their own leave requests
            leaveRequests = await LeaveRequest.find({ userId });
        }

        if (leaveRequests.length > 0) {
            res.status(200).json(leaveRequests);
        } else {
            res.status(404).json({ result: "No Leave Request Found!" });
        }

    } catch (error) {
        console.error("Error Fetching Leave Request", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Function to fetch all leave types and their balances
const fetchLeaveTypes = async () => {
    try {
        const leaveTypes = await LeaveType.find({}, {
            leaveName: 1,
            leaveBalance: 1
        });
        return leaveTypes;
    } catch (error) {
        console.error("Error Fetching Leave Types", error);
    }
}

// Function to fetch leave request data for a specific user
const fetchLeaveRequests = async (userId) => {
    try {
        const leaveRequests = await LeaveRequest.find({ userId });
        return leaveRequests;
    } catch (error) {
        console.error("Error Fetching Leave Requests", error);
    }
}

module.exports.fetchLeaveData = async (req, res) => {
    try {
        // Retrieve the user ID from the authenticated user
        const userId = req.user._id;

        // Fetch all leave types and their balances
        const leaveTypes = await fetchLeaveTypes();

        // Fetch leave request data for the specific user
        const leaveRequests = await fetchLeaveRequests(userId);

        // Calculate the total utilized, balanced, and carried forward for each leave type
        const leaveData = leaveTypes.map((leaveType) => {
            const { leaveName, leaveBalance } = leaveType;
            const leaveTypeRequests = leaveRequests.filter((request) => request.leaveName === leaveName);

            const totalUtilized = leaveTypeRequests.reduce((acc, curr) => acc + curr.utilized, 0);
            const totalCarriedForward = leaveTypeRequests.reduce((acc, curr) => acc + curr.carriedForward, 0);
            const totalBalanced = leaveBalance - totalUtilized + totalCarriedForward;

            return {
                leaveName,
                leaveBalance,
                totalUtilized,
                totalBalanced,
                totalCarriedForward,
            };
        });

        res.status(200).json(leaveData);
    } catch (error) {
        console.error("Error Fetching Leave Data", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}