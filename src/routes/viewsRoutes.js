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
router.get('/carts/:id', (req, res) => {
  const cartId = req.params.id;
  res.setHeader('Content-Type', 'text/html');
  res.render('cartDetail', { cartId });
});

export default router;
