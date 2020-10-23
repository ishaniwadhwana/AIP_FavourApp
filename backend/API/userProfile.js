const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");
const bcryptJS = require("bcryptjs");
const userAuth = require("../middleware/Auth");

router.get("/", async (req, res) => {
    try {
      const userProfiles = await dbConnection.query(`select * from users;`);
      res.status(200).json(userProfiles.rows);
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });

  router.get("/user", userAuth, async (req, res) => {
    try {
      const userProfile = await dbConnection.query(`select * from users where userid=$1`, 
      [req.userid,]
      );
  
      if (userProfile.rows.length === 0)
        return res.status(400).json({ msg: "User not found" });
  
      res.status(200).json({
        status: "success",
        data: {
          user: userProfile.rows[0],
        },
      });
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });

  router.post("/user", userAuth, async (req, res) => {
    try {
      const userProfile = await dbConnection.query(`select * from users where userid=$1`, 
      [req.userid,]
        );
  
      if (userProfile.rows.length === 0)
        return res.status(400).json({ msg: "User not found" });
  
      // Encrypt password
      const genSalt = await bcryptJS.genSalt(10);
      const encryptedPassword = await bcryptJS.hash(req.body.passwords, genSalt);
  
      // Update user profile
      const updatedProfile = await dbConnection.query(
        "UPDATE users SET username = $1, passwords = $2 where userid = $3 returning *",
        [req.body.username, encryptedPassword, req.userid]
      );
  
      res.status(200).json({
        status: "success",
        data: {
          user: updatedProfile.rows[0],
        },
      });
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });

  router.get("/user/favors", userAuth, async (req, res) => {
    try {
      const userFavorLend = await dbConnection.query(`select * from favors where lenderId=$1`, 
      [  req.userid,]
      );
  
      const userFavorBorrow = await dbConnection.query(
        `select * from favors where borrowerId=$1`,
        [req.userid]
      );
  
      const favorBorrowedByUser = await dbConnection.query(
        `select fav.favorid, fav.lenderid, us.username, favitem.quantity, it.itemname from 
        favors as fav left join users as us ON fav. lenderid =us.userid left join favor_item as 
        favitem ON fav.favorid= favitem.favorid left join items as it ON favitem.itemid=it.itemid where 
        fav.datecompleted is NULL and fav. borrowerid=$1 order by fav.favorid desc;`,
        [req.userid]
      );
  
      const favorLentByUser = await dbConnection.query(
        `select fav.favorid, fav. borrowerid, us.username, favitem.quantity, it.itemname from
         favors as fav left join users as us ON fav.borrowerid =us.userid left join favor_item as 
         favitem ON fav.favorid= favitem.favorid left join items as it ON favitem.itemid=it.itemid where 
         fav.datecompleted is NULL and fav.lenderid=$1 order by fav.favorid desc;`,
        [req.userid]
      );
  
      res.status(200).json({
        status: "success",
        data: {
          favorLend: userFavorLend.rows,
          favorBorrow: userFavorBorrow.rows,
          favorBorrowedByUser: favorBorrowedByUser.rows,
          favorLentByUser: favorLentByUser.rows,
        },
      });
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });
  
  router.get("/user/myRequests", userAuth, async (req, res) => {
    try {
      const userRequest = await dbConnection.query(
        `select * from requests where requesterId=$1 and datefinished is null`,
        [req.userid]
      );
  
      const userRequestAccepted = await dbConnection.query(
        `select req.requestid, req.requesterid, req.task, req.datefinished, us.username 
        from requests as req left join users as us ON req.requesterid=us.userid where req.fullfillerid=$1`,
        [req.userid]
      );
  
      res.status(200).json({
        status: "success",
        data: {
          request: userRequest.rows,
          requestAccepted: userRequestAccepted.rows,
        },
      });
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });


  router.get("/user/history", userAuth, async (req, res) => {
    try {
      const peoplePaid = await dbConnection.query(
        `select fav.favorid, fav.borrowerid, fav.photo, us.username, favitem.quantity, it.itemname, 
          fav.datecompleted from favors as fav left join users as us ON fav.borrowerid=us.userid left join favor_item as 
          favitem ON fav.favorid=favitem.favorid left join items as it ON favitem.itemid=it.itemid where fav.datecompleted 
          IS NOT NULL and fav.lenderid=$1 order by fav.favorid desc`,
        [req.userid]
      );
  
      const userPaid = await dbConnection.query(
        `select fav.favorid, fav.lenderid, fav.photo, us.username, favitem.quantity, it.itemname,
       fav.datecompleted from favors as fav left join users as us ON fav.lenderid =us.userid left join favor_item as 
       favitem ON fav.favorid= favitem.favorid left join items as it ON favitem.itemid=it.itemid where fav.datecompleted 
       IS NOT NULL and fav. borrowerid=$1 order by fav.favorid desc`,
        [req.userid]
      );
  
      res.status(200).json({
        status: "success",
        data: {
          peoplePaid: peoplePaid.rows,
          userPaid: userPaid.rows,
        },
      });
    } catch (E) {
      console.error(E.message);
      res.status(500).send("Server Error");
    }
  });

  module.exports = router;