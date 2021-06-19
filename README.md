-->Config Folder
    -->auth.config.ts: In this file we have written the Secret key for JWT token and configuration for Sending mails

    -->db.config.js: This file has the code for setting up and configure the DB. We are using lowdb package for accessing the json.

-->Controller : In controllers folder we have total 4 files Cart,Order,Product and User.
    -->cart.controller.js: It has the functionalities for Get All cart items by user id, Adding a new item to the cart, Adding multiple items to the cart, Updating the item count of a cart product, Delete a cart item.
    
    -->order.controller.js: It has the functionalities for To get all the orders, Place a new Order, Update the order status.
    
    -->product.controller.js: It has the functionalities for Get all products, Get only active products, Create a new product, Update the product, Delete the product.

    -->user.controller.js: It has the functionalities for User Signin, User Signup, Verify Email Id, Forgot Password, Change password 

-->Middlewares: 
    --> index.js: Configuring all the middlewares in one common file
    
    --> cart.middleware.js: In this we have functionality to Check if the item is already added to the cart and to check if the user is same while deleting or updating the cart item.
    
    --> product.middleware.js: In this we have the functionality for Saving the image while either Updating or Saving the New product (We are converting the base64url into Image file and saving it in uploads folder)

    --> user.middleware.js: In this we have functionalities for Verifying the Token, To Validate while changing password, To check if the user is Admin or not and to check for the duplicate Username and Email id while creating new user.

--> Routes: 
    -->cart.routes.js: This file contains the api paths for Cart Apis

    -->order.routes.js: This file contains the api paths for Order Apis

    -->product.routes.js: This file contains the api paths for Product Apis

    -->user.routes.js: This file contains the api paths for User Apis

-->Uploads: This folder comntains images of the products

--> Views : This folder contains ejs file to render after suuceesfully verifying the email

-->app.js: This file executes when you start running the server.

-->app.test.js: This file executes when you are running the test command.

-->db.json : This the file which stores all the data (Database file)

-->server.js : This is the main file runs when you do "npm start" and it calls the app.js

server-->app.js-->routes.js-->(miidlewares and controllers)--> db