document.addEventListener('click', function(event) {
    if (event.target && event.target.className === 'add-to-cart') {
      const productId = event.target.dataset.productId;
      addToCart(productId);
    }
  });
  
  function addToCart(productId) {
    fetch(`/cart/${cartId}/products/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: 1 }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Producto agregado al carrito');
      } else {
        alert('Error al agregar el producto al carrito');
      }
    })
    .catch(error => console.error('Error:', error));
  }
  
  function checkout() {
    fetch(`/cart/${cartId}/checkout`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Compra realizada exitosamente');
      } else {
        alert('Error al realizar la compra');
      }
    })
    .catch(error => console.error('Error:', error));
  }
  