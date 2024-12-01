document.addEventListener("DOMContentLoaded", function () {
    let searchBtn = document.getElementById("search-btn");
    let shopnowBtn = document.getElementById("call-to-action");
    let home = document.getElementById("logo-image");

    searchBtn.addEventListener("click", function () {
        window.open("/products");
    });

    shopnowBtn.addEventListener("click", function () {
        window.open("/products");
    });

    home.addEventListener("click", function () {
        window.open("/");
    });
});

let cart = []


function addToCart(product) {
    
    const existingProduct = cart.find(item => item.id === product.id)
    if (existingProduct) {
        existingProduct.quantity += 1
    } else {
        cart.push({...product, quantity: 1})
    }

   
    localStorage.setItem('cart', JSON.stringify(cart))
}


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id')
        const productName = button.getAttribute('data-product-name')
        const productPrice = button.getAttribute('data-product-price')

        const product = {
            id: productId,
            name: productName,
            price: parseFloat(productPrice)
        }

        addToCart(product)
        updateCartDisplay()
    })
})

function updateQuantity(productId, action) {
    const product = cart.find(item => item.id === productId)
    if (product) {
        if (action === 'increase') {
            product.quantity += 1
        } else if (action === 'decrease' && product.quantity > 1) {
            product.quantity -= 1
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        updateCartDisplay()
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId)
    

    localStorage.setItem('cart', JSON.stringify(cart))
    updateCartDisplay()
}


document.querySelectorAll('.remove-from-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id')
        removeFromCart(productId)
    })
})


function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || []

    const cartContainer = document.getElementById('cart-container')
    cartContainer.innerHTML = ''

    cartItems.forEach(item => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price}</span>
                <span>${item.quantity}</span>
                <button class="remove-from-cart" data-product-id="${item.id}">Remove</button>
            </div>
        `
    })
}


document.addEventListener('DOMContentLoaded', loadCart)
