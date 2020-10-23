const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");
const { check, validationResult } = require("express-validator");
const userAuth = require("../middleware/Auth");
const Events = require("events");
const Emitter = new Events();


router.get("/", async (req, res) => {
    try{
        const favorsIn = await dbConnection.query(`select * from favors;`);
        res.status(200).json(favorsIn.rows);
    } catch (E){
        res.status(500).send("server Error");
    }
});

router.get("/people/:favorid", async (req, res) => {
    try{
        const favor = await dbConnection.query(
            `select us.username, fav.favorid, fav.borrowerid, fav.lenderid, fav.photo, it.itemname, 
            favitem.quantity, fav.datecreated from favors as fav left join favor_item as favitem ON 
            fav.favorid=favitem.favorid left join items as it ON favitem.itemid=it.itemid left join 
            users as us ON fav.borrowerid=us.userid where fav.favorid=$1;`,
            [req.params.favorid]
        );
        res.status(200).json(favor.rows[0]);

    } catch (E){
        res.status(500).send("server Error ");
    }
});

router.get("/users/:favorid", async (req, res) => {
    try{
        const favor = await dbConnection.query(
            `select us.username, fav.favorid, fav.borrowerid, fav.lenderid, fav.photo, it.itemname,
            favitem.quantity, fav.datecreated from favors as fav left join favor_item as favitem ON
            fav.favorid=favitem.favorid left join items as it ON favitem.itemid=it.itemid left join
            users as us ON fav.lenderid=us.userid where fav.favorid=$1;`,
            [req.params.favorid]
        );
        res.status(200).json(favor.rows[0]);
    } catch (E){
        res.status(500).send("server Erro");
    }
});

router.post("/lender", auth, [
    check("quantity", "Quantity should not be 0, Enter 1 or more ").isInt({ gt: 0, lt: 20}),
],
async (req, res) => {
    const validationError  = validationResult(req);
    if(!validationError.isEmpty()){
        return res.status(400).json({error: validationError.array() });
    }
    try{
        const newFavor = await dbConnection.query(
            `INSERT INTO favors (lenderid, borrowerid, requestid) values ($1, $2, $3) returning *`,
            [req.userid, req.body.borrower, req.body.requestid] 
        );
        res.status(200).json({status: "Succes", 
            data: {
                user : newFavor.rows[0],
            },
        });
    } catch (E){
        res.status(500).send("server Error ");
    }
});

router.post("/borrower", auth, [
    check("quantity", "Quantity should not be 0, Enter 1 or more ").isInt({ gt: 0, lt: 20}),
],
async (req, res) => {
    const validationError  = validationResult(req);
    if(!validationError.isEmpty()){
        return res.status(400).json({error: validationError.array() });
    }
    try{
        const favorTaskCom = await dbConnection.query(
            `INSERT INTO favors (lenderid, borrowerid, requestid) values ($1, $2, $3) returning *`,
            [req.body.lender, req.userid, req.body.requestid] 
        );
        res.status(200).json({status: "Succes", 
            data: {
                user : favorTaskCom.rows[0],
            },
        });
    } catch (E){
        res.status(500).send("server Error ");
    }
});

router.post("/lender/complete/:favorid", async (req, res) => {
    try{
        const favorTaskCom = await dbConnection.query(
            `UPDATE favors SET datecompleted=now() where favorid = $1 returning *`,
            [req.params.favorid]
        );

        const partiesTask = await db.query(
            `select partyId from favor_party
             join favors on favor_party.favorid=favors.favorid
             where favors.favorid=$1`,
            [req.params.favorid]
        );

        if (partiesTask.rowCount !== 0){
            await dbConnection.query(
                `UPDATE party SET isactive=0 where partyid=$1 returning *`, 
                [parties.rows[0].partyid]
            );
        }

        res.status(200).json({
            status: "Success",
            data: {
                user: favorTaskCom.rows[0],
            },
        });

    }catch (E){
        res.status(500).send("Server Error")
    }
});
