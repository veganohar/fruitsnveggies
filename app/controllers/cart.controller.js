const db = require("../config/db.config");
const Cart = db.get('carts');

// Get All cart items by user id
exports.getCartItemsByUid = async (req, res) => {
    try {
        let allCartItems = await Cart.filter({ userId: req.userId }).value();
        res.status(200).send({
            status: 200,
            data: allCartItems
        });
    } catch (err) {
        res.status(500).send({ status:500,message: err });
    }
}

// Add a new item to cart
exports.addCartItem = async (req, res) => {
    try {
        let data = {
            productId: req.body.productId,
            userId: req.userId,
            createdOn: new Date().toISOString(),
            quantity: req.body.quantity
        };
        let record = await Cart.insert(data).write();
        res.status(201).send({
            status: 201,
            message: "Item Addeded to Cart Successfully",
            data: record
        });
    } catch (err) {
        res.status(500).send({ status:500,message: err });
    }
}

// Adding multiple items to the cart at a time
exports.addMultipleCartItems = async (req, res) => {
    try {
        let reqItems = req.body;
        let record = Cart.filter({ userId: req.userId });
        let cartItems = record.value();
        const ids = new Set(cartItems.map(x => x.productId));
        let result = [];
        for(ele of reqItems){
            if(!ids.has(ele.productId)){
                ele.userId = req.userId;
                ele.createdOn = new Date().toISOString();
                let  record = await Cart.insert(ele).write();
                result.push(record);
            }
        }
        res.status(201).send({
            status: 201,
            message: "Items Addeded to Cart Successfully",
            data: result
        });
    } catch (err) {
        res.status(500).send({ status:500,message: err });
    }
}

// Updating the item count of a cart product
exports.updateCartItemCount = async (req, res) => {
    try {
        let cid = req.params.cid;
        let action = req.params.action;
        let record = await Cart.find({ id: cid });
        let item = record.value();
        let itemCount = item.quantity + (action == "inc" ? 1 : -1);
        await record.assign({ quantity: itemCount }).write();
        res.status(204).send({
            status: 204,
            message: "Quantity Updated",
        });
    } catch (err) {
        res.status(500).send({ status:500,message: err });
    }
}

// Delete a cart item
exports.deleteCartItem = async (req, res) => {
    try {
        let cid = req.query.cid;
        let del_query = cid ? { id: cid } : { userId: req.userId };
        await Cart.remove(del_query).write();
        res.status(204).send({
            status: 204,
            message: "Item(s) removed from Cart Successfully"
        });

    } catch (err) {
        res.status(500).send({ status:500,message: err });
    }
}

