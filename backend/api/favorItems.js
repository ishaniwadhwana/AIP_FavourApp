const express = require("express");
const router = express.Router();
//DBconnection
const dbConnection = require("../db_config/dbconfig");

// get favoritems.... from the database.
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

