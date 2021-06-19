
const controller = require("../controllers/product.controller");
const { productMiddleware, userMiddleware } = require("../middlewares");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/products/getAllProducts",[userMiddleware.verifyToken, userMiddleware.isAdmin], controller.getAllProducts);
    app.get("/api/products/getActiveProducts", controller.getActiveProducts);
    app.post("/api/products/createProduct", [userMiddleware.verifyToken, userMiddleware.isAdmin, productMiddleware.saveImage], controller.createProduct);
    app.put("/api/products/updateProduct", [userMiddleware.verifyToken, userMiddleware.isAdmin, productMiddleware.saveImage], controller.updateProduct);
    app.delete("/api/products/deleteProduct/:pid", [userMiddleware.verifyToken, userMiddleware.isAdmin], controller.deleteProduct);
};
