// Responsive Navigation Menu
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    document.querySelectorAll('.nav-menu ul li').forEach(item => {
        item.style.display = "block";
    });
});

// Newsletter Form Validation
const newsletterForm = document.querySelector('#newsletter form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            alert('Please enter a valid email address.');
            e.preventDefault();
        }
    });
}

// Testimonials Carousel
const testimonialsCarousel = document.querySelector('.testimonials-carousel');
if (testimonialsCarousel) {
    let currentIndex = 0;
    const testimonials = testimonialsCarousel.querySelectorAll('.testimonial');
    const totalTestimonials = testimonials.length;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }

    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalTestimonials;
        showTestimonial(currentIndex);
    }, 5000);

    showTestimonial(currentIndex);
}

// Hotel Booking Form Validation
const hotelForm = document.querySelector('#hotel-booking form');
if (hotelForm) {
    hotelForm.addEventListener('submit', (e) => {
        const cityInput = hotelForm.querySelector('input[type="text"]');
        const checkIn = hotelForm.querySelector('input[name="check-in"]');
        const checkOut = hotelForm.querySelector('input[name="check-out"]');
        let isValid = true;

        if (!cityInput.value.trim()) {
            alert('Please enter a city or hotel name.');
            isValid = false;
        }

        if (!checkIn.value || !checkOut.value) {
            alert('Please select check-in and check-out dates.');
            isValid = false;
        }

        if (new Date(checkIn.value) > new Date(checkOut.value)) {
            alert('Check-in date cannot be later than check-out date.');
            isValid = false;
        }

        if (!isValid) e.preventDefault();
    });
}

// Scroll Animation for Sections
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    observer.observe(section);
});

// Smooth Scrolling for Navigation Links
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');

        if (href.startsWith("#")) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            window.location.href = href;
        }

        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});

// Wishlist Functionality
document.addEventListener("DOMContentLoaded", function() {
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");

    wishlistBtns.forEach(button => {
        button.addEventListener("click", function() {
            const item = {
                name: this.getAttribute("data-name"),
                image: this.getAttribute("data-image"),
                price: this.getAttribute("data-price") || "N/A"
            };

            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            if (!wishlist.some(w => w.name === item.name)) {
                wishlist.push(item);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                alert(`${item.name} added to wishlist!`);
            } else {
                alert(`${item.name} is already in your wishlist.`);
            }
        });
    });
});

// Cart Functionality
// ✅ Load cart items from localStorage and display them correctly
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-container");

    // ✅ Prevent errors if cart-container is missing
    if (!container) return;

    let totalPrice = 0;
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("total-price").textContent = "0.00";
        return;
    }

    cart.forEach((item, index) => {
        let itemPrice = Number(item.price); // ✅ Ensure price is a number
        if (isNaN(itemPrice)) {
            console.warn(`Invalid price detected for ${item.name}:`, item.price);
            itemPrice = 0; // ✅ Fallback to 0 if invalid
        }

        let itemTotal = itemPrice * item.quantity;
        totalPrice += itemTotal;

        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <p><strong>${item.name}</strong></p>
                <p>$${itemPrice.toFixed(2)} x ${item.quantity} = <strong>$${itemTotal.toFixed(2)}</strong></p>
            </div>
            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">➕</button>
            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">➖</button>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        container.appendChild(itemElement);
    });

    // ✅ Update total price display
    const totalPriceElement = document.getElementById("total-price");
    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
}

// ✅ Handle adding items to cart
document.querySelectorAll(".cart-btn").forEach(button => {
    button.addEventListener("click", function() {
        let name = this.getAttribute("data-name");
        let price = parseFloat(this.getAttribute("data-price").replace(/[^0-9.]/g, "")) || 0; // ✅ Ensure numeric price
        let image = this.getAttribute("data-image");

        addToCart(name, image, price);
    });
});

// ✅ Add items to cart & show success alert
function addToCart(name, image, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, image, price: Number(price), quantity: 1 }); // ✅ Store price as number
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} has been successfully added to your cart 🛒!`);
    loadCart(); // ✅ Refresh cart display
}

// ✅ Update item quantity in cart
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// ✅ Remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// ✅ Clear entire cart
function clearCart() {
    localStorage.removeItem("cart");
    loadCart();
}

// ✅ Handle checkout process
function checkout() {
    alert("Proceeding to checkout...");
}

// ✅ Ensure script runs only if cart-container exists
document.addEventListener("DOMContentLoaded", loadCart);
