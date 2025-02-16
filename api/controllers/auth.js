import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
    // CHECK EXISTING USER
    const q = "SELECT * FROM usera WHERE email = ? OR username = ?";

    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.json(err);
        if (data.length) return res.status(409).json("User already exists");

        // Encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Corrected typo in the SQL query and adjusted value handling
        const q = "INSERT INTO usera(`username`, `email`, `password`) VALUES (?)";
        const values = [
            req.body.username,
            req.body.email,
            hash,
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json("User has been created");
        });
    });
};


export const login = (req, res) => {
    const q = "SELECT * FROM usera WHERE username= ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found");

        // Check password
        const isPwdCorrect = bcrypt.compareSync(req.body.password, data[0].password);

        if (!isPwdCorrect) return res.status(400).json("Wrong username or password");

        const userRole = data[0].role;
        const token = jwt.sign({ id: data[0].id, role: userRole }, 'secret_key', { expiresIn: '1h' });

        res.json({ token, role: userRole });
    });
};

export const logout = (req, res) => {

}



export const getUserProfile = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) return res.status(401).json("Access Denied");

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(403).json("Invalid Token");

        const userId = decoded.id;

        const q = "SELECT username, email FROM usera WHERE id = ?";
        db.query(q, [userId], (err, data) => {
            if (err) return res.status(500).json("Database error");
            if (data.length === 0) return res.status(404).json("User not found");

            res.json(data[0]); // Return the name and email
        });
    });
};
