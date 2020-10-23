const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");

const userAuth = require("../middleware/Auth");


router.get("/", userAuth, async (req, res) => {
    try{
        const favorsIn = await dbConnection.query(
        `select favors.favorid, lenderid, borrowerid, party.partyid, isactive 
        from favors 
        join favor_party on favors.favorid=favor_party.favorid 
        join party on favor_party.partyid = party.partyid
        where (lenderid=$1 or borrowerid=$1)
        and isactive=1`,
            [req.userid]
        );
        res.status(200).json(favorsIn.rows)
    }catch(E){
        res.status(500).send("Server Error");
    }
}); 

router.get("/:favorid", userAuth, async (req, res) => {
    try {
        const favorResult = await dbConnection.query(
            `select * from favor_party 
            join party on party.partyid=favor_party.partyid 
            where favorid=$1 and isactive=1`,
            [req.params.favorid]
        );
        res.status(200).json(favorResult.rows);
    } catch (E) {
        res.status(500).send("server Error");
    }
});

router.get("/:favorid/:partyid", userAuth, async (req, res) => {
    try {
        const favorResult = await dbConnection.query(
            `select party.*, username
            from party 
            join favor_party on favor_party.partyid=party.partyid 
            join favors on favor_party.favorid=favors.favorid 
            join users on users.userid=favors.lenderid 
            where party.partyid=$1 and isactive=1`,
            [req.params.partyid]
        );
        res.status(200).json(favorResult.rows);
    } catch (E) {
        res.status(500).send("serrver error")
    }   
});

router.post("/trigger", async (req, res) => {
    try {
        const favorResult = await dbConnection.query(
            `select favors.favorid, favors.lenderid, favors.borrowerid, itemid, quantity
            from favors
            join favor_item
            on favors.favorid=favor_item.favorid
            where datecompleted is null
            and party is null;`
        );
        const favorResultData = favorResult.rows;
        let isPartyAct = fasle;

        let firstFavor, secondFavor, thirdFavor;

        if(favorResultData.length !== 0){
            for (i = 0; i < favorResultData.length -1; i++){
                for(j = i + 1; j < favorResultData.length; j++){
                    if(favorResultData[i].lenderid === favorResultData[j].borrowerid && favorResultData[i].itemid === favorResultData[j].itemid && favorResultData[i].quantity === favorResultData[j].quantity){
                        for(n = 0; n < favorResultData.length; n++){
                            if (favorResultData[j].lenderid === favorResultData[n].borrowerid && favorResultData[n].lenderid == favorResultData[i].borrowerid && favorResultData[j].itemid === favorResultData[n].itemid && favorResultData[j].quantity === favorResultData[n].quantity){
                                isPartyAct = true;
                                firstFavor = favorResultData[i];
                                secondFavor = favorResultData[j];
                                thirdFavor = favorResultData[n];
                            }
                        }
                    }
                }
            }

            if (isPartyAct){
                try {
                    await dbConnection.query(
                        `UPDATE favors SET party = 1 where favorId in ($1, $2, $3)`,
                        [firstFavor.favorid, secondFavor.favorid, thirdFavor.favorid]
                    );
                    const newParty = await dbConnection.query(
                        `INSERT INTO party (isactive) values (1) returning *`
                    );
                    const newPartyID = newParty.rows[0].partyid
                    await dbConnection.query(
                        `INSERT INTO favor_party (favorid, partyid) values ($1, $4), ($2, $4), ($3, $4) returning *`,
                        [firstFavor.favorid, secondFavor.favorid, thirdFavor.favorid, newPartyId]
                    );    
                } catch (E) {
                    console.error(E.message);
                }
            } //innner if end


        }// main if end
        res.status(200).json({msg: "Party has been detected "});
       
    } catch (E) {
        res.status(500).send("server error");
    }
});

module.exports = router;