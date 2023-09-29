import express from 'express';

const router = express.Router();

// Ruta para mostrar todos los productos
router.get('/products', (req, res) => {
  res.render('products', { productos: productosDB });
});

// Ruta para mostrar un producto específico
router.get('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const producto = productosDB.find(producto => producto.id === parseInt(productId));

  if (producto) {
    res.render('productDetail', { producto });
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Ruta para mostrar un carrito específico
router.get('/carts/:cartId', (req, res) => {
  const cartId = req.params.cartId;
  const cart = carritosDB.find(cart => cart.id === parseInt(cartId));

  if (cart) {
    // Obtener los detalles de los productos asociados al carrito
    const productosEnCarrito = productosDB.filter(producto => cart.productos.includes(producto.id));
    res.render('cartDetail', { cart, productosEnCarrito });
  } else {
    res.status(404).send('Carrito no encontrado');
  }
});

export default router;
