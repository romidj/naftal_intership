import db from "../db.js";


export const infoEMP = (req, res) => {
    const year = new Date().getFullYear();
    const employeeId = req.params.employeeId;

    const query = `
        SELECT e.employee_name, e.outlook, e.phone_nbr, e.address, 
               DATE_FORMAT(e.date_naissance, '%Y-%m-%d') AS date_naissance,
               e.poste,
               DATE_FORMAT(c.rdv_date, '%Y-%m-%d') AS rdv_date, 
               c.rdv_hour, c.centre_medical, c.medecin, c.rdv_state, c.convo_state,
               d.nom AS direction_name
        FROM employee e
        JOIN convocation c ON e.employee_id = c.id_emp
        JOIN direction d ON e.direction_id = d.direction_id
        WHERE e.employee_id = ? AND c.convo_year = ?
    `;

    db.query(query, [employeeId, year], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
};



export const infoemployees = (req, res) => {
    const directionId = req.params.directionId;
    const year = new Date().getFullYear();


    const query = `
        SELECT e.employee_id, e.employee_name, e.outlook, e.phone_nbr, c.convo_state, c.rdv_state ,d.nom AS direction_name
        FROM employee e
        JOIN convocation c ON e.employee_id = c.id_emp
        JOIN direction d ON e.direction_id = d.direction_id
        WHERE e.direction_id = ? AND c.convo_year = ?

    `;

    db.query(query, [directionId, year], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });

};

export const infodirection = (req, res) => {


    const query = `
    SELECT 
        d.direction_id, 
        d.nom AS direction_name, 
        COUNT(DISTINCT e.employee_id) AS number_of_employees, -- Use DISTINCT to avoid double-counting employees
        COUNT(DISTINCT CASE WHEN c.convo_state = 'sent' AND c.convo_year = YEAR(CURDATE()) THEN c.id_emp END) AS number_of_sent_convocations, 
        COUNT(DISTINCT CASE WHEN c.rdv_state = 'termine' AND c.convo_year = YEAR(CURDATE()) THEN c.id_emp END) AS number_of_termine_rdv
    FROM 
        direction d
    LEFT JOIN 
        employee e ON d.direction_id = e.direction_id
    LEFT JOIN 
        convocation c ON e.employee_id = c.id_emp
    GROUP BY 
        d.direction_id, d.nom;

  


    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });


}

export const updateRdvState = (req, res) => {
    const employeeId = req.params.id;
    const newRdvState = req.body.rdv_state;

    const query = `
        UPDATE convocation
        SET rdv_state = ?
        WHERE id_emp = ?
    `;

    db.query(query, [newRdvState, employeeId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database update failed' });
        }
        res.json({ success: true });
    });
};

export const dashbord = (req, res) => {
    const query = `
    SELECT 
    COUNT(DISTINCT e.employee_id) AS total_employees,
    COUNT(CASE WHEN c.convo_state = 'sent' AND c.convo_year = YEAR(CURDATE()) THEN 1 END) AS total_sent_convocations,
    COUNT(CASE WHEN c.rdv_state = 'en_attente' AND c.convo_year = YEAR(CURDATE()) THEN 1 END) AS total_rdv_en_attente,
    COUNT(CASE WHEN c.rdv_state = 'rate' AND c.convo_year = YEAR(CURDATE()) THEN 1 END) AS total_rdv_rate,
    COUNT(CASE WHEN c.rdv_state = 'termine' AND c.convo_year = YEAR(CURDATE()) THEN 1 END) AS total_rdv_termine
    FROM 
    employee e
    LEFT JOIN 
    convocation c ON e.employee_id = c.id_emp
    WHERE
    c.convo_year = YEAR(CURDATE());
`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });

}
