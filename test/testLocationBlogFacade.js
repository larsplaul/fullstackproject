const expect = require("chai").expect;
const dbSetup = require("..//dbSetup");
var TEST_DB_URI = "mongodb://test:test@ds119969.mlab.com:19969/miniproject_test";
//var TEST_DB_URI = "ADD YOUR OWN URI TO YOUR TEST DATABASE";
var blogFacade = require("../facades/locationBlogFacade");
var LocationBlog = require("../models/locationBlog");
var User = require("../models/user");

/* Connect to the TEST-DATABASE */
before(async function () {
  dbSetup.setDbUri(TEST_DB_URI);
  await dbSetup.connect();
})

/* Setup the database in a known state (3 users) before EACH test 
   + 2 blogs made by Kurt Wonnegut and 1 bog made by user3
*/
beforeEach(async function () {
  console.log("BeforeEach")
  await User.remove({});
  await LocationBlog.remove({});
  var users = await Promise.all([
    new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test" }).save(),
    new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test" }).save(),
    new User({ firstName: "user3", lastName: "user3ln", userName: "u3", password: "test" }).save(),
  ])
  await Promise.all([
    new  LocationBlog({info:"Cool Blog",pos:{longitude:123,latitude: 45},author: users[0]._id}).save(),
    new  LocationBlog({info:"New Cool Blog",pos:{longitude:34,latitude: 45},author: users[0]._id}).save(),
    new  LocationBlog({info:"User 3s Blog",pos:{longitude:45,latitude: 45},author: users[2]._id}).save(),
  ])
})

describe("Testing the LocationBlog facade", async function () { 
  it("should provide 2 slugs",async function(){
    var blogs = await LocationBlog.find({});
    var slugs = await blogFacade.getAllSlugs();
    expect(slugs.length).to.be.equal(3);
    expect(slugs[0]).to.be.equal(`/locationblog/${blogs[0]._id}`);
  })
  it("should find 2 blogs made by Kurt",async function(){
    var user = await User.findOne({userName: "kw"});
    var blogs = await blogFacade.getAllBlogsForUser(user._id);
    expect(blogs.length).to.be.equal(2);
    expect(blogs[0].author.toString()).to.be.equal(user._id.toString());  
  })
  it("should add a blog made by Hanne",async function(){
    var user = await User.findOne({userName: "hw"});
    var blog = await blogFacade.addLocationBlog("Blog by Hanne",67,67,user._id);
    expect(blog.author.toString()).to.be.equal(user._id.toString());  
  })
})
