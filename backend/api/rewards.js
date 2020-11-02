const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");
const { check , validationResult } = require ("express-validator");
const userAuth = require("../middleware/Auth");


router.get("/:requestid", async (req, res) => {
    try {
      const userRewards = await dbConnection.query(
        `select rewards.*, itemname, username
              from rewards 
              join items
              on items.itemid=rewards.itemid
              join users
              on rewards.userid=users.userid
              where requestid=$1`,
        [req.params.requestid]
      );
  
      res.json(userRewards.rows);
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });

  router.get("/:requestid/total", async (req, res) => {
    try {
      const totalRewards = await dbConnection.query(
        `select rewards.itemid, itemname, sum(rewards.quantity) as total	
        from rewards 	
        join items	
        on items.itemid=rewards.itemid	
        where requestid=$1	
        group by rewards.itemid, itemname`,
        [req.params.requestid]
      );
  
      res.json(totalRewards.rows);
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });

  router.post( "/:requestid", userAuth,[
      check("itemid", "Please select the item").isInt(),
      check("quantity", "Please enter the quantity greater than 0").isInt({ gt: 0, lt: 21 }),
    ], async (req, res) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
      }
  
      try {
        const isRewardExist = await dbConnection.query(
          `select * from rewards where requestid=$1 and itemid=$2 and userid=$3`,
          [
            req.params.requestid,
            req.body.itemid,
            req.userid
          ]
        )
        if (isRewardExist.rows.length === 0) {
          const newReward = await db.query(
            `INSERT INTO rewards (requestid, itemid, quantity, userid) values ($1, $2, $3, $4) returning *`,
            [
              req.params.requestid,
              req.body.itemid,
              req.body.quantity,
              req.userid,
            ]
          );
          res.json(newReward.rows[0])
        } else {
          const updatedReward = await db.query(
            `UPDATE rewards SET quantity = quantity + $1 where rewardid=$2 returning *`,
            [
              req.body.quantity,
              isRewardExist.rows[0].rewardid
            ]
          );
          res.json(updatedReward.rows[0])
        }
  
  
      } catch (E) {
        console.error(E.message);
        if (E instanceof TypeError) {
          return res.status(404).json({ msg: "Request not found" });
        }
        res.status(500).send("Server Error");
      }
    });

    router.delete("/:rewardId", userAuth, async (req, res) => {
        try {
          // Check if the user is the requester
          let rewarder = await dbConnection.query(
            `select userId from rewards where rewardId=$1`,
            [req.params.rewardId]
          );

          if (rewarder.rows[0].userid != [req.userid]) {
            return res.status(401).json({ msg: "User not authorised" });
          }
      
          await dbConnection.query(`delete from rewards where rewardId=$1 returning *`,
            [req.params.rewardId,]
          );
          res.json({ msg: "Reward removed" });
        } catch (E) {
          console.error(E.message);
          if (E instanceof TypeError) {
            return res.status(404).json({ msg: "Reward not found" });
          }
          res.status(500).send("Server Error");
        }
      });
      
      module.exports = router;
      