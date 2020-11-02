//create a database pool.
const dbPool = require('pg').Pool;
//pool.
const db = new dbPool({
    database: "API"
});

module.exports = db;