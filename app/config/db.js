// Dependencies
var Sequelize = require("sequelize");

// Creates mySQL connection using Sequelize
var db = new Sequelize("donteatalone", "cbbhs5pscvz78ga6", "jp8ndbjerru1eliq", {
  host: "l7cup2om0gngra77.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// Exports the connection for other files to use
module.exports = db;
