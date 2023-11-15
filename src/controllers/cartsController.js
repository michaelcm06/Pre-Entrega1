import Cart from '../Dao/models/Cart.js';
import Product from '../Dao/models/Product.js';
import mongoose from 'mongoose';

const getCartById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const cart = await Cart.findById(req.params.id).populate('products.product');
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};


const createCart = async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.json({ status: 'success', message: 'Carrito creado exitosamente', cart });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return res.json({ status: 'error', message: 'ID de carrito o producto inválido' });
    }

    const cart = await Cart.findOne({ _id: req.params.id });

    if (!cart) {
      return res.json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const product = await Product.findById(req.params.pid);

    if (!product) {
      return res.json({ status: 'error', message: 'Producto no encontrado' });
    }

    // Agregar el producto al array de productos del carrito
    cart.products.push({
      product: product._id,
      quantity: 1, // Puedes ajustar la cantidad según tus necesidades
    });

    // Guardar el carrito en la base de datos
    await cart.save();

    res.json({ status: 'success', message: 'Producto agregado al carrito' });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};



const deleteProductFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    const productIndex = cart.products.findIndex(
      item => item._id.equals(req.params.pid)
    );

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      return res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } else {
      return res.json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    cart.products = req.body.products;
    await cart.save();
    res.json({ status: 'success', message: 'Carrito actualizado' });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    const productIndex = cart.products.findIndex(
      item => item._id.equals(req.params.pid)
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = req.body.quantity;
      await cart.save();
      return res.json({ status: 'success', message: 'Cantidad de producto actualizada' });
    } else {
      return res.json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

const deleteAllProductsFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    cart.products = [];
    await cart.save();
    res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

export {
  getCartById,
  addToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteAllProductsFromCart,
  createCart,
};
