const socket = io();

// Escucha clics en los botones de eliminación
document.querySelectorAll('.remove-button').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.closest('.cart-item').dataset.productId;
        const email = document.querySelector('.email').id;

        const data = {
            productId: productId,
            email: email,
        };

        socket.emit('removeFromCart', data);
    });
});

// Puedes agregar una notificación al cliente cuando el producto se elimina del carrito
socket.on('productRemoved', () => {
    alert('Producto eliminado con éxito del carrito');
});
