const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

let lastProductId = 0;
let lastCartId = 0;

// Cargar datos de productos desde productos.json al iniciar el servidor
let productsData = [];
try {
  const productsFile = fs.readFileSync('productos.json', 'utf8');
  productsData = JSON.parse(productsFile);
  // Encontrar el último ID de producto
  const lastProduct = productsData[productsData.length - 1];
  if (lastProduct) {
    lastProductId = lastProduct.id;
  }
} catch (error) {
  console.error('Error loading products:', error);
}

// Rutas para manejo de productos
const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  const limit = req.query.limit || productsData.length;
  res.json(productsData.slice(0, limit));
});

productsRouter.get('/:pid', (req, res) => {
  const product = productsData.find(product => product.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

productsRouter.post('/', (req, res) => {
  const newProduct = {
    id: ++lastProductId,
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: req.body.status !== undefined ? req.body.status : true,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.body.thumbnails || [],
  };

  productsData.push(newProduct);
  saveProducts();
  res.status(201).json(newProduct);
});

productsRouter.put('/:pid', (req, res) => {
  const productIndex = productsData.findIndex(product => product.id === parseInt(req.params.pid));
  if (productIndex !== -1) {
    const updatedProduct = { ...productsData[productIndex], ...req.body };
    productsData[productIndex] = updatedProduct;
    saveProducts();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

productsRouter.delete('/:pid', (req, res) => {
  const productIndex = productsData.findIndex(product => product.id === parseInt(req.params.pid));
  if (productIndex !== -1) {
    productsData.splice(productIndex, 1);
    saveProducts();
    res.json({ message: 'Product deleted' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.use('/api/products', productsRouter);

// Cargar datos de carritos desde carrito.json al iniciar el servidor
let cartsData = [];
try {
  const cartsFile = fs.readFileSync('carrito.json', 'utf8');
  cartsData = JSON.parse(cartsFile);
  // Encontrar el último ID de carrito
  const lastCart = cartsData[cartsData.length - 1];
  if (lastCart) {
    lastCartId = lastCart.id;
  }
} catch (error) {
  console.error('Error loading carts:', error);
}

// Rutas para manejo de carritos
const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: ++lastCartId,
    products: [],
  };

  cartsData.push(newCart);
  saveCarts();
  res.status(201).json(newCart);
});

cartsRouter.get('/:cid', (req, res) => {
  const cart = cartsData.find(cart => cart.id === parseInt(req.params.cid));
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cart = cartsData.find(cart => cart.id === parseInt(req.params.cid));
  const product = productsData.find(product => product.id === parseInt(req.params.pid));

  if (!cart) {
    res.status(404).json({ message: 'Cart not found' });
    return;
  }

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const existingProduct = cart.products.find(item => item.product === parseInt(req.params.pid));

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: parseInt(req.params.pid), quantity: 1 });
  }

  saveCarts();
  res.json(cart.products);
});

app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function saveProducts() {
  fs.writeFileSync('productos.json', JSON.stringify(productsData, null, 2));
}

function saveCarts() {
  fs.writeFileSync('carrito.json', JSON.stringify(cartsData, null, 2));
}
