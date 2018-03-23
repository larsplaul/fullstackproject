require("./dbSetup.js").connect();

var User = require("./models/user");
var LocationBlog = require("./models/locationBlog");
var Position = require("./models/position");

 function userCreate(firstName,lastName,userName,password,type,company,companyUrl){
  var job = [{type,company,companyUrl},{type,company,companyUrl}];
  var userDetail = {firstName,lastName,userName,password,job};
  var user = new User(userDetail);
  return user.save();
} 

function positionCreator(lon,lat,userId){
  var posDetail = {user:userId,loc:{coordinates:[lon,lat]}};
  var position = new Position(posDetail);
  return position.save();
}

function LocationBlogCreator(info, author, longitude, latitude) {
  var LocationBlogDetail = { info, pos: { longitude, latitude }, author };
  var blog = new LocationBlog(LocationBlogDetail);
  return blog.save()
}
async function createUsers(){
  await User.remove({});
  await Position.remove({});
  await LocationBlog.remove({});
  
  var userPromises = [
    userCreate("Kurt","Wonnegut","annb","test","xxx","comp","comp.url"),
    userCreate("aafa","sfsdf","dfsdf","test","xxx","comp","comp.url"),
    userCreate("fsaf","sfsdf","fsfsf","test","xxx","comp","comp.url"),
    userCreate("afasfaafa","sfssfdf","sfsfs","test","xxx","comp","comp.url"),
    userCreate("aaafasffa","fsf","teteter","test","xxx","comp","comp.url")
  ]

  var users = await Promise.all(userPromises);
  var posPromises = [
    positionCreator(123,123,users[0]._id),
    positionCreator(123,123,users[1]._id),
    positionCreator(123,123,users[2]._id),
    positionCreator(123,123,users[3]._id),
    positionCreator(123,123,users[4]._id)];
    
  var positions = await Promise.all(posPromises);

  var blogPromises = [
    LocationBlogCreator("Cool Place",users[0]._id,26,148),
    LocationBlogCreator("Another Cool Place",users[0]._id,56,56),
    LocationBlogCreator("Yet Another Cool Place",users[0]._id,156,56),
    LocationBlogCreator("The coolest Place",users[3]._id,156,56),
  ];
  var blogs = await Promise.all(blogPromises);
  //console.log(users);
  //console.log(positions);
  console.log(blogs);
}
createUsers();
/*
.then(user => {
  console.log("########  USER  ########");
  console.log(user);
  
  LocationBlogCreator("Cool Place",user._id,26,148)
  .then(blog => {
   console.log("############  BLOG ############\n");
   console.log(blog)})
  .catch(err=> console.log(err));

  positionCreator(156,26,user._id)
  .then(p => {
    console.log("########  POSITION ########\n");
    console.log(p);
  });
})
.catch(err=>console.log(err.message))
*/