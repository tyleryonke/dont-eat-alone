var Sequelize = require("sequelize")

module.exports = function(db){
  return db.define("user",{
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    displayname: Sequelize.STRING,
    age: Sequelize.INTEGER,
    occupation: Sequelize.STRING,
    photolink: Sequelize.STRING,
    vegetarian: Sequelize.BOOLEAN,
    differentDiet: Sequelize.BOOLEAN,
    favFood: Sequelize.STRING,
    leastFood: Sequelize.STRING,
    favDrink: Sequelize.STRING,
    leastDrink: Sequelize.STRING,
    freeTime: Sequelize.STRING,
    minAvail: Sequelize.INTEGER,
    locationName: Sequelize.STRING,
    locationLat: Sequelize.STRING,
    locationLong: Sequelize.STRING,
    online: Sequelize.BOOLEAN
  })
}
