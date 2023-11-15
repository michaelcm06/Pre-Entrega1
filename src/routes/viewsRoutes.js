import express from 'express';
import { getProducts, getProductById ,createProduct } from '../controllers/productsController.js';
import passport from 'passport';


const router = express.Router();

const auth=(req, res, next)=>{
  if(req.session.usuario){
      next()
  }else{
      return res.redirect('/login')
  }
}

const auth2=(req, res, next)=>{
  if(req.session.usuario){
      console.log('auth2 me manda a perfil')

      return res.redirect('/products')
  }else{
      next()
  }
}

router.get('/',(req,res)=>{

  let verLogin=true
  if(req.session.usuario){
      verLogin=false
  }
  res.status(200).render('index',{
      verLogin
  })
})

router.get('/registro',auth2,(req,res)=>{

  let error=false
  if(req.query.error){
      error=true
      errorDetalle=req.query.error
  }

  res.status(200).render('registro',{
      verLogin:true,
      error
  })
})

router.get('/login',(req,res)=>{

  let error=false
  if(req.query.error){
      error=true
      error=req.query.error
  }
  
  let mensaje=false
  if(req.query.mensaje){
      mensaje=req.query.mensaje
  }
  
  res.status(200).render('login',{
      verLogin:true,
      error, mensaje
  })
})

router.get('/perfil',auth,(req,res)=>{

  res.status(200).render('perfil',{
      verLogin:false,
      usuario: req.session.usuario
  })
})

router.get('/products',auth,(req,res)=>{

  let error=false
  if(req.query.error){
      error=true
      error=req.query.error
  }
  
  let mensaje=false
  if(req.query.mensaje){
      mensaje=req.query.mensaje
  }

  res.status(200).render('products',{
    verLogin:true,
    error, mensaje,
    getProducts
  })
})

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  res.json({ user: req.user });
});


router.get('/:productId', getProductById);

router.post('/create', createProduct);



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

