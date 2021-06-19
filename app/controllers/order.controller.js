const db = require("../config/db.config");
const Order = db.get('orders');
const Cart = db.get('carts');
const Product = db.get('products');
const User = db.get('users');

// To get all the orders
exports.getAllOrders = async (req, res) => {
    try {
        let allOrders = await Order.sortBy('createdOn').value().reverse();
        let result = allOrders;
        for(let o of result){
            let user = User.find({ id: o.userId }).value();
            o.address = user.address;
            o.customer_name = user.first_name + " " + user.last_name 
        }
        res.status(200).send({
            status: 200,
            data: result
        });
    } catch (err) {
        res.status(500).send({ status: 500, message: err });
    }
}



// Place a new Order
exports.placeNewOrder = async (req, res) => {
    try {
        let userId = req.userId;
        let cartItems = await Cart.remove({ userId: userId }).write();
        if (cartItems.length == 0) {
            return res.status(400).send({ message: "No Items in Cart to place an order" });
        }
        let products = [];
        let totalPrice = 0;
        await cartItems.forEach(async ele => {
            let product = await Product.find({ id: ele.productId }).value();
            let obj = {
                name: product.name,
                price: product.price,
                quantity: ele.quantity,
                id: ele.productId,
                units: product.quantity + " " + product.units,
                image: product.image
            }
            totalPrice += (obj.quantity * obj.price);
            products.push(obj);
        });
        let order = {
            orderID: new Date().getTime() + userId.split("-")[3],
            orderTotal: totalPrice,
            status: "created",
            userId: userId,
            createdOn: new Date().toISOString(),
            products: products
        }
        let newOrder = Order.insert(order).write();
        res.status(201).send({
            status: 201,
            data: newOrder,
            message: "Order Placed Successfully"
        });
    } catch (err) {
        res.status(500).send({ status: 500, message: err });
    }
}

// Update the order status
exports.updateOrderStatus = async (req, res) => {
    try {
        let status = req.body.status;
        let data = {};
        data.status = status;
        data[status + "On"] = new Date().toISOString();
        await Order.find({ id: req.body.id }).assign(data).write();
        res.status(204).send({
            status: 204,
            message: "Order Status Updated Successfully"
        });
    } catch (err) {
        res.status(500).send({ status: 500, message: err });
    }
}