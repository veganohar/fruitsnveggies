// Global Variables
var cart = [];
var total = 0;
var products = [];
var isLoggedIn = false;
var baseApiUrl = "http://127.0.0.1:3000/api/";
var baseImgUrl = "http://127.0.0.1:3000/";
(function () {
    'use strict';
    window.addEventListener('load', function () {
        ifLoggedIn();
        getAllActiveProducts();
        // Getting all the forms on loading of the page
        var forms = document.getElementsByClassName('needs-validation');
        // Initiating the Login Form
        forms[0].addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();
            userLogin();
        })
        // Initiating the Registration Form
        forms[1].addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();
            onSignUp();
        })
        // Initiating the Forgot password Form
        forms[2].addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();
            onForgotPassword();
        })
        // Initiating the Change Password Form
        forms[3].addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();
            onChangePassword();
        })

    }, false);
})();


// Function to make the spinner Visible
function spinnerOn() {
    $(".loader").css("visibility", "visible");
    $("body").css("overflow-y", "hidden");
}
// Function to make the spinner disappear
function spinnerOff() {
    $(".loader").css("visibility", "hidden");
    $("body").css("overflow-y", "visible");
}

// Function to Show the Success message and Error messages
function showToaster(status, message) {
    $("#alertMsg").removeClass("alert-danger");
    $("#alertMsg").removeClass("alert-success");
    let cls = status === 0 ? "alert-danger" : "alert-success";
    $("#alertMsg").addClass(cls);
    $("#alertMsg").css("visibility", "visible");
    $("#alertMsg span").text(message);
    $("#alertMsg").fadeTo(2000, 500).slideUp(500, function () {
        $("#alertMsg").slideUp(500);
    });
}

// Api call to get all the active products
function getAllActiveProducts() {
    let url = `${baseApiUrl}products/getActiveProducts`;
    fetch(url).then(response => response.json()).
        then(data => {
            if (data.status === 200) {
                products = data.data;
                printProducts(products);
            }
        })
}

// Function to Signin by calling it's api and validations
function userLogin() {
    let validated = true;
    let usernameValue = $("#username").val().trim();
    if (usernameValue == "") {
        $("#username").addClass("is-invalid");
        validated = false;
    } else {
        $("#username").removeClass("is-invalid");
    }

    let passwordValue = $("#password").val().trim();
    if (passwordValue == "") {
        $("#password").addClass("is-invalid");
        validated = false;
    } else {
        $("#password").removeClass("is-invalid");
    }
    if (validated) {
        spinnerOn();
        let fd = {
            username: usernameValue,
            password: passwordValue
        }
        let api = `${baseApiUrl}users/signin`;
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fd),
        }
        fetch(api, options).then(response => response.json())
            .then(data => {
                if (data.status == 200) {
                    localStorage.setItem("fv_token", data.accessToken);
                    localStorage.setItem("username", data.username);
                    localStorage.setItem("role", data.role);
                    $('#login_modal').modal("hide");
                    showToaster(1, "Loggedin Successfully");
                    spinnerOff();
                    ifLoggedIn();
                } else if (data.status == 404) {
                    $("#username").addClass("is-invalid");
                    spinnerOff();
                } else if (data.status == 401) {
                    $("#password").addClass("is-invalid");
                    spinnerOff();
                }
            });
    }

}

// Function for the forgot password api call and it's validations
async function onForgotPassword() {
    let validated = true;
    let emailValue = $("#fp_email").val().trim();
    if (emailValue == "") {
        $("#fp_email").addClass("is-invalid");
        validated = false;
    } else {
        $("#fp_email").removeClass("is-invalid");
    }
    if (validated) {
        spinnerOn();
        let api = `${baseApiUrl}users/forgetPW/${emailValue}`;
        let response = await fetch(api);
        if (response.status == 204) {
            $('#Forg_modal').modal("hide");
            showToaster(1, "New Password sent to your Email ID");
            spinnerOff();
        } else if (response.status == 404) {
            $("#fp_email").addClass("is-invalid");
            spinnerOff();
        } else {
            showToaster(0, data.message);
            spinnerOff();
        }
    }
}

// Function for Changing password api call and validations
async function onChangePassword() {
    changePWErrorMsgsdnone();
    let validated = true;
    let oldpwValue = $("#oldPW").val().trim();
    if (oldpwValue == "") {
        $("#oldPW").addClass("is-invalid");
        $("#ropw").removeClass("d-none");
        validated = false;
    } else {
        $("#oldPW").removeClass("is-invalid");
    }

    let newpwValue = $("#newPW").val().trim();
    if (newpwValue == "") {
        $("#newPW").addClass("is-invalid");
        $("#rnpw").removeClass("d-none");
        validated = false;
    } else {
        $("#newPW").removeClass("is-invalid");
    }

    let cnewpwValue = $("#cNewPW").val().trim();
    if (cnewpwValue == "") {
        $("#cNewPW").addClass("is-invalid");
        $("#rcpw").removeClass("d-none");
        validated = false;
    } else {
        $("#cNewPW").removeClass("is-invalid");
    }

    if (oldpwValue != "" && oldpwValue == newpwValue) {
        $("#newPW").addClass("is-invalid");
        $("#inpw").removeClass("d-none");
        validated = false;
    }

    if (newpwValue != "" && newpwValue != cnewpwValue) {
        $("#cNewPW").addClass("is-invalid");
        $("#icpw").removeClass("d-none");
        validated = false;
    }

    if (validated) {
        spinnerOn();
        let fd = {
            newPW: newpwValue,
            oldPW: oldpwValue
        }
        let api = `${baseApiUrl}users/changePW`;
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": localStorage.getItem("fv_token")
            },
            body: JSON.stringify(fd),
        }

        let response = await fetch(api, options)
        if (response.status == 204) {
            $('#Pass_modal').modal("hide");
            spinnerOff();
            showToaster(1, "Password Changed Successfully");
        } else if (response.status == 403) {
            $("#oldPW").addClass("is-invalid");
            $("#iopw").removeClass("d-none");
            spinnerOff();
        }
    }

}

// Statements to hide the Error messages of Changepassword form on loading 
function changePWErrorMsgsdnone() {
    $("#ropw").addClass("d-none");
    $("#iopw").addClass("d-none");
    $("#rnpw").addClass("d-none");
    $("#inpw").addClass("d-none");
    $("#rcpw").addClass("d-none");
    $("#icpw").addClass("d-none");
}

// Function to register a new user and it's validations
function onSignUp() {
    signupErrorMsgsdnone();
    let validated = true;

    let f_name = $("#f_name").val().trim();
    if (f_name == "") {
        $("#f_name").addClass("is-invalid");
        validated = false;
    } else {
        $("#f_name").removeClass("is-invalid");
    }

    let l_name = $("#l_name").val().trim();
    if (l_name == "") {
        $("#l_name").addClass("is-invalid");
        validated = false;
    } else {
        $("#l_name").removeClass("is-invalid");
    }

    let email = $("#email").val().trim();
    if (email == "") {
        $("#email").addClass("is-invalid");
        $("#remail").removeClass("d-none");
        validated = false;
    } else {
        $("#email").removeClass("is-invalid");
    }

    let username = $("#uname").val().trim();
    if (username == "") {
        $("#uname").addClass("is-invalid");
        $("#runame").removeClass("d-none");
        validated = false;
    } else {
        $("#uname").removeClass("is-invalid");
    }

    let phone = $("#phone").val();
    if (phone == "") {
        $("#phone").addClass("is-invalid");
        validated = false;
    } else {
        $("#phone").removeClass("is-invalid");
    }

    let password = $("#pwd").val().trim();
    if (password == "") {
        $("#pwd").addClass("is-invalid");
        validated = false;
    } else {
        $("#pwd").removeClass("is-invalid");
    }

    let cpwd = $("#cpwd").val().trim();
    if (cpwd == "") {
        $("#cpwd").addClass("is-invalid");
        $("#rcpwd").removeClass("d-none");
        validated = false;
    } else {
        $("#cpwd").removeClass("is-invalid");
    }

    let address = $("#address").val().trim();
    if (address == "") {
        $("#address").addClass("is-invalid");
        validated = false;
    } else {
        $("#address").removeClass("is-invalid");
    }

    if (password != "" && password != cpwd) {
        $("#cpwd").addClass("is-invalid");
        $("#icpwd").removeClass("d-none");
        validated = false;
    }

    if (validated) {
        spinnerOn();
        let fd = {
            first_name: f_name,
            last_name: l_name,
            email: email,
            username: username,
            phone: phone,
            password: password,
            address: address
        }
        let api = `${baseApiUrl}users/signup`;
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fd),
        }
        fetch(api, options).then(response => response.json())
            .then(data => {
                spinnerOff();
                if (data.status == 201) {
                    showToaster(1, data.message);
                    $('#Profile_modal').modal("hide");
                } else if (data.status == 400) {
                    if (data.errorType == "email") {
                        $("#email").addClass("is-invalid");
                        $("#iemail").removeClass("d-none");
                    } else {
                        $("#uname").addClass("is-invalid");
                        $("#iuname").removeClass("d-none");
                    }
                }
            });
    }
}

// Statements to hide the Error messages of Signup form on loading
function signupErrorMsgsdnone() {
    $("#remail").addClass("d-none");
    $("#iemail").addClass("d-none");
    $("#runame").addClass("d-none");
    $("#iuname").addClass("d-none");
    $("#rcpwd").addClass("d-none");
    $("#icpwd").addClass("d-none");
}


// Actions to perform on loading of the page if user is logged in
function ifLoggedIn() {
    if (localStorage.getItem("fv_token")) {
        isLoggedIn = true;
        let username = localStorage.getItem("username")
        $("#loggedinuser").text("Hi " + username.charAt(0).toUpperCase() + username.slice(1));
        $("#loginBtn").addClass("d-none");
        localStorage.getItem("role") !== "admin" ? $("#adminBtn").addClass("d-none") : '';
        $("#ordersBtn").removeClass("d-none");
        $("#passBtn").removeClass("d-none");
        $("#logout").removeClass("d-none");
        addMultipleCartItems();
    } else {
        getCartItems();
    }
}

//Function to send all the locally added cart items to server on User Loggin
function addMultipleCartItems() {
    let c = localStorage.getItem("cartItems");
    let cartItems = c != null ? JSON.parse(c) : [];
    if (cartItems.length > 0) {
        let api = `${baseApiUrl}cart/addMultipleCartItems`;
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": localStorage.getItem("fv_token")
            },
            body: JSON.stringify(cartItems),
        }
        fetch(api, options).then(response => response.json())
            .then(data => {
                if (data.status == 201) {
                    localStorage.removeItem("cartItems");
                    getCartItems();
                }
            });
    } else {
        getCartItems();
    }
}


// Logout Function
$("#logout").click(function () {
    localStorage.removeItem("fv_token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    isLoggedIn = false;
    getCartItems();
    $("#loginBtn").removeClass("d-none");
    $("#adminBtn").removeClass("d-none");
    $("#ordersBtn").addClass("d-none");
    $("#passBtn").addClass("d-none");
    $("#logout").addClass("d-none");
    $("#loggedinuser").text("");
})


// Show All the products in home page
function printProducts(finalProducts) {
    $("#products_list").empty();
    let emptyCol = '<div class="col-sm-6 col-md-4 col-lg-3 pb-4"></div>';
    let card = '<div class="card h-100"><div>';
    let img = '<img src="" class="card-img-top" data-toggle="modal" data-target="#product_details">';
    let cardBody = '<div class="card-body"></div>';
    let cardTitle = '<h5 class="card-title"></h5>';
    let cardText = '<p class="card-text"></p>';
    let productsNumber = finalProducts.length;
    for (let n = 0; n < productsNumber; n++) {
        $("#products_list").append(
            $(emptyCol).append(
                $(card).append(
                    $(img).attr("src", baseImgUrl + finalProducts[n].image).data("productId", finalProducts[n].id).click(showProduct),
                    $(cardBody).append(
                        $(cardTitle).text(finalProducts[n].name),
                        $(cardText).text(`${finalProducts[n].price.toFixed(2)}   £/${finalProducts[n].quantity} ${finalProducts[n].units}`)
                    )
                )
            )
        )
    }
}

// Triggers When you choose a category in filters 
$("#categoryFilter").change(function () {
    filterProducts();
});
// Triggers When you choose a Sort Option in filters 
$("#sortingFilter").change(function () {
    filterProducts();
});

// Function to filyter the products based on your selected options
function filterProducts() {
    $("#searchInput").val("");
    let category = $("#categoryFilter").val();
    let sOrder = $("#sortingFilter").val();
    let filteredProducts = [];
    if (category == "all") {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter((product) => {
            for (i = 0; i < product.category.length; i++) {
                if (product.category == category) return product
            }
        });
    }
    let n = sOrder[0] == "-" ? -1 : 1;
    sOrder = sOrder[0] == "-" ? sOrder.substring(1) : sOrder;
    filteredProducts.sort((a, b) => {
        if (a[sOrder] < b[sOrder]) {
            return -n;
        }
        if (a[sOrder] > b[sOrder]) {
            return n;
        }
        return 0;
    });
    printProducts(filteredProducts);
}

// Function to search the products
$("#searchInput").on('input', function () {
    $("#categoryFilter").val("all");
    $("#sortingFilter").val("-createdOn");
    let filter = $("#searchInput").val();
    let filteredProducts = products.filter(function (product) {
        if (product.name.toUpperCase().includes(filter.toUpperCase())) return product
    });
    printProducts(filteredProducts)
})

// When a product is clicked on Home-Screen show the product details on a modal
function showProduct() {
    $("#addCartBtn").removeClass("d-none");
    let pid = $(event.target).data("productId");
    let product = products.find(({ id }) => id === pid);
    let cartItem = cart.find(({ productId }) => productId === pid);
    let qty = 1;
    if (cartItem) {
        $("#addCartBtn").addClass("d-none");
        qty = cartItem.quantity;
    }
    $("#product_details_header h2").remove();
    $(".img-thumbnail").removeClass("border-info");
    $("#productQnt").text(qty);
    $("#detailsMainImg").attr("src", baseImgUrl + product.image).data("productId", pid);
    $("#details_title").text(product.name);
    $("#details_price").text(`${product.price.toFixed(2)}   £/${product.quantity} ${product.units}`);
}


// Api call to Get all the Cart items
function getCartItems() {
    if (isLoggedIn) {
        let url = `${baseApiUrl}cart/getCartItemsByUid`;
        let options = {
            method: 'GET',
            headers: {
                "x-access-token": localStorage.getItem("fv_token")
            }
        }
        fetch(url, options).then(response => response.json()).
            then(data => {
                if (data.status === 200) {
                    cart = data.data;
                    $("#itemsCartNum").text(cart.length);
                    $("#itemsCartNum").removeClass("d-none");
                }
            })
    } else {
        let c = localStorage.getItem("cartItems");
        cart = c != null ? JSON.parse(c) : [];
        $("#itemsCartNum").text(cart.length);
        $("#itemsCartNum").removeClass("d-none");
    }
}


// Button handler to decrease quantity before adding to cart
$('#restProduct').click(function () {
    let quantity = parseInt($('#productQnt').text());
    if (quantity > 1) {
        cartItemQtyUpdate("dec");
    }
});

// Button handler to increase quantity before adding to cart
$('#addProduct').click(function () {
    cartItemQtyUpdate("inc");
});

// Function to change the quantity of cart item
function cartItemQtyUpdate(action) {
    let quantity = parseInt($('#productQnt').text());
    let pid = $("#product_details img").data("productId");
    let cartItem = cart.find(({ productId }) => productId === pid);
    action == "inc" ? quantity++ : quantity--;
    if (cartItem) {
        updateItemQty(cartItem, action, quantity);
    } else {
        $('#productQnt').text(quantity);
    }
}

// API call to update the cart item quantity in server
async function updateItemQty(c, a, q) {
    if (isLoggedIn) {
        spinnerOn();
        let url = `${baseApiUrl}cart/updateCartItemCount/${c.id}/${a}`;
        let options = {
            method: 'PUT',
            headers: {
                "x-access-token": localStorage.getItem("fv_token")
            }
        }
        let response = await fetch(url, options);
        spinnerOff();
        if (response.status === 204) {
            updateItemQtyinCart(c.productId, q);
        }
    } else {
        updateItemQtyinCart(c.productId, q);
    }
}

// Update the cart items count on the Cart Icon badge
function updateItemQtyinCart(productId, quantity) {
    cart.forEach((obj) => {
        if (obj.productId === productId) {
            obj.quantity = quantity;
        }
    });
    $('#productQnt').text(quantity);
    if (!isLoggedIn) {
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }
}

// Button handler when user wants to add a product to the cart
$("#addCartBtn").click(function () {
    let quantity = parseInt($("#productQnt").text());
    let productId = $("#product_details img").data("productId");
    let obj = {
        productId: productId,
        quantity: parseInt(quantity)
    }
    if (isLoggedIn) {
        spinnerOn();
        let url = `${baseApiUrl}cart/addCartItem`;
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": localStorage.getItem("fv_token")
            },
            body: JSON.stringify(obj)
        }
        fetch(url, options).then(response => response.json()).
            then(data => {
                if (data.status === 201) {
                    $("#itemsCartNum").text(parseInt($("#itemsCartNum").text()) + 1);
                    $("#itemsCartNum").removeClass("d-none");
                    spinnerOff();
                    showToaster(1, "Product added to the cart");
                    getCartItems();
                } else {
                    showToaster(0, data.message);
                    spinnerOff();
                }
            })
    } else {
        cart.push(obj);
        localStorage.setItem("cartItems", JSON.stringify(cart));
        $("#itemsCartNum").text(parseInt($("#itemsCartNum").text()) + 1);
        $("#itemsCartNum").removeClass("d-none");
    }

    $('#product_details').modal('hide');
});



// Button Handler When you click on Cart Icon
$('#cart-modal').click(showCart);

// FUnction to Form all the Cart products and show them in the cart
function showCart() {
    $("#checkoutBtn").addClass("d-none");
    $('#cart-content').empty();
    total = 0;
    let row = '<div class="row"></div>';
    let cartImage = '<div class="col-4"></div>';
    let divColum = '<div class="col"></div>';
    let cartsProducts = [];
    for (let i = 0; i < cart.length; i++) {
        let obj = products.find(({ id }) => id === cart[i].productId);
        obj.cart = cart[i]
        cartsProducts.push(obj);
    }
    for (let j = 0; j < cartsProducts.length; j++) {
        total += cartsProducts[j].cart.quantity * cartsProducts[j].price;
        let piece = cartsProducts[j].cart.quantity > 1 ? " Items" : " Item";
        $('#cart-content').append(
            $(row).attr('data-id', cartsProducts[j].id)
                .append($(cartImage).append('<img class="img-thumbnail" src="' + baseImgUrl + cartsProducts[j].image + '" />'))
                .append($(divColum)
                    .append($('<h6>', { text: cartsProducts[j].name }))
                    .append($('<h6>', { text: cartsProducts[j].price.toFixed(2) + '£' + "/" + cartsProducts[j].quantity + cartsProducts[j].units }))
                    .append($('<span>', { text: cartsProducts[j].cart.quantity })
                        .append($('<span>', { text: piece }))
                        .append($('<i id="remove-item" class="fas fa-trash float-right"></i>').attr('data-product', JSON.stringify(cartsProducts[j]))
                            .append($())
                        )
                    )
                )
        ).append($('<hr class="col-xs-12">'));
    }
    $('#cart-total').text(total.toFixed(2) + '£');
    if (isLoggedIn) {
        $("#checkoutBtn").removeClass("d-none");
    }
}

// API Call to remove the cart item
$('#cart-content').on('click', '#remove-item', async function (e) {
    let product = JSON.parse($(e.target).attr('data-product'));
    if (isLoggedIn) {
        spinnerOn();
        let url = `${baseApiUrl}cart/deleteCartItem?cid=${product.cart.id}`;
        let options = {
            method: 'DELETE',
            headers: {
                "x-access-token": localStorage.getItem("fv_token")
            }
        }
        let response = await fetch(url, options);
        spinnerOff();
        if (response.status === 204) {
            removeItemFromCart(product);
        }
    } else {
        removeItemFromCart(product);
    }

});

// Function to update the Cart Items after removing the item 
function removeItemFromCart(p) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId == p.id) {
            cart.splice(i, 1);
        }
    }
    if (!isLoggedIn) {
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }
    $('div[data-id="' + p.id + '"]').next().remove();
    $('div[data-id="' + p.id + '"]').remove();
    let singlePrice = p.price;
    let quantity = p.cart.quantity;

    total = total - singlePrice * quantity;
    $('#cart-total').text(total.toFixed(2) + '£');
    $('#cart-content').show();
    $("#itemsCartNum").text(parseInt($("#itemsCartNum").text()) - 1);

}

// Button Handler when you click on Checkout Button
$("#checkoutBtn").click(function () {
    if (cart.length == 0) {
        $('#checkoutBtn').popover('enable')
        $('#checkoutBtn').popover('show')
    } else {
        $('#checkoutBtn').popover('disable')
        $('#cartModal').modal("hide");
        placeOrder();
    }
});

// Api call to Place the new Order
function placeOrder() {
    spinnerOn();
    let url = `${baseApiUrl}orders/placeNewOrder`;
    let options = {
        method: 'POST',
        headers: {
            "x-access-token": localStorage.getItem("fv_token")
        }
    }
    fetch(url, options).then(response => response.json()).
        then(data => {
            spinnerOff();
            if (data.status === 201) {
                showOrderSummary();
            }
        })
}

// Function to show the order summary
function showOrderSummary() {
    $("#summary_products").empty();
    $('#summary_finish').modal();

    let emptyCol = '<div class="col-6 mb-3"></div>';
    let cartsProducts = [];
    for (let i = 0; i < cart.length; i++) {
        let obj = products.find(({ id }) => id === cart[i].productId);
        obj.cart = cart[i]
        cartsProducts.push(obj);
    }
    for (let j = 0; j < cartsProducts.length; j++) {
        let pieceNumber = cartsProducts[j].cart.quantity > 1 ? "Items" : "Items";
        $("#summary_products").append(
            $(emptyCol).append(
                $('<img class="img-thumbnail col-5 float-left" src="' + baseImgUrl + cartsProducts[j].image + '" />'),
                $('<h6 class="col-7 float-right mb-0">').text(cartsProducts[j].name),
                $('<small class="col-7 float-right d-block">').text(cartsProducts[j].price.toFixed(2) + " £/" + + cartsProducts[j].quantity + cartsProducts[j].units),
                $('<small class="col-7 float-right">').text(cartsProducts[j].cart.quantity + " " + pieceNumber)
            )
        );
    }
    $("#summary_subtotal").text(total.toFixed(2) + " £");
    $("#summary_total").text(total.toFixed(2) + " £");
    cart = [];
    $("#itemsCartNum").text("0");

};


// BUtton Handler to open the Login Modal
$("#loginBtn").click(function () {
    $("#login_form")[0].reset();
    $('#loginBtn').popover('enable');
    $('#loginBtn').popover('show');
    $("#login_page .form-control").removeClass("is-invalid");
    $('#login_modal').modal();
});


// BUtton Handler to open the Registration Modal
$("#profileBtn").click(function () {
    $("#registration_form")[0].reset();
    $("#registration_page .form-control").removeClass("is-invalid");
    $('#profileBtn').popover('enable');
    $('#profileBtn').popover('show');
    $('#loginBtn').popover('disable')
    $('#login_modal').modal("hide");
    $('#Profile_modal').modal();
});

// BUtton Handler to open the Forgot password Modal
$("#ForgBtn").click(function () {
    $('#ForgBtn').popover('enable');
    $('#ForgBtn').popover('show');
    $("#fp_email").removeClass("is-invalid");
    $("#fp_email").val("");
    $('#login_modal').modal("hide");
    $('#Forg_modal').modal();
});


// BUtton Handler to open the CHange password Modal
$("#passBtn").click(function () {
    $('#passBtn').popover('enable');
    $('#passBtn').popover('show');
    $("#change_pw_form")[0].reset();
    $("#change_pw_page .form-control").removeClass("is-invalid");
    $('#Pass_modal').modal();
});
