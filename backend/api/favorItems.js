const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");

router.get("/", async (req, res) => {
    try{
    const favor = await dbConnection.query(
        `select DISTINCT itemName, itemId from items;`
    );

    const itemsIn = (favor.rows);

    res.json(itemsIn);

    }catch (E){
        res.status(500).send("Server Error occur");
    }
});

module.exports = router;

