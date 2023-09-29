import express from 'express';
const router = express.Router();

import * as cartsController from '../controllers/cartsController.js';

// Obtener todos los carritos
router.get('/', cartsController.getCarts);

// Crear un nuevo carrito
router.post('/', cartsController.createCart);

// Obtener un carrito por ID
router.get('/:cid', cartsController.getCartById);

// Añadir producto a un carrito
router.post('/:cid/products/:pid', cartsController.addToCart);

// Actualizar la cantidad de productos en un carrito
router.put('/:cid/products/:pid', cartsController.updateProductQuantity);

// Eliminar producto de un carrito
router.delete('/:cid/products/:pid', cartsController.deleteProductFromCart);

// Eliminar todos los productos de un carrito
router.delete('/:cid', cartsController.deleteAllProductsFromCart);

export default router;
