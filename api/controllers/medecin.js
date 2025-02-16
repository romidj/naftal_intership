import db from "../db.js";

export const listEmpEnAttente = (req, res) => {
    const year = new Date().getFullYear(); // Current year

    const query = `
        SELECT 
            c.id_convo, c.convo_year,  -- Use primary key from convocation table
            e.employee_id, e.employee_name, 
            DATE_FORMAT(e.date_naissance, '%Y-%m-%d') AS date_naissance,
            DATE_FORMAT(c.rdv_date, '%Y-%m-%d') AS rdv_date, 
            c.rdv_hour, c.centre_medical, c.medecin, c.rdv_state, c.convo_state,
            d.nom AS direction_name
        FROM employee e
        JOIN convocation c ON e.employee_id = c.id_emp
        JOIN direction d ON e.direction_id = d.direction_id
        WHERE c.convo_year = ? AND c.rdv_state = 'en_attente' AND c.convo_state = 'sent'
    `;

    db.query(query, [year], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        // Return the list of employees along with convocation primary key
        res.json(results);
    });
};

export const listEmpTermine = (req, res) => {
    const year = new Date().getFullYear(); // Current year

    const query = `
        SELECT 
            c.convo_year, c.id_convo, -- Use primary key from convocation table
            e.employee_id, e.employee_name, 
            DATE_FORMAT(e.date_naissance, '%d-%m-%Y') AS date_naissance,
            DATE_FORMAT(c.rdv_date, '%d-%m-%Y') AS rdv_date, 
            c.rdv_hour, c.centre_medical, c.medecin, c.rdv_state, c.convo_state,
            d.nom AS direction_name
        FROM employee e
        JOIN convocation c ON e.employee_id = c.id_emp
        JOIN direction d ON e.direction_id = d.direction_id
        WHERE c.convo_year = ? AND c.rdv_state = 'termine' 
    `;

    db.query(query, [year], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        // Return the list of employees along with convocation primary key
        res.json(results);
    });
};
