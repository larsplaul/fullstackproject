var mongoose = require("mongoose");
var Blog = require("../models/locationBlog");

function addLocationBlog(info,longitude,latitude,authorId){
  var blog = new Blog({info,pos:{longitude,latitude},author:authorId});
  return blog.save();
}
function getAllBlogs(){
  return Blog.find({}).exec();
}
function getAllBlogsForUser(authorId){
  return Blog.find({}).where({author: authorId}).exec();
}

function getAllSlugs(){
  return Blog.find({}).select({ slug: 1}).exec().then(data=>data.map(s=>s.slug));
}

module.exports = {
  addLocationBlog,
  getAllBlogs,
  getAllSlugs,
  getAllBlogsForUser
}