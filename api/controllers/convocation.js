import db from "../db.js";  // Ensure this path is correct
import bodyParser from 'body-parser';



export const Message = (req, res) => {
    const { template } = req.body;

    // Validate input
    if (!template) {
        return res.status(400).json({ error: "Template is required" });
    }

    // Check if the template already exists
    const checkQuery = "SELECT * FROM message_template WHERE template = ?";
    db.query(checkQuery, [template], (err, results) => {
        if (err) {
            console.error("Database error during check:", err);
            return res.status(500).json({ error: "Database error during check" });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: "Template already exists" });
        }

        // Insert new template
        const insertQuery = "INSERT INTO message_template (template) VALUES (?)";
        db.query(insertQuery, [template], (err, results) => {
            if (err) {
                console.error("Database error during insertion:", err);
                return res.status(500).json({ error: "Database error during insertion" });
            }

            return res.status(200).json({ message: "Template added successfully" });
        });
    });
}

//generer des convocations pour tous les employees chaque annee 

export const ConvoAnnuaire = (req,res) => {
    const year = new Date().getFullYear();
    const query = `INSERT INTO convocation (convo_state, rdv_state, id_emp, convo_year)
                   SELECT 'not_sent', 'en_attente', employee_id, ? 
                   FROM employee`;

    db.query(query, [year], (err, result) => {
        if (err) {
            console.error('Error generating convocations:'
                , err);
            return res.status(500).json({ message: 'Failed to generate convocations.' });
        }
        res.status(200).json({ message: `${result.affectedRows} convocations generated for the year ${year}.` });
    });
}


