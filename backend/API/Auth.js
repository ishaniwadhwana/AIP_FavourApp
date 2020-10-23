const express = require("express");
const router = express.Router();
const jwtToken = require("jsonwebtoken");
const cookieHandler = require("cookie-parser");
const bcryptjs = require("bcryptjs");

router.use(cookieHandler());
const superSecret = "superSecret";

const dbConnection = require("../db_config/dbconfig");

//Login AUTH... POST request

router.post("/login", async (req, res) => {

    // console.log("IN login.... ");
    const email = req.body;
    const password = req.body;
    try{
        const query = await dbConnection.query(
            `Select * from users where email = $1`, [email]
        );

        if(query.rowCount == 0){
            return res
                .satus(400)
                .json(
                        {error: [{msg:  "Email not found in database", title: "Email"}]}
                    )
        }
        const GenHash = query.rows[0].password;
        const isPassCorrect = bcryptjs.compareSync(password, GenHash);

        if(!isPassCorrect){
            return res
                    .status(400)
                    .json(
                        {error: [{msg: "Password is incorrect", title: "Password"}]}
                    )
        }

        let userID = {id : query.rows[0].userid};
        let TokenTime = jwtToken.sign(
            userID, 
            superSecret, 
            {expiresIn: '1 hours'}
        )

        res.cookie('jwtToken', TokenTime, {
            httpOnly: true,
            sameSite: 'strict'
        });

        return res
                .status(200)
                .send("you have logged in into the system")
    }catch (E){
        console.log("Error while Featching the data", E)
    }

});

//get reuest... 

router.get("/isLoggedIn", (req, res) => {
    
    try{    
        if(req.cookies.jwtToken){
            let userID = jwtToken.verify(
                req.cookies.jwtToken,
                superSecret
            );
            
            res.status(200)
                .json(
                    {satus: "Succesfull", data: {userid: userID.id}, }
                )
            
        } else{
            res.status(400)
                .send("you have logged in the system");
        }

    }catch (E){
        res.status(400)
            .send("your Token Key is Invalid/Expired: Please LOGIN in again")
    }
});

router.get("/logout", (req, res) => {

    try{
        let userID = {id : 0};
        let TokenTime = jwtToken.sign(
            userID, 
            superSecret,
            {expiresIn: '-1 minutes'}
        );
        res.cookie("jwtToken", TokenTime, {
            httpOnly: true,
            sameSite: 'strict'
        });

        return res.status(200)
                    .send("you have logout from the system")
    }catch (E){
        res.status(400)
            .send("error at Logout get ", E)
    }
});


router.get("/Test", async (req, res) => res.send("this is Test Auth API and the default route"));




module.exports = router;