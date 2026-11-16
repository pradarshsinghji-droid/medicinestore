var medicines = [
  { id: 1, name: "Dolo 650mg Tablet", price: 30 },
  { id: 2, name: "Combiflam Tablet", price: 42 },
  { id: 3, name: "Augmentin 625 Duo", price: 205 },
  { id: 4, name: "Dolo 550mg Tablet", price: 155 },
  { id: 5, name: "Dolo 750mg Tablet", price: 255 },
  { id: 6, name: "Dolo 250mg Tablet", price: 100 },
];

var cart = [];
function login() {
  var u = document.getElementById("user").value;
  var p = document.getElementById("pass").value;

  if (u === "ansh" && p === "1234") {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("user-lbl").innerText = "Welcome, " + u;
    showMedicines();
  } else {
    alert("Invalid Username or Password!");
  }
}

function showMedicines() {
  var htmlData = "";
  for (var i = 0; i < medicines.length; i++) {
    htmlData += '<div class="card">' +
                  '<b>' + medicines[i].name + '</b> - Rs. ' + medicines[i].price +
                  '<button class="add-btn" onclick="addToCart(' + medicines[i].id + ')">Add</button>' +
                '</div>';
  }
  document.getElementById("med-list").innerHTML = htmlData;
}

function addToCart(medId) {
  for (var i = 0; i < medicines.length; i++) {
    if (medicines[i].id === medId) {
      cart.push(medicines[i]);
      break;
    }
  }
  updateCart();
}

function updateCart() {
  if (cart.length === 0) {
    document.getElementById("cart-list").innerHTML = "Cart is Empty";
    document.getElementById("total").innerText = "0";
    return;
  }

  var cartHtml = "<ul>";
  var totalPrice = 0;

  for (var j = 0; j < cart.length; j++) {
    totalPrice = totalPrice + cart[j].price;
    cartHtml += "<li>" + cart[j].name + " - Rs." + cart[j].price + "</li>";
  }
  cartHtml += "</ul>";

  document.getElementById("cart-list").innerHTML = cartHtml;
  document.getElementById("total").innerText = totalPrice;
}

function checkout() {
  if (cart.length === 0) {
    alert("Please add some medicines to cart first!");
    return;
  }

  var addr = document.getElementById("address").value;
  if (addr === "") {
    alert("Please enter delivery address!");
    return;
  }

  alert("Order placed successfully!");
  cart = [];
  document.getElementById("address").value = "";
  updateCart();
}
