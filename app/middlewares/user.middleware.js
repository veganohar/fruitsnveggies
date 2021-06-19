const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../config/db.config");
const User = db.get('users');
var bcrypt = require("bcryptjs");


// Function to verify if the token is provided or not
verifyToken = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ status: 403, message: "No token provided!" });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ status: 401, message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      req.userRole = decoded.role;
      next();
    });
  } catch (err) {
    res.status(500).send({ status: 500, message: err });
  }
};

// Functio to validate the change password 
verifyChangePW = async (req, res, next) => {
  try {
    let user = await User.find({ id: req.userId }).value();
    if (!user) {
      return res.status(404).send({ status: 404, message: "User Not found." });
    }
    var passwordIsValid = bcrypt.compareSync(
      req.body.oldPW,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(403).send({ status: 403, message: "Invalid Old Password!" });
    }

    if (req.body.oldPW === req.body.newPW) {
      return res.status(403).send({ status: 403, message: "New password should not be same as Old password" });
    }
    next();
  } catch (err) {
    res.status(500).send({ status: 500, message: err });
  }
}

// FUnction to check if the user is admin or not
isAdmin = async (req, res, next) => {
  try {
    if (req.userRole != "admin") {
      return res.status(403).send({ status: 403, message: "Require Admin Role!" });
    }
    next();
  } catch (err) {
    res.status(500).send({ status: 500, message: err });
  }
}

// Function to check if the username or email already exist or not
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    let count = await User.filter({ username: req.body.username }).size().value();
    if (count > 0) {
      res.status(400).send({ status: 400, errorType: "username", message: "Failed! Username is already in use!" });
      return;
    }
    count = await User.filter({ email: req.body.email }).size().value();
    if (count > 0) {
      res.status(400).send({ status: 400, errorType: "email", message: "Failed! Email is already in use!" });
      return;
    }
    next();
  } catch (err) {
    res.status(500).send({ status: 500, message: err });
  }

};

const userMiddleware = {
  verifyToken,
  checkDuplicateUsernameOrEmail,
  verifyChangePW,
  isAdmin
};
module.exports = userMiddleware;