const db = require("../config/db.config");
const Cart = db.get('carts');


// Function to check if the item is already added to the cart
checkForDuplicateItem = async(req,res,next)=>{
    try{
        let count = await Cart.filter(u=>u.userId===req.userId && u.productId===req.body.productId).size().value();
    if(count>0){
        res.status(400).send({ message: "Item is already in Cart" });
        return;   
    }
    next();
    }catch(err){
        res.status(500).send({ status:500,message: err });
    }
}

// To check if the Authorised user or not
isSameUser = async(req,res,next)=>{
    try{
        let qcid = req.query.cid;
        let pcid = req.params.cid;
        let cid = qcid?qcid:pcid?pcid:undefined;
        if(cid){
            let count = await Cart.filter(u=>u.userId===req.userId && u.id===cid).size().value();
            if(count==0){
                res.status(403).send({status:403, message: "You are not Authorised User" });
                return;   
            }
            next();
        }else{
            next();
        }
    }catch(err){
        res.status(500).send({ status:500,message: err });
    }
}

const cartMiddleWare = {
    checkForDuplicateItem,
    isSameUser
  };
  module.exports = cartMiddleWare;