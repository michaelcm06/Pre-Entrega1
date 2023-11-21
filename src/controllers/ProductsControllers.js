const productsService = require("../services/products.service.js");
const usersService = require("../services/users.service.js")
const cartsService = require("../services/carts.service.js")
const cartCreateAndComprobe = require("../functions/cartComprobe.js")

async function deleteProduct(req, res) {
  const id = req.params.pid;
  const productDeleted = await productsService.deleteProduct(id);
  if (productDeleted) {
    res.status(200).send(`Product id: ${id} deleted successfully`);
  } else {
    res.status(400).send(`Product id: ${id} not found`);
  }
}

async function postProducts(req, res) {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category
  } = req.body;
  if (!title || !description || !code || !price || !status || !stock || !category) {
    return res.status(400).json({
      error: 'Complete all required fields in the body'
    });
  }

  const newProduct = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
  };

  await productsService.createProduct(newProduct);

  res.status(201).json({
    newProduct
  });
}

async function productById(req, res) {
  const id = req.params.pid;
  const products = await productsService.productById(id);

  if (products) {
    res.status(200).send(products);
  } else {
    res.status(400).send(`Product id ${id} not found`);
  }
}

async function getProducts(req, res) {
    if (!req.cookies.token) {
      res.redirect("/api/sessions/login")
      console.log(" denegado el acceso a products products.router.js:43 ")
      return
    }

    let data = req.cookies.datos

    const limit = parseInt(req.query.limit)
    const category = req.query.category
    const status = req.query.status
    let pagina = req.query.pagina
    const sort = parseInt(req.query.sort)
    let nombre = ""
    let email = ""

    if (data) {
      nombre = data.nombre
      email = data.email
    }




    try {
      const id = req.user._id

      if (id) {

        const user = await usersService.userById(id)

        nombre = user.nombre
        email = user.email

      } else {
        id = false
      }
    } catch (error) {
      console.log(error + " products.router.js:63")
    }


    cartCreateAndComprobe(email)

    if (!nombre && !email) {
      res.status(200).send({
        message: " Datos de la sesion ( nombre y email ) no reconocidos "
      })
    }


    if (sort || limit || pagina || category || status) {
      console.log("entre")
      /*sort*/
      if (sort && sort === 1 || sort === -1) {

        const products = await productsService.sortPrice(sort) 


        res.status(200).render("products", {

          products: products,
          nombre: nombre,
          email: email


        })
      }

      if (limit) {
        const products = await productsService.productByLimit(limit)
        res.status(200).render("products", {
          products: products,
          nombre: nombre,
          email: email
        })
      }



      if (pagina) {
        let limite = 20
        const products = await productsService.products_Paginate(pagina, limite)

        let {
          totalPages,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage
        } = products

        res.status(200).render("products", {

          products: products.docs,
          nombre: nombre,
          email: email,
          totalPages,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage


        })

      }
      if (status) { 
        const products = await productsService.productsByStatus(status)
        if (products) {

          res.status(200).render("products", {

            products: products,
            nombre: nombre,
            email: email
          })
        }
      }

      if (category) {


        if (category) {
          const products = await productsService.productsByCategory(category)
          if (products) {

            res.status(200).render("products", {

              products: products,
              nombre: nombre,
              email: email
            })
          }
        }
      }
    } else {

      pagina = 1
      let limite = 20
      const products = await productsService.products_Paginate(pagina, limite)


      let {
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
      } = products

      res.status(200).render("products", {

        products: products.docs,
        nombre: nombre,
        email: email,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage


      })
    }
    }

    async function putProducts(req, res) {
      const id = req.params.pid;
      const productToUpdate = req.body;

      const update = await productsService.updateProduct(id, productToUpdate);

      if (update) {
        res.status(200).json("Product updated successfully");
      } else {
        res.status(400).send("Product not updated");
      }
    }
  

    module.exports = {
      deleteProduct,
      postProducts,
      productById,
      getProducts,
      putProducts,
    };