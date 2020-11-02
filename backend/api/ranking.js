const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");
var async = require("async");

router.get("/", (req, res) => {
    var query1 = `SELECT u.username as User, 
    COUNT(*) as Total_Favors_Given
    FROM favors f JOIN users u
    ON f.lenderId = u.userId
    GROUP BY u.username
    ORDER BY Total_Favors_Given DESC
    LIMIT 10;`


    var query2 = `SELECT u.username as User, 
    COUNT(*) as Total_Favors_Received
    FROM favors f JOIN users u
    ON f.borrowerId = u.userId
    GROUP BY u.username
    ORDER BY Total_Favors_Received DESC
    LIMIT 10;`


    var renderData = {};

    async.parallel([
        function (parallelProcessing){
            dbConnection.query(
                query1, [], function (E, results){
                    if (E){ return parallelProcessing(E); }
                    renderData.table1 = results;
                    parallelProcessing();
                });
        }
    ],
    function (E){
        if (E) {console.log(E);}
        res.send(renderData);
    });
});

module.exports = router;