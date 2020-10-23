const express = require("express");
const port = 9000;
const cookieParser = require("cookie-parser");
const dbConnection = require ("./db_config/dbconfig");


const app = express();


try{
    dbConnection.connect();
    console.log("Database is connected succesfully");
}catch (E){
    console.log("Database connection is unsuccesfully: the error is ", E);

}

// middleware init
app.use(express.json({ extended: false }));
app.use(cookieParser());


app.get("/", (req, res) => res.send("Welcome to API"));
app.get("/Auth/", require("./API/Auth"));
app.get("/favorItems", require("./API/favorItems"));


app.listen(port, () => console.log("express API is running on ", port));

