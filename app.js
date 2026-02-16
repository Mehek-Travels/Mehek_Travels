// ================= INIT =================
(function init() {
    if (typeof emailjs !== "undefined") {
        emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
    }
})();

// ================= USER LOGIN =================
function loginUser() {
    const username = document.getElementById("username").value;

    if (!username) return alert("Enter username");

    localStorage.setItem("loggedUser", username);
    window.location.href = "index.html";
}

function logoutUser() {
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
}

// ================= ADMIN LOGIN =================
function loginAdmin() {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("adminLogged", "true");
        window.location.href = "admin.html";
    } else {
        alert("Invalid admin credentials");
    }
}

// ================= PROTECT ADMIN =================
if (window.location.pathname.includes("admin.html")) {
    if (localStorage.getItem("adminLogged") !== "true") {
        window.location.href = "admin-login.html";
    }
}

// ================= CART =================
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    const btn = document.getElementById("addToCartBtn");
    if (btn) {
        btn.onclick = function () {
            const transmission = document.getElementById("transmission").value;

            if (!transmission) {
                alert("Select transmission");
                return;
            }

            const cart = JSON.parse(localStorage.getItem("cart") || "[]");

            cart.push({
                name: "Toyota Rumion",
                transmission: transmission,
                price: "18/km | 25/km"
            });

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Added to booking");
            updateCartCount();
        };
    }

    if (document.getElementById("orderPreview")) {
        renderPreview();
    }

    if (document.getElementById("adminOrders")) {
        renderAdminOrders();
    }
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const el = document.getElementById("cartCount");
    if (el) el.innerText = cart.length;
}

function renderPreview() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const container = document.getElementById("orderPreview");

    if (cart.length === 0) {
        container.innerHTML = "No vehicle selected";
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="preview-box">
            <strong>${item.name}</strong><br>
            Gear: ${item.transmission}<br>
            Price: ${item.price}
        </div>
    `).join("");
}

// ================= ORDER =================
function placeOrder() {
    const name = document.getElementById("name").value;
    const pickup = document.getElementById("pickup").value;

    if (!name || !pickup) return alert("Fill all fields");

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    orders.push({
        user: localStorage.getItem("loggedUser"),
        name,
        pickup,
        items: cart
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");

    alert("Order placed!");
    window.location.href = "index.html";
}

// ================= ADMIN VIEW =================
function renderAdminOrders() {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const container = document.getElementById("adminOrders");

    if (orders.length === 0) {
        container.innerHTML = "No orders yet";
        return;
    }

    container.innerHTML = orders.map(o => `
        <div class="card">
            <strong>User:</strong> ${o.user}<br>
            <strong>Name:</strong> ${o.name}<br>
            <strong>Pickup:</strong> ${o.pickup}<br>
            <strong>Vehicles:</strong> ${o.items.map(i => i.name).join(", ")}
        </div>
    `).join("");
}
