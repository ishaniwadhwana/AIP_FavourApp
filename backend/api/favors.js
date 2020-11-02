const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");
const { check, validationResult } = require("express-validator");
const userAuth = require("../middleware/Auth");
const Events = require("events");
const Emitter = new Events();

// get items from favors table...
router.get("/", async (req, res) => {
    try{
        const favorsIn = await dbConnection.query(`select * from favors;`);
        res.status(200).json(favorsIn.rows);
    } catch (E){
        res.status(500).send("server Error");
    }
});
// favors:id from user profile to check about the favors own by other.
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
// favors:id from user profile to check about the favors own by user
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
// check the input... by users
router.post("/lender", userAuth, [
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
// check the input by users on borrowers page. 
router.post("/borrower", userAuth, [
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
// check if the favor is completed or not by users
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
// check if the favor is completed or not by borrower..
router.post("/borrower/complete/:favorid", async (req, res) => {
    try{
        const isPicUploaded = await dbConnection.query(
            `select * from favors where favorid=$1 and photo is not null`,
            [req.params.favorid]
        );
        if(isPicUploaded.rowCount === 0){
            return res.status(400).json({ msg: "your submited pic is not uploaded"});
        } 

        const updateFavorTaskCom = await dbConnection.query(
            `UPDATE favors SET datecompleted=now() where favorid = $1 returning *`,
            [req.params.favorid]
        );

        const partiesTask = await dbConnection.query(
            `select partyId from favor_party
                join favors on favor_party.favorid=favors.favorid
                where favors.favorid=$1`, 
                [req.params.favorid]
        );

        if(partiesTask.rowCount !== 0){
            await dbConnection.query(
                `UPDATE party SET isactive=0 where partyid=$1 returning *`, [parties.rows[0].partyid]
            );
        }

        res.status(200).json({
            status: "success",
            data: {
                user: updateFavorTaskCom.rows[0],
            },
        });
    }catch(E){
        res.status(500).send("server Error")
    }
});
// insert into the table for favor items
router.post("/:favorid/items", async (req, res) => {
    try{
        const newFavoritem = await dbConnection.query(
            `INSERT INTO favor_item (favorid, itemID, quantity) values ($1, $2, $3) returning *`,
            [req.params.favorid, req.body.task, req.body.quantity]
        );
        res.status(200).json({
            status: "success",
            data: {
                user: newFavoritem.rows[0],
            },
        });

    }catch(E){
        res.status(500).send("server Error");
    }
});

// fetch the items from the table
router.get("/items", async (req, res) => {
    try{
        const favorIn = await dbConnection.query(
            `select * from favor_item order by favoritemid;`
        );
        res.status(200).json(favorIn.rows);
    }catch(E){
        res.status(500).send("Serrer Error");
    }
});
// favor delete... 
router.delete("/:favorid", async (req, res) => {
    try{
        await dbConnection.query(
            `delete from favor_item where favorid=$1`, [req.params.favorid]
        );
        await dbConnection.query(
            `delete from favor_party where favorid=$1`, [req.params.favorid]
        );
        await dbConnection.query(
            `delete from favors where favorid=$1`, [req.params.favorid]
        );
        res.status(200).json({msg: "Favor is deleted"});

    }catch (E){
        if(E instanceof TypeError){
            return res.status(404).json({msg: "Favor not found in database"});
        }
        res.status(500).send("server Error");
    }
});
// fetch the users from the database
router.get("/users", async (req, res) => {
    try{
        const appUsers = await dbConnection.query(
            `select DISTINCT userid, username from users WHERE NOT userid=$1 order by userid`, [req.userid]
        );
        res.status(200).json(appUsers.rows);
    }catch (E){
        res.status(500).send("server Error")
    }
});


module.exports = router;

