import db from "../db.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const emailSend = (req, res) => {
    console.log("Received request with body:", req.body);
    const { selectedEmployees, message, userPassword, selectedEmployeesIds, rdv_date, rdv_hour, centre_medical, medecin } = req.body;
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("Access Denied");

    // Verify the JWT token
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(403).json("Invalid Token");

        // Fetch the user's email from the database
        const q = "SELECT email FROM usera WHERE id = ?";
        db.query(q, [decoded.id], (err, data) => {
            if (err) return res.status(500).json("Database error");
            if (data.length === 0) return res.status(404).json("User not found");

            const userEmail = data[0].email;

            // Validate selectedEmployees
            if (!selectedEmployees || selectedEmployees.length === 0) {
                return res.status(400).json("No recipients defined");
            }
            console.log("Attempting to send email...");

            // Create a transporter object using the provided Gmail credentials
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: userEmail,
                    pass: userPassword // Use the provided Gmail password
                }
            });

            // Define email options
            const mailOptions = {
                from: userEmail,
                to: selectedEmployees.join(','), // Join array into a comma-separated string
                subject: 'Convocation visite médicale annuelle',
                text: message,
            };

            // Attempt to send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    // If sending fails, return an error response
                    console.error('Error sending email:', error);
                    return res.status(500).json(`Error sending email: ${error.message}`);
                }

                // Update convo_state to 'sent' for each selected employee
                const year = new Date().getFullYear();
               

                // Build query with placeholders for each ID
                const placeholders = selectedEmployeesIds.map(() => '?').join(',');
                const updateQuery = `
                UPDATE convocation
                SET
                    rdv_date = ?,
                    rdv_hour = ?,
                    centre_medical = ?,
                    medecin = ?,
                    convo_state = 'sent'
                WHERE
                    id_emp IN (${placeholders})
                    AND convo_year = ?
                    AND convo_state = 'not_sent';
            `;

                const queryParams = [
                    rdv_date,
                    rdv_hour,
                    centre_medical,
                    medecin,
                    ...selectedEmployeesIds,
                    year
                ];

                db.query(updateQuery, queryParams, (err, results) => {
                    if (err) {
                        console.error('Error updating convo_state:', err);
                        return res.status(500).send('Error updating convo_state');
                    }
                    console.log("Email sending function executed.");
                    // If sending is successful and the database is updated, return a success response
                    res.status(200).json('Emails sent successfully and convo_state updated!');
                });
            });
        });
    });
};
