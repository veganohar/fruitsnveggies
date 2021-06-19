const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./app/config/db.config");
const cors = require("cors");
const fs = require('fs');

// if (!fs.existsSync("./testdb.json")){ 
//    db.defaults({ users: [], carts: [], orders:[], products:[] }).write();
// }

app.set('view engine', 'ejs');
// Create db json file if it is not there
db.defaults({ users: [], carts: [], orders:[], products:[] }).write();

app.get("/",(req,res)=>{
  res.send("Hello World")
})

app.use(express.static('uploads'));
app.use(cors());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'50mb' }));


// Importing all the routes 
require("./app/routes/user.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/cart.routes")(app);
require("./app/routes/order.routes")(app);

module.exports = app;