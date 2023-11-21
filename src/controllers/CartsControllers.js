const cartsService = require("../services/carts.service");
const productsService = require("../services/products.service");
const usersService = require("../services/users.service");

async function cartDelete(req, res) {
  const id = req.params.cid;
  const cartDelete = await cartsService.cartDelete(id);
  if (cartDelete) {
    res.status(200).send("Cart deleted");
  } else {
    res.status(400).send("Failed to delete cart");
  }
}

async function cartProductDelete(req, res) {
  const carritoId = req.params.cid;
  const productId = req.params.pid;

  if (carritoId && productId) {
    const carrito = await cartsService.deleteCartProduct(carritoId, productId);
    res.status(200).send("Product deleted");
  } else {
    res.status(400).send("Failed to delete product");
  }
}

async function cartUpdate(req, res) {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = parseInt(req.body.quantity);

  if (!quantity || !productId || !cartId) {
    res.status(400).send({ error: "Invalid data" });
  } else {
    const updateProductQuantity = await cartsService.updateQuantity(cartId, productId, quantity);
    if (updateProductQuantity) {
      res.status(200).send("Quantity updated successfully");
    } else {
      res.status(400).send("Error");
    }
  }
}

async function cartById(req, res) {
  const id = req.params.pid;
  const productById = await cartsService.cartsById(id);
  if (productById) {
    res.status(200).send(productById);
  } else {
    res.status(400).send({ error: "Id not found" });
  }
}

async function getCarts(req, res) {
  let data = req.cookies.datos;
  let email = data.email;
  const user = await usersService.verifyEmailUser(email);
  if (user) {
    const idUser = user._id;
    const cart = await cartsService.cartsByUserId(idUser);
    const cartInfo = cart.products;
    const cartArray = [];
    const precioTotal = [];
    for (let i = 0; i < cartInfo.length; i++) {
      const product = await productsService.productById(cartInfo[i].product);
      cartArray.push({ product: product.title, quantity: cartInfo[i].quantity, price: parseFloat(cartInfo[i].quantity) * parseFloat(product.price) });
      precioTotal.push(parseFloat(cartInfo[i].quantity) * parseFloat(product.price));
    }
    const total = precioTotal.reduce((acumulador, numero) => acumulador + numero, 0);
    res.status(200).render("carts", {
      cartInfo: cartArray,
      totalPrice: Math.round(total),
      id: idUser,
    });
  }
}

async function cartCreate(req, res) {
  const newCart = req.body;
  const insertCart = await cartsService.createCart(newCart);

  if (insertCart) {
    res.status(200).send("Cart created");
  } else {
    res.status(400).send("Error creating cart");
  }
}

module.exports = {
  cartDelete,
  cartProductDelete,
  cartUpdate,
  cartById,
  getCarts,
  cartCreate,
};
