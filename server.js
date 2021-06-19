
const app = require("./app");
const port = 3000;
const db = require("./app/config/db.config");
const User = db.get('users');
var bcrypt = require("bcryptjs");

app.listen(port,()=>{
  console.log("127.0.0.1:"+port);
  createAdmin();
})

// FUnction to create admin on running the server for the very first time
createAdmin = async()=>{
  let count = await User.filter({role:"admin"}).size().value();
  if(count==0){
    let data= {
      username: "admin",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("admin", 8),
      role: "admin",
      isActive: true,
      isVerified: true,
      createdOn: new Date().toISOString()
    }
    await User.insert(data).write();
    
  }
}