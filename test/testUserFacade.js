const expect = require("chai").expect;
const dbSetup = require("..//dbSetup");
var TEST_DB_URI = "mongodb://test:test@ds119969.mlab.com:19969/miniproject_test";
//var TEST_DB_URI = "ADD YOUR OWN URI TO YOUR TEST DATABASE";
var userFacade = require("../facades/userFacade");
var User = require("../models/user");

/* Connect to the TEST-DATABASE */
before(async function () {
  dbSetup.setDbUri(TEST_DB_URI);
  await dbSetup.connect();
})

/* Setup the database in a known state (2 users) before EACH test */
beforeEach(async function () {
  console.log("BeforeEach")
  await User.remove({});
  await Promise.all([
    new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test" }).save(),
    new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test" }).save(),
  ])
})

describe("Testing the User Facade", function () {
  it("Should return 2 users", async function () {
    var users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(2);
  });

  it("Should add a job to Kurt Wonnegut", async function () {
    var u = await User.findOne({ userName: "kw" }).exec();
    var user = await userFacade.addJob("Teacher", "Cphbusiness", "cphbusiness.dk",u);
    user = await userFacade.addJob("AAA", "BBB", "ccc.dk",user);
    expect(user.job[0].type).to.be.equal("Teacher");
    expect(user.job[1].company).to.be.equal("BBB");
  })

  it("Should Find Kurt Wonnegut", async function () {
    var user = await userFacade.findByUsername("kw");
    expect(user.firstName).to.be.equal("Kurt");
  });

  it("Should add Peter Pan", async function () {
    var user = await userFacade.addUser("Peter", "Pan", "peter", "test");
    expect(user.firstName).to.be.equal("Peter");

    var users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(3);
  });
})