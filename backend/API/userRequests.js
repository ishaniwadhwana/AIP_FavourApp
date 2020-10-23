const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");
const { check , validationResult } = require ("express-validator");

const userAuth = require("../middleware/Auth");
const uniCodeVald = require("../handler/unicodeValHandler");

router.get("/", async (req, res) => {
    try {
        const userRequests = await dbConnection.query(
            `select requests.*, username
                  from requests 
                  join users
                  on userid=requesterid
                  where fullfillerid is null
                  order by requestid;`
          );
          res.status(200).json(userRequests.rows);
    } catch (E) {
        res.status(500).send("Server Error");
    }
});

router.post("/", userAuth, [
    check("task", "Please include the description of the task").not().isEmpty(),
    check("task", "Task should be less than 250 characters in English").isLength({ max: 250 }),
], async(req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    try {
        const userTask= req.body.task;
        const userResult = uniCodeVald(userTask);

        if(userResult){
            return res.status(400).json({
                errors: {
                    msg: "non-Englished is used, check for the language used"
                }
            });
        }
        const newUserRequest = await dbConnection.query(
            `INSERT INTO requests (requesterid, task) values ($1, $2) returning *`,
            [req.userid, req.body.task]
        );

        res.status(200).json({
            status: "success",
            data: {
                user: newUserRequest.rows[0],
            },
        });


    } catch (E) {
        res.status(500).send("Server Error");
    }
});

router.post("/:requestid", userAuth, async (req, res) => {
    try {
        let requester = await dbConnection.query(
            `select requesterid from requests where requestid=$1`,
            [req.params.requestid]
          );
    
          // Requester cannot complete the task
          if (requester.rows[0].requesterid != [req.userid]) {
            const hasPic = await dbConnection.query(
              `select photo from requests where requestid = $1`,
              [req.params.requestid]
            );
    
            // Return error if there is no photo
            if (hasPic.rows[0].photo == null) {
              return res.status(400).json({ msg: "Photo not uploaded" });
            }
    
            const completedRequest = await dbConnection.query(
              `UPDATE requests SET fullfillerid = $1, datefinished=now() where requestid = $2 returning *`,
              [req.userid, req.params.requestid]
            );
            // console.log(completedRequest.rows[0]);
    
            res.status(200).json({
              status: "success",
              data: {
                user: completedRequest.rows[0],
              },
            });
          } else {
            return res.status(404).json({ msg: "Requester cannot complete their own request" });
          }
    } catch (E) {
        if(E instanceof TypeError){
            return res.status(404).json({msg: "Requester not found"});
        }
        res.status(500).send("Server Error")
    }
});

router.delete("/:requestid", userAuth, async (req, res) => {
    try {
      // Check if the user is the requester
      const requester = await dbConnection.query(
        `select requesterid from requests where requestid=$1`,
        [req.params.requestid]
      );
      // console.log(requester.rows[0].requesterid)
      // This is hard coded now. Need to change it using req.params.id after authentication is implemented
      // Requester can change the task
      if (requester.rows[0].requesterid != [req.userid]) {
        return res.status(401).json({ msg: "User not authorised" });
      }
  
      // Check if any reward for this request
      const userRewards = await dbConnection.query(
        `select * from rewards where requestid=$1`,
        [req.params.requestid]
      );
      // If there is any reward for the request, it cannot be deleted
      if (userRewards.rows.length !== 0) {
        return res.status(401).json({ msg: "Request cannot be deleted when it has any reward" });
      }
  
      await dbConnection.query(`delete from requests where requestid=$1 returning *`, [
        req.params.requestid,
      ]);
  
      res.status(200).json({ msg: "Request removed" });
  
    } catch (E) {
      console.error(E.message);
      if (E instanceof TypeError) {
        return res.status(404).json({ msg: "Request not found" });
      }
      res.status(500).send("Server Error");
    }
  });

  router.get("/:requestid", async (req, res) => {
    try {
      const userRequest = await dbConnection.query(
        `select requests.*, username as requester
              from requests 
              join users
              on requests.requesterid=userid
              where requestid=$1`,
        [req.params.requestid]
      );
  
      if (userRequest.rows.length === 0)
        return res.status(400).json({ msg: "Request not found" });
  
      res.status(200).json(userRequest.rows[0]);
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });

  router.get("/:requestid/completed", async (req, res) => {
    try {
      const userRequest = await dbConnection.query(
        // @see   For setting itemid as task, which goes to Photo field, I think we shoudn't do it as it's confusing..
        `select requests.requestid as requestid, userid as borrower, fullfillerid as lender, itemid as task, quantity
              from requests 
              join rewards
              on requests.requestid=rewards.requestid
              where requests.requestid=$1`,
        [req.params.requestid]
      );
      // console.log(request.rows)
      if (userRequest.rows.length === 0)
        return res.status(400).json({ msg: "Reward not found" });
  
      res.status(200).json(userRequest.rows);
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });
  
  module.exports = router;