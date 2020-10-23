const express = require("express");
const port = 9000;

const dbConnection = require ("./db_config/dbconfig");


const app = express();


try{
    dbConnection.connect();
    console.log("Database is connected succesfully");
}catch (E){
    console.log("Database connection is unsuccesfully: the error is ", E);

}


app.get("/", (req, res) => res.send("Welcome to API"));


app.listen(port, () => console.log("express API is running on ", port));

