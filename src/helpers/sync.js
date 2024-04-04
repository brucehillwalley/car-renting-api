"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CAR RENTING API
------------------------------------------------------- */
// sync():

module.exports = async function () {
  // return null;

  /* REMOVE DATABASE */
  const { mongoose } = require("../configs/dbConnection");
  await mongoose.connection.dropDatabase();
  console.log("- Database and all data DELETED!");
  /* REMOVE DATABASE */

  /* CREATE ADMIN */
  //? admin oluşturulması gerekiyor yoksa users'a post ile create edemeyiz.
  const User = require("../models/user");
  await User.create({
    username: "admin",
    password: "aA?123456",
    email: "admin@site.com",
    firstName: "admin",
    lastName: "admin",
    isActive: true,
    isStaff: true,
    isAdmin: true,
  });
  /* CREATE ADMIN */

  console.log("Admin created!");
};
