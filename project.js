var medicines = [
  { id: 1, name: "Dolo 650mg Tablet", salt: "Paracetamol 650mg", category: "Fever", price: 30, rx: false },
  { id: 2, name: "Combiflam Tablet", salt: "Ibuprofen + Paracetamol", category: "Pain Relief", price: 42, rx: false },
  { id: 3, name: "Augmentin 625 Duo", salt: "Amoxicillin + Clavulanic Acid", category: "Antibiotic", price: 205, rx: true },
  { id: 4, name: "Azithral 500 Tablet", salt: "Azithromycin 500mg", category: "Antibiotic", price: 132, rx: true },
  { id: 5, name: "Limcee Vitamin C", salt: "Ascorbic Acid 500mg", category: "Wellness", price: 25, rx: false },
  { id: 6, name: "Volini Pain Relief Gel", salt: "Diclofenac + Menthol", category: "Pain Relief", price: 145, rx: false },
  { id: 7, name: "Calpol 500mg Tablet", salt: "Paracetamol 500mg", category: "Fever", price: 20, rx: false },
  { id: 8, name: "Neurobion Forte", salt: "Vitamin B-Complex", category: "Wellness", price: 40, rx: false },
  { id: 9, name: "Pan-D Capsule", salt: "Pantoprazole + Domperidone", category: "Digestion", price: 190, rx: false },
  { id: 10, name: "Digene Acidity Gel", salt: "Magnesium + Simethicone", category: "Digestion", price: 135, rx: false },
  { id: 11, name: "Zerodol-SP Tablet", salt: "Aceclofenac + Serratiopeptidase", category: "Pain Relief", price: 118, rx: true },
  { id: 12, name: "Crocin Advance 500", salt: "Paracetamol Fast Release", category: "Fever", price: 22, rx: false },
  { id: 13, name: "Taxim-O 200 Tablet", salt: "Cefixime 200mg", category: "Antibiotic", price: 110, rx: true },
  { id: 14, name: "Econorm Sachet", salt: "Saccharomyces Boulardii", category: "Digestion", price: 55, rx: false },
  { id: 15, name: "Shelcal 500 Tablet", salt: "Calcium + Vitamin D3", category: "Wellness", price: 130, rx: false },
  { id: 16, name: "Revital H Capsule", salt: "Multivitamin + Ginseng", category: "Wellness", price: 115, rx: false }
];

var cart = [];
var orderHistory = [];
var selectedCategory = "All";
var discountApplied = false;

function login() {
  var u = document.getElementById("user").value.trim();
  var p = document.getElementById("pass").value.trim();
  if (u === "med" && p === "invertis") {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("user-lbl").innerText = "Welcome, " + u;
    renderMedicines(medicines);
  } else {
    alert("Invalid Username or Password!");
  }
}

function renderMedicines(list) {
  var htmlData = "";
  if (list.length === 0) {
    document.getElementById("med-list").innerHTML = "<p>No medicines found.</p>";
    return;
  }
  for (var i = 0; i < list.length; i++) {
    var med = list[i];
    var rxTag = med.rx ? '<span class="rx-badge">Rx Required</span>' : '';
    htmlData += '<div class="card">' +
      '<div>' +
        '<div class="badge-row">' +
          '<span class="cat-badge">' + med.category + '</span>' + rxTag +
        '</div>' +
        '<h4>' + med.name + '</h4>' +
        '<p class="salt-text">' + med.salt + '</p>' +
      '</div>' +
      '<div class="card-footer">' +
        '<span class="price-tag">Rs. ' + med.price + '</span>' +
        '<button class="add-btn" onclick="addToCart(' + med.id + ')">Add</button>' +
      '</div>' +
    '</div>';
  }
  document.getElementById("med-list").innerHTML = htmlData;
}

function filterCategory(category, btnElement) {
  selectedCategory = category;
  var buttons = document.getElementsByClassName("tab-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  btnElement.classList.add("active");
  filterMedicines();
}

function filterMedicines() {
  var query = document.getElementById("search-input").value.toLowerCase();
  var filtered = medicines.filter(function(med) {
    var matchesCat = (selectedCategory === "All" || med.category === selectedCategory);
    var matchesSearch = med.name.toLowerCase().includes(query) || med.salt.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });
  renderMedicines(filtered);
}

function addToCart(medId) {
  var existingItem = cart.find(function(item) { return item.id === medId; });
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    var med = medicines.find(function(m) { return m.id === medId; });
    cart.push({ id: med.id, name: med.name, price: med.price, rx: med.rx, qty: 1 });
  }
  updateCart();
}

function changeQty(medId, delta) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === medId) {
      cart[i].qty += delta;
      if (cart[i].qty <= 0) {
        cart.splice(i, 1);
      }
      break;
    }
  }
  updateCart();
}

function getSubtotal() {
  var sum = 0;
  for (var i = 0; i < cart.length; i++) {
    sum += cart[i].price * cart[i].qty;
  }
  return sum;
}

function applyPromo() {
  var code = document.getElementById("promo-code").value.trim().toUpperCase();
  var msg = document.getElementById("promo-msg");
  var subtotal = getSubtotal();
  if (cart.length === 0) {
    msg.style.color = "#dc2626";
    msg.innerText = "Add medicines to cart first!";
    return;
  }
  if (code === "FIRST20") {
    if (subtotal < 200) {
      discountApplied = false;
      msg.style.color = "#dc2626";
      msg.innerText = "Add Rs. " + (200 - subtotal) + " more to get 20% discount!";
      updateCart();
    } else {
      discountApplied = true;
      msg.style.color = "#16a34a";
      msg.innerText = "Coupon FIRST20 applied (20% OFF)!";
      updateCart();
    }
  } else {
    discountApplied = false;
    msg.style.color = "#dc2626";
    msg.innerText = "Invalid coupon code. Use FIRST20";
    updateCart();
  }
}

function updateCart() {
  var cartContainer = document.getElementById("cart-list");
  var msg = document.getElementById("promo-msg");
  var totalItems = 0;
  var subtotal = getSubtotal();
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-msg">Your cart is empty</p>';
    document.getElementById("cart-count").innerText = "0";
    document.getElementById("subtotal").innerText = "0";
    document.getElementById("discount").innerText = "0";
    document.getElementById("total").innerText = "0";
    discountApplied = false;
    msg.innerText = "";
    return;
  }
  if (discountApplied && subtotal < 200) {
    discountApplied = false;
    msg.style.color = "#dc2626";
    msg.innerText = "Coupon removed: Minimum order Rs. 200 required.";
  }
  var cartHtml = "";
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    totalItems += item.qty;
    cartHtml += '<div class="cart-item">' +
      '<div class="cart-item-info">' +
        '<h5>' + item.name + (item.rx ? ' <small style="color:#dc2626;">(Rx)</small>' : '') + '</h5>' +
        '<span>Rs. ' + item.price + ' x ' + item.qty + ' = <b>Rs. ' + (item.price * item.qty) + '</b></span>' +
      '</div>' +
      '<div class="qty-controls">' +
        '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">-</button>' +
        '<span>' + item.qty + '</span>' +
        '<button class="qty-btn" onclick="changeQty(' + item.id + ', 1)">+</button>' +
      '</div>' +
    '</div>';
  }
  var discountAmount = discountApplied ? Math.round(subtotal * 0.20) : 0;
  var finalTotal = subtotal - discountAmount;
  cartContainer.innerHTML = cartHtml;
  document.getElementById("cart-count").innerText = totalItems;
  document.getElementById("subtotal").innerText = subtotal;
  document.getElementById("discount").innerText = discountAmount;
  document.getElementById("total").innerText = finalTotal;
}

function checkout() {
  if (cart.length === 0) {
    alert("Please add some medicines to cart first!");
    return;
  }
  var needsRx = cart.some(function(item) { return item.rx === true; });
  var rxFile = document.getElementById("rx-file").files.length;
  if (needsRx && rxFile === 0) {
    alert("Your cart contains Rx medicines. Please upload prescription first!");
    return;
  }
  var addr = document.getElementById("address").value.trim();
  if (addr === "") {
    alert("Please enter delivery address!");
    return;
  }
  var payMethod = document.getElementById("payment-method").value;
  var finalTotal = document.getElementById("total").innerText;
  var orderId = "MED" + Math.floor(100000 + Math.random() * 900000);
  var itemSummary = cart.map(function(i) { return i.name + " (x" + i.qty + ")"; }).join(", ");
  var orderTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  orderHistory.unshift({
    id: orderId,
    items: itemSummary,
    total: finalTotal,
    address: addr,
    payment: payMethod,
    time: orderTime
  });
  document.getElementById("order-count").innerText = orderHistory.length;
  document.getElementById("rec-order-id").innerText = orderId;
  document.getElementById("receipt-details").innerHTML =
    "<p><b>Customer:</b> Pradarsh Pratap Singh</p>" +
    "<p><b>Delivery Address:</b> " + addr + "</p>" +
    "<p><b>Payment Mode:</b> " + payMethod + "</p>" +
    "<p><b>Prescription Attached:</b> " + (rxFile > 0 ? "Yes" : "Not Required") + "</p>" +
    "<p><b>Amount Paid:</b> Rs. " + finalTotal + "</p>" +
    "<p style='color:#0f766e; margin-top:6px;'>Estimated Delivery: 30 - 45 Mins</p>";
  document.getElementById("receipt-modal").style.display = "flex";
  cart = [];
  discountApplied = false;
  document.getElementById("address").value = "";
  document.getElementById("promo-code").value = "";
  document.getElementById("rx-file").value = "";
  updateCart();
}

function closeModal() {
  document.getElementById("receipt-modal").style.display = "none";
}

function openOrders() {
  var listBox = document.getElementById("orders-list");
  if (orderHistory.length === 0) {
    listBox.innerHTML = '<p class="empty-msg">No orders placed yet. Order medicines to see them here!</p>';
  } else {
    var html = "";
    for (var i = 0; i < orderHistory.length; i++) {
      var ord = orderHistory[i];
      html += '<div class="order-card">' +
        '<div class="order-card-top">' +
          '<span>Order #' + ord.id + ' (' + ord.time + ')</span>' +
          '<span class="status-pill">Out for Delivery</span>' +
        '</div>' +
        '<p><b>Medicines:</b> ' + ord.items + '</p>' +
        '<p><b>Address:</b> ' + ord.address + ' | <b>Mode:</b> ' + ord.payment + '</p>' +
        '<p style="margin-top:4px;"><b>Total Paid:</b> Rs. ' + ord.total + '</p>' +
      '</div>';
    }
    listBox.innerHTML = html;
  }
  document.getElementById("orders-modal").style.display = "flex";
}

function closeOrders() {
  document.getElementById("orders-modal").style.display = "none";
}
