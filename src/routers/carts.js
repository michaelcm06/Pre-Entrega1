const express = require('express');
const router = express.Router();
const fs = require('fs');



// Función para cargar los datos de carritos desde el archivo carrito.json
function loadCarts() {
  try {
    const cartsFile = fs.readFileSync('carrito.json', 'utf8');
    //const cartsFile = fs.readFileSync(__dirname + '/carrito.json', 'utf8');
    return JSON.parse(cartsFile);
  } catch (error) {
    console.error('Error loading carts:', error);
    return [];
  }
}

// Función para guardar los datos de carritos en el archivo carrito.json
function saveCarts(carts) {
  fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));
}

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = {
    id: Date.now().toString(), // Generar un ID único basado en la fecha actual
    products: [],
  };

  const carts = loadCarts();
  carts.push(newCart);
  saveCarts(carts);

  res.status(201).json(newCart);
});

// Listar productos de un carrito por su ID
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const carts = loadCarts();
  const cart = carts.find(c => c.id === cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  const carts = loadCarts();
  const products = loadProducts(); 

  const cartIndex = carts.findIndex(c => c.id === cartId);
  const product = products.find(p => p.id === productId);

  if (cartIndex !== -1 && product) {
    const cart = carts[cartIndex];
    const existingProduct = cart.products.find(item => item.product === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    saveCarts(carts);

    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Cart or Product not found' });
  }
});

module.exports = router;
