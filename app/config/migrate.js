var db = require("./db")
var User = require("../models/user")(db);
User.sync({force: true}).then(process.exit);
