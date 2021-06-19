const db = require("../config/db.config");
const Product = db.get('products');
const fs = require('fs');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    let allProducts = await Product.sortBy('createdOn').value().reverse();
    res.status(200).send({
      status: 200,
      data: allProducts
    });
  } catch (err) {
    res.status(500).send({ status:500,message: err });
  }
}

// Get only active products
exports.getActiveProducts = async (req, res) => {
  try {
    let activeProducts = await Product.filter({isActive:true}).sortBy('createdOn').value().reverse();
    res.status(200).send({
      status: 200,
      data: activeProducts
    });
  } catch (err) {
    res.status(500).send({ status:500,message: err });
  }
}

//Create a new product
exports.createProduct = async (req, res) => {
  try {
    let data = req.body;
    data.isActive = true;
    data.createdOn = new Date().toISOString();
    let record = await Product.insert(data).write();
    res.status(201).send({
      status: 201,
      message: "Product Added Successfully",
      data: record
    });
  } catch (err) {
    res.status(500).send({ status:500,message: err });
  }
}

// Update the product
exports.updateProduct = async (req, res) => {
  try {
    let data = req.body;
    await Product.find({ id: req.body.id }).assign(data).write();
    res.status(204).send({
      status: 204,
      message: "Product Update Successfully"
    });
  } catch (err) {
    res.status(500).send({ status:500,message: err });
  }
}

// Delete the product
exports.deleteProduct = async (req, res) => {
  try {
    let delrec = await Product.remove({ id: req.params.pid }).write();
    fs.unlink(`uploads/${delrec[0].image}`, (err) => {
      res.status(204).send({
        status: 204,
        message: "Product Deleted Successfully"
      });
    })

  } catch (err) {
    res.status(500).send({ status:500,message: err });
  }
}