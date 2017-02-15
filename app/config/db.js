// Dependencies
var Sequelize = require("sequelize");

// Creates mySQL connection using Sequelize
var db = new Sequelize("donteatalone", "root", "Timothy92", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// Exports the connection for other files to use
module.exports = db;
