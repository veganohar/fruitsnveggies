// Global Variables
var base64String;
var baseApiUrl = "http://127.0.0.1:3000/api/";
var baseImgUrl = "http://127.0.0.1:3000/";


$(document).ready(function () {
  ifAdminLoggedIn();
  // Event listener to expand/collapse sidebar
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
    $("#content").toggleClass("active");
  });

  // Event listener to validate login form
  var forms = document.getElementsByClassName("form-group");
  forms[0].addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    validateLogin();
  });

  // Event listener to load product list
  $("#prodSubmenu li:first-child").on("click", function () {
    $(".product-create-container").addClass("d-none");
    $(".product-table-container").addClass("d-none");
    $(".orders-container").addClass("d-none");
    $("#product-cont").removeClass("d-none");
  });


  // Event listener to hide all result windows
  $(".bi-emoji-smile-upside-down").on("click", function () {
    $(".product-create-container").addClass("d-none");
    $(".product-table-container").addClass("d-none");
  });
});


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
  setTimeout(() => {
    $("#alertMsg").css("visibility", "hidden");
  }, 3000);

}

// Function to validate login form
function validateLogin() {
  let username = document.getElementById("username");
  let usernameValue = username.value.trim();
  let password = document.getElementById("password");
  let passwordValue = password.value.trim();
  username.classList.remove("is-invalid");
  password.classList.remove("is-invalid");
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
      spinnerOff();
      if (data.status == 200 && data.role == "admin") {
        localStorage.setItem("fv_token", data.accessToken);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        ifAdminLoggedIn();
      } else if (data.status == 404) {
        username.classList.add("is-invalid");
      } else if (data.status == 401) {
        password.classList.add("is-invalid");
      } else {
        window.location.href = "../HTML Files/index1.html";
      }
    });
}
// Actions to perform on loading of the page if admin is logged in
function ifAdminLoggedIn() {
  if (localStorage.getItem("fv_token") && localStorage.getItem("role") == "admin") {
    getAllProducts();
    $("#sidebar").toggleClass("active");
    $("#content").toggleClass("active");
    let adminName = localStorage.getItem("username");
    $(".sidebar-header h3").text("Welcome " + adminName + "!");
    $(".login-cont").hide();
    $(".wrapper").css("display", "flex");
    $("#product-cont").removeClass("d-none");
    $("#logout").removeClass("d-none");
    window.location.href = "#product-cont";
  }
}

// Api call to get all the products
function getAllProducts() {
  let api = `${baseApiUrl}products/getAllProducts`;
  let options = {
    method: 'GET',
    headers: {
      "x-access-token": localStorage.getItem("fv_token")
    },

  }
  fetch(api, options).then(response => response.json())
    .then(data => {
      if (data.status == 200) {
        showProductsInTable(data.data)
      }
    });
}

//Logout FUnction
$("#logout").click(function () {
  localStorage.removeItem("fv_token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
})

//Event Listener WHen you cliock on Add New Product in menu
$("#addNewProduct").click(function () {
  $("#createNewProduct .form-control").val("");
  $("#productImage").val("");
  $("#createNewProduct .form-control").removeClass("is-valid");
  $("#createNewProduct .form-control").removeClass("is-invalid");
  $("#invalid-cat").addClass("d-none");
  $("#invalid-img").addClass("d-none");
  $("#imgpreview").removeAttr("src");
  $('input:radio[name="productCategory"]:checked').prop('checked', false);
  $(".form-check").remove();
  $(".product-table-container").addClass("d-none");
  $(".orders-container").addClass("d-none");
  $("#createNewProduct").removeClass("d-none");
  $("#editProdBtn").addClass("d-none");
  $("#createProdBtn").removeClass("d-none");
});



// Api call to create a new product
$("#createProdBtn").on("click", function (e) {
  e.preventDefault();
  let results = validateProduct("create");
  let isValid = results[0];
  let product = results[1];
  if (isValid) {
    spinnerOn();
    let api = `${baseApiUrl}products/createProduct`;
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-access-token": localStorage.getItem("fv_token")
      },
      body: JSON.stringify(product),
    }
    fetch(api, options).then(response => response.json())
      .then(data => {
        spinnerOff();
        if (data.status == 201) {
          base64String = null;
          $("#createNewProduct").addClass("d-none");
          $("#imgpreview").removeAttr("src");
          showToaster(1,"New Product Created Successfully")
          ifAdminLoggedIn();
        } else {
          $("#emsg").html(data.message);
        }
      });
  }
});

// Function to validate Create new product form
function validateProduct(action) {
  let validated = true;
  let prodName = $("#productTitle").val().trim();
  if (prodName == "") {
    $("#productTitle").addClass("is-invalid");
    validated = false;
  } else {
    $("#productTitle").removeClass("is-invalid");
    $("#productTitle").addClass("is-valid");
  }

  let price = $("#productPrice").val().trim();
  if (price == "" || parseFloat(price) <= 0) {
    $("#productPrice").addClass("is-invalid");
    validated = false;
  } else {
    $("#productPrice").removeClass("is-invalid");
    $("#productPrice").addClass("is-valid");
  }

  let quantity = $("#productQuantity").val().trim();
  if (quantity == "" || parseFloat(quantity) <= 0) {
    $("#productQuantity").addClass("is-invalid");
    validated = false;
  } else {
    $("#productQuantity").removeClass("is-invalid");
    $("#productQuantity").addClass("is-valid");
  }

  let units = $("#productUnits").val();
  if (!units) {
    $("#productUnits").addClass("is-invalid");
    validated = false;
  } else {
    $("#productUnits").removeClass("is-invalid");
    $("#productUnits").addClass("is-valid");
  }

  let category = $('input[name="productCategory"]:checked').val();
  if (!category) {
    $("#invalid-cat").removeClass("d-none");
    validated = false;
  } else {
    $("#invalid-cat").addClass("d-none");
  }

  let image = $("#productImage").val();
  if (!image && action == "create") {
    $("#invalid-img").removeClass("d-none");
    validated = false;
  } else {
    $("#invalid-img").addClass("d-none");
  }
  let product = {
    name: prodName,
    category: category,
    quantity: parseFloat(quantity),
    units: units,
    price: parseFloat(price)
  }
  base64String ? product.image = base64String : '';
  action == "update" ? product.id = $("#productTitle").attr("data-prodId") : '';
  return [validated, product];
}

// Function to convert image to base64 string
$("#productImage").on("change", function (e) {
  var FR = new FileReader();
  FR.addEventListener("load", function (e) {
    base64String = e.target.result;
    $("#imgpreview").attr("src", e.target.result);
  });
  FR.readAsDataURL(e.target.files[0]);
})


// Api call to update  product
$("#editProdBtn").on("click", async function (e) {
  e.preventDefault();
  let results = validateProduct("update");
  let isValid = results[0];
  let product = results[1];
  if (isValid) {
    spinnerOn();
    let api = `${baseApiUrl}products/updateProduct`;
    let options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "x-access-token": localStorage.getItem("fv_token")
      },
      body: JSON.stringify(product),
    }
    let response = await fetch(api, options);
    spinnerOff();
    if (response.status == 204) {
      base64String = null;
      $("#createNewProduct").addClass("d-none");
      $("#imgpreview").removeAttr("src");
      showToaster(1,"Producted Updated Successfully");
      ifAdminLoggedIn();
    } else {
      $("#emsg").html(data.message);
    }

  }
});


// To show all the products in the table
function showProductsInTable(products) {
  $("#product-table tbody").empty();
  let sno = 0;
  products.forEach(p => {
    sno++;
    let $newRow = $("<tr>");
    $("<td>").text(sno).appendTo($newRow);
    $("<td>").text(p.name).appendTo($newRow);
    $("<td>").text(p.price + " £").appendTo($newRow);
    $("<td>").text(p.quantity + " " + p.units).appendTo($newRow);
    $("<td>").text(p.category).appendTo($newRow);
    let $btnEdit = $("<td class='text-center'>").html('<i class="fas fa-marker"></i>').appendTo($newRow);
    $btnEdit.on("click", function () {
      onEditClick(p);
    })
    let $btnDel = $("<td class='text-center'>").html('<i class="fas fa-trash-alt"></i>').appendTo($newRow);
    $btnDel.on("click", function () {
      onDeleteClick(p.id);
    })

    let $cb = p.isActive ? "checked" : '';
    let $status = $("<td class='text-center'>").html('<input type="checkbox"' + $cb + '>').appendTo($newRow);
    $status.on("change", function (e) {
      let obj = {
        id: p.id,
        isActive: e.target.checked
      }
      onStatusChange(obj, e);
    })
    $("#product-table tbody").append($newRow);
  });
  $("#product-cont").removeClass("d-none");
}


// Function to populate the product data in form when you click on Edit icon
function onEditClick(p) {
  $("#product-cont").addClass("d-none");
  $("#createNewProduct").removeClass("d-none");
  $("#createProdBtn").addClass("d-none");
  $("#editProdBtn").removeClass("d-none");
  $("#productTitle").val(p.name);
  $("#productTitle").attr("data-prodId", p.id);
  $("#productPrice").val(p.price);
  $("#productQuantity").val(p.quantity);
  $("#productUnits").val(p.units);
  $('input[value="' + p.category + '"]').prop('checked', true);
  $("#imgpreview").attr("src", baseImgUrl + p.image);
  $("#createNewProduct .form-control").removeClass("is-valid");
  $("#createNewProduct .form-control").removeClass("is-invalid");
  $("#invalid-cat").addClass("d-none");
  $("#invalid-img").addClass("d-none");
}

// Api call to Delete a product
async function onDeleteClick(pid) {
  let api = `${baseApiUrl}products/deleteProduct/${pid}`;
  let options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "x-access-token": localStorage.getItem("fv_token")
    }
  }
  if (confirm("Are you sure, You want to delete this Product?")) {
    spinnerOn();
    let response = await fetch(api, options);
    spinnerOff();
    if (response.status == 204) {
      showToaster(1,"Product Deleted Successfully");
      getAllProducts();
    }

  }
  return false;

}

// Api call to change the Product status
async function onStatusChange(data, e) {
  let api = `${baseApiUrl}products/updateProduct`;
  let options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "x-access-token": localStorage.getItem("fv_token")
    },
    body: JSON.stringify(data),
  }
  spinnerOn();
  let response = await fetch(api, options);
  spinnerOff();
  if (response.status !== 204) {
    e.target.checked = !e.target.checked
  } 


}

// EVent Listeners when you click on Orders in menu
$("#ordersList").click(function () {
  $(".product-table-container").addClass("d-none");
  $(".product-create-container").addClass("d-none");
  $(".orders-container").removeClass("d-none");
  getAllOrders();
})

// Api call to get all the orders
function getAllOrders() {
  let api = `${baseApiUrl}orders/getAllOrders`;
  let options = {
    method: 'GET',
    headers: {
      "x-access-token": localStorage.getItem("fv_token")
    },

  }
  fetch(api, options).then(response => response.json())
    .then(data => {
      if (data.status == 200) {
        showOrders(data.data);
      }
    });
}

// FUnction to display all the orders 
function showOrders(orders) {
  let odiv = document.getElementById("orders-cont");
  odiv.innerHTML = `<h4 class="text-center pb-3">Orders</h4>`;
  orders.forEach(o => {
    let products = '';
    o.products.forEach(p => {
      let product = ` <div class="row no-gutters mt-3">
      <div class="col-8 col-md-1">
          <img class="img-fluid1 pr-1" src="${baseImgUrl}${p.image}" alt="" />
      </div>
      <div class="col-8 col-md-8 pr-0 pr-md-3">
          <h6 class="text-charcoal1 mb-2 mb-md-1">
          ${p.name}
          </h6>
          <ul class="list-unstyled text-pebble1 mb-2 small">
              <li class=""><b>Quantity:</b> ${p.quantity}</li>
              <li class=""><b>Units:</b> ${p.units}</li>
          </ul>
          <h6 class="text-charcoal2 text-left mb-0 mb-md-2">
              <b>Price: ${p.price}£</b>
          </h6>
      </div>
  </div>`;
      products += product;
    })
    let order = `<div class="row mt-3">
    <div class="col-12">
        <div class="list-group mb-5">
            <div class="list-group-item p-3 bg-snow" style="position: relative">
                <div class="row w-100 no-gutters">
                    <div class="col-6 col-md">
                        <h6 class="text-charcoal mb-0 w-100">Order Number</h6>
                        <a href="" class="text-pebble mb-0 w-100 mb-2 mb-md-0">${o.orderID}</a>
                    </div>
                    <div class="col-6 col-md">
                        <h6 class="text-charcoal mb-0 w-100">Order Date</h6>
                        <p class="text-pebble mb-0 w-100 mb-2 mb-md-0">
                        ${new Date(o.createdOn).toDateString().substr(4)}
                        </p>
                    </div>
                    <div class="col-6 col-md">
                    ${showOrderStatus(o)}
                    </div>
                    <div class="col-6 col-md">
                        <h6 class="text-charcoal mb-0 w-100">Customer Name</h6>
                        <p class="text-pebble mb-0 w-100 mb-2 mb-md-0">
                        ${o.customer_name}
                        </p>
                    </div>
                </div>
            </div>
            <div class="list-group-item p-3 bg-white">
                <div class="row no-gutters">
                    <div class="col-12 col-md-9 pr-0 pr-md-3">
                        <div class="w-100">
                            <b>Address:</b>
                            ${o.address}
                        </div>
                    </div>
                    <div class="col-4 col-md-3">
                        ${createOrderStatusBtn(o)}
                    </div>
                    ${products}
                </div>
            </div>
            <div class="list-group-item py-2 px-3 bg-white">
                <div class="row w-100 no-gutters">
                    <div class="col-6 text-pebble">Order Summary</div>
                </div>
            </div>
            <div class="list-group-item py-2 px-3 bg-white">
                <div class="row w-100 no-gutters">
                    <div class="col-6 text-pebble">Shipping</div>
                    <div class="col-6 text-right text-charcoal">Free</div>
                </div>
            </div>
            <div class="list-group-item py-2 px-3 bg-snow">
                <div class="row w-100 no-gutters">
                    <div class="col-8 text-charcoal">
                        <b>Total</b>
                    </div>
                    <div class="col-4 text-right text-green">
                        <b>${o.orderTotal}£</b>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    odiv.insertAdjacentHTML("beforeend", order);
  })
}

// Function to show order current status and date
function showOrderStatus(o) {
  if (o.status == "created") {
    return '';
  } else {
    let s = o.status;
    return `<h6 class="text-charcoal mb-0 w-100">${s[0].toUpperCase() + s.substr(1) + " Date"}</h6>
    <p class="text-pebble mb-0 w-100 mb-2 mb-md-0">${new Date(o[s + "On"]).toDateString().substr(4)}</p>`
  }

}

//Function to create Cancel Order and Change Order status buttons
function createOrderStatusBtn(o) {
  let cbtn = '';
  let obtn = '';
  let btnName = "";
  let btnStatus = "";
  switch (o.status) {
    case "created":
      btnName = "Accept Order";
      btnStatus = "accepted";
      break;
    case "accepted":
      btnName = "Dispatch Order";
      btnStatus = "dispatched";
      break;
    case "dispatched":
      btnName = "Deliver Order";
      btnStatus = "delivered";
      break;
  }
  if (o.status == "cancelled" || o.status == "delivered") {
    return '';
  } else {
    cbtn = `<a type="button" class="btn btn-secondary w-100 mb-2 text-light" onclick="onstatus('${o.id}','cancelled')">Cancel Order</a>`;
    obtn = `<a type="button" class="btn btn-secondary w-100 mb-2 text-light" onclick="onstatus('${o.id}','${btnStatus}')">${btnName}</a>`;
    return obtn + cbtn;
  }
}


// APi call to change Order status 
async function onstatus(id, s) {
  spinnerOn();
  let fd = {
    status: s,
    id: id
  }
  let api = `${baseApiUrl}orders/updateOrderStatus`;
  let options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "x-access-token": localStorage.getItem("fv_token")
    },
    body: JSON.stringify(fd)
  }

  let response = await fetch(api,options);
  spinnerOff();
  if (response.status == 204) {
    getAllOrders();
  }
 
}