// Base de datos temporal para almacenar los carritos
let carts = [];

// Obtener todos los carritos
export const getCarts = (req, res) => {
  res.json({ status: 'success', payload: carts });
};

// Crear un nuevo carrito
export const createCart = (req, res) => {
  const newCart = { id: Date.now().toString(), products: [] };
  carts.push(newCart);
  res.json({ status: 'success', message: 'Carrito creado exitosamente', cart: newCart });
};

// Obtener un carrito por ID
export const getCartById = (req, res) => {
  const { cid } = req.params;
  const cart = carts.find(cart => cart.id === cid);
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  }
  res.json({ status: 'success', payload: cart });
};

// Añadir producto a un carrito
export const addToCart = (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = carts.find(cart => cart.id === cid);
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  }

  cart.products.push({ id: pid, quantity: parseInt(quantity) });
  res.json({ status: 'success', message: 'Producto agregado al carrito' });
};

// Actualizar la cantidad de productos en un carrito
export const updateProductQuantity = (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = carts.find(cart => cart.id === cid);
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  }

  const product = cart.products.find(product => product.id === pid);
  if (!product) {
    return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
  }

  product.quantity = parseInt(quantity);
  res.json({ status: 'success', message: 'Cantidad de producto actualizada en el carrito' });
};

// Eliminar producto de un carrito
export const deleteProductFromCart = (req, res) => {
  const { cid, pid } = req.params;

  const cart = carts.find(cart => cart.id === cid);
  if (!cart) {
    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  }

  const productIndex = cart.products.findIndex(product => product.id === pid);
  if (productIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
  }

  cart.products.splice(productIndex, 1);
  res.json({ status: 'success', message: 'Producto eliminado del carrito' });
};

// Eliminar todos los productos de un carrito
export const deleteAllProductsFromCart = (req, res) => {
  const { cid } = req.params;

  const cartIndex = carts.findIndex(cart => cart.id === cid);
  if (cartIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  }

  carts.splice(cartIndex, 1);
  res.json({ status: 'success', message: 'Productos eliminados del carrito' });
};
