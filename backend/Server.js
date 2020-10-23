const express = require("express");
const port = 9000;
const cookieParser = require("cookie-parser");
const dbConnection = require ("./db_config/dbconfig");
const path = require("path");
const fileuploadHandler = require("express-fileupload");
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
app.use(fileuploadHandler);

// api
app.get("/", (req, res) => res.send("Welcome to API"));
app.get("/api/auth", require("./API/Auth"));
app.get("/api/favorItems", require("./API/favorItems"));
app.get("/api/favors", require("./API/favors"));
app.get("/api/file", require("./API/fileuploadHandler"));
app.get("/api/items", require("./API/items"));
app.get("/api/party", require("./API/partydet"));
app.get("/api/profile", require("./API/userProfile"));
app.get("/api/ranking", require("./API/userRanking"));
app.get("/api/requests", require("./API/userRequests"));
app.get("/api/rewards", require("./API/userReward"));
app.get("/api/users", require("./API/users"));
app.use("/img/favors", express.static(path.join("img", "fav")));
app.use("/img/request", express.static(path.join("img", "req")));


app.listen(port, () => console.log("express API is running on ", port));

