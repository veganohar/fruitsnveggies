const controller = require("../controllers/cart.controller");
const {userMiddleware,cartMiddleware} = require("../middlewares")
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get("/api/cart/getCartItemsByUid",[userMiddleware.verifyToken], controller.getCartItemsByUid);  
    app.post("/api/cart/addMultipleCartItems",[userMiddleware.verifyToken], controller.addMultipleCartItems);
    app.post("/api/cart/addCartItem",[userMiddleware.verifyToken,cartMiddleware.checkForDuplicateItem], controller.addCartItem);
    app.put("/api/cart/updateCartItemCount/:cid/:action",[userMiddleware.verifyToken,cartMiddleware.isSameUser], controller.updateCartItemCount);
    app.delete("/api/cart/deleteCartItem",[userMiddleware.verifyToken,cartMiddleware.isSameUser], controller.deleteCartItem);
};
  