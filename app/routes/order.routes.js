const controller = require("../controllers/order.controller");
const {userMiddleware,orderMiddleware} = require("../middlewares")
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get("/api/orders/getAllOrders",[userMiddleware.verifyToken,userMiddleware.isAdmin], controller.getAllOrders);  
    app.post("/api/orders/placeNewOrder",[userMiddleware.verifyToken], controller.placeNewOrder);
    app.put("/api/orders/updateOrderStatus", controller.updateOrderStatus);
};
  