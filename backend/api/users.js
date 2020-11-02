const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");
const bcryptJS = require("bcryptjs");
const { check , validationResult } = require ("express-validator");
const uniCodeVald = require("../handler/unicodeValHandler");
// check the usersname is valid or not
// check if the password is matching or not..
//check if the email is valid or not.
router.post("/",
    [
      check("username", "Username is required").not().isEmpty(),
      check("username", "Username should be between 3 and 20 characters in English").isLength({ min: 3, max: 20 }),
      check("email", "Please include a valid email").isEmail(),
      check("passwords", "Please enter a password between 6 and 128 characters").isLength({ min: 6, max: 128 }),
    ], async (req, res) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
      }
  
      try {
        // Check if user exists
        let newUserEmail = await dbConnection.query(`select * from users where email=$1`, [
          req.body.email,
        ]);
  
        let newUserName = await dbConnection.query(`select * from users where username=$1`, [
          req.body.username,
        ]);
  
        const usernameLangCheck = uniCodeVald(req.body.username)
  
        if (newUserEmail.rows.length !== 0) {
          return res
            .status(400)
            .json({ errors: [{ msg: "The email already exists" }] });
        } else if (newUserName.rows.length !== 0) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Username already exists" }] });
        } else if (usernameLangCheck) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Username cannot include non-English" }] });
        }
  
        // Encrypt password
        const genSalt = await bcryptJS.genSalt(10);
  
        const encryptedPassword = await bcryptJS.hash(req.body.passwords, genSalt);
  
        // Add user
        const results = await dbConnection.query(
          `INSERT INTO users (username, email, passwords) values ($1, $2, $3) returning *`,
          [req.body.username, req.body.email, encryptedPassword]
        );
  
        res.status(200).json({
          status: "success",
          data: {
            user: results.rows[0],
          },
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    }
  );
  
  
  module.exports = router;
  