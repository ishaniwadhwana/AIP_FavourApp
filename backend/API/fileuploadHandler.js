const express = require("express");
const router = express.Router();
const dbConnection = require("../db_config/dbconfig");
const fileSystem = require("fs");

router.get('/request/:requestid', async (req, res) => {
    try{
        if(!req.files || Object.keys(req.files).length === 0 ){
            return res.status(400).json({msg: "picture is not uploaded"});
        }
        let pictureFile = req.files.photo;
        const fileName = pictureFile.name;
        const fileType = pictureFile.mimetype;

        if(fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg'){
            return res.status(400).json ({msg: "our system can only handle PNG, JPG file formats"});
        }
        fileSystem.mkdirSync('./img/req', {recursive : true});
        const filePath = `./img/req/${req.params.requestid} - ${fileName}`;

        // move the file to teh path
        pictureFile.mv(`./img/req/${req.params.requestid}-${fileName}`, function (E) {
            if (E){
                return res.status(500).send("error occur ", E);
            }
        });

        const isPic = await dbConnection.query(
            `UPDATE requests SET photo = $1 where requestid = $2 returning *`, 
            [filePath, req.params.requestid]
        );
        return res.status(200).json(isPic.rows[0]);
    }catch (E){
        res.status(500).send("server Error ");
    }
});

router.get('/favor/:favorid', async (req, res) => {
    try{
        if(!req.files || Object.keys(req.files).length === 0 ){
            return res.status(400).json({msg: "picture is not uploaded"});
        }
        let pictureFile = req.files.photo;
        const fileName = pictureFile.name;
        const fileType = pictureFile.mimetype;

        if(fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg'){
            return res.status(400).json ({msg: "our system can only handle PNG, JPG file formats"});
        }
        fileSystem.mkdirSync('./img/fav', {recursive : true});
        const filePath = `./img/fav/${req.params.requestid} - ${fileName}`;

        // move the file to teh path
        pictureFile.mv(`./img/fav/${req.params.requestid}-${fileName}`, function (E) {
            if (E){
                return res.status(500).send("error occur ", E);
            }
        });

        const isPic = await dbConnection.query(
            `UPDATE favors SET photo = $1 where favorid = $2 returning *`, 
            [filePath, req.params.favorid]
        );
        return res.status(200).json(isPic.rows[0]);
    }catch (E){
        res.status(500).send("server Error ");
    }
    
});


module.exports = router;