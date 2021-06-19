const db = require("../config/db.config");
const Product = db.get('products');
const fs = require("fs");

// To save the image while creating a new product
saveImage = async(req,res,next)=>{
    try{
        if(req.body.image){
            let base64String = req.body.image;
            let base64Image = base64String.split(';base64,').pop();
            let filename;
            if(req.body.id){
                let product = await Product.find({id:req.body.id}).value();
                filename = product.image;
            }else{
                filename = req.body.name.replace(/ /g,"_").toLowerCase()+".png";
            }
            fs.writeFile(`uploads/${filename}`, base64Image, {encoding: 'base64'}, function(err) {
                if(err){
                    return res.status(400).send({status:400, message: "Error Saving Image" });
                }
                req.body.image = filename;
                next();
            });
        }else{
            next();
        }
    }catch(err){
        res.status(500).send({status:500, message: err });
    }
}


const productMiddleware = {
    saveImage
  };
  module.exports = productMiddleware;