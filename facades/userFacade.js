var mongoose = require("mongoose");
var User = require("../models/user");

function getAllUsers() {
  return User.find({}).exec();
}

function addUser(firstName, lastName, userName, password) {
  var user = new User({ firstName, lastName, userName, password });
  return user.save();
}

function addJob(type, company, companyUrl, user) {
  user.job.push({ type, company, companyUrl });
  return user.save();
}

function findByUsername(username) {
  return User.findOne({ userName: username }).exec();
}

module.exports = {
  getAllUsers: getAllUsers,
  addUser: addUser,
  findByUsername: findByUsername,
  addJob
}