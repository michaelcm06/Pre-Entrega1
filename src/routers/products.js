const express = require('express');
const router = express.Router();
const fs = require('fs');

let lastProductId = 0;


// Función para cargar los datos de productos desde el archivo productos.json
function loadProducts() {
  try {
    const productsFile = fs.readFileSync('productos.json', 'utf8');
    //const productsFile = fs.readFileSync(__dirname + '/productos.json', 'utf8');
    return JSON.parse(productsFile);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Función para guardar los datos de productos en el archivo productos.json
function saveProducts(products) {
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
}

// Listar todos los productos
router.get('/', (req, res) => {
  const limit = req.query.limit || undefined;
  const products = loadProducts();
  
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

// Obtener un producto por su ID
router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const products = loadProducts();
  const product = products.find(p => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
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

// Actualizar un producto por su ID
router.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProductData = req.body;
  const products = loadProducts();

  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedProductData };
    saveProducts(products);

    res.json(products[productIndex]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Eliminar un producto por su ID
router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  const products = loadProducts();
  const updatedProducts = products.filter(p => p.id !== productId);

  if (products.length !== updatedProducts.length) {
    saveProducts(updatedProducts);
    res.json({ message: 'Product deleted' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;
