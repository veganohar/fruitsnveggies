const controller = require("../controllers/user.controller");
const {userMiddleware} = require("../middlewares");
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post("/api/users/signin", controller.signin);  
    app.post("/api/users/signup",[userMiddleware.checkDuplicateUsernameOrEmail], controller.signup);
    app.get("/verification/verify-account/:userId/:secretCode", controller.verifyAccount);
    app.get('/verified', (req, res) => res.render('pages/verified'));
    app.post("/api/users/changePW",[userMiddleware.verifyToken,userMiddleware.verifyChangePW], controller.changePW);
    app.get("/api/users/forgetPW/:email", controller.forgetPW);
  };
  