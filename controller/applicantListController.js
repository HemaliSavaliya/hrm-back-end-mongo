const ApplicantList = require("../models/applicantList");

// add applicantList html mathi perfect work kare che
module.exports.addApplicantList = async (req, res) => {
    try {
        const newApplicantList = new ApplicantList({
            applicantName: req.body.applicantName,
            applicantEmail: req.body.applicantEmail,
            jobTitle: req.body.jobTitle,
            phoneNumber: req.body.phoneNumber,
            cv: req.body.cv,
        });

        const savedApplicantList = await newApplicantList.save();
        res.status(200).json(savedApplicantList);
    } catch (error) {
        console.error("Error Adding Applicant List", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.applicantList = async (req, res) => {
    try {
        let applicant = await ApplicantList.find();
        if (applicant.length > 0) {
            res.status(200).json(applicant);
        } else {
            res.status(404).json({ result: "No Applicant List found!" });
        }
    } catch (error) {
        console.error("Error Fetching Applicant List", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}