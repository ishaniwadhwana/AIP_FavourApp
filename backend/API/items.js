const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");

router.get("/", async (req, res) => {
    try{
        const items = await dbConnection.query(
            `select * from items order by itemid;`
        );
        res.status(200).json(items.rows);
    }catch (E){
        res.status(500).send("server Error");
    }
});

module.exports = router;

