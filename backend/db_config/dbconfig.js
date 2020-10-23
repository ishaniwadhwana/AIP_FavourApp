const dbPool = require('pg').Pool;

const db = new dbPool({
    database: "API"
});

module.exports = db;