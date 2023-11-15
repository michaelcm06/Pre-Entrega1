import {Router} from 'express';
import crypto from 'crypto'

import passport from 'passport';
import cookieParser from 'cookie-parser';
export const router = Router()
import jwt from 'jsonwebtoken';


router.get('/github', passport.authenticate('github', {}), (req, res) => {})


router.get('/callbackGithub', passport.authenticate('github', {
  failureRedirect: '/sessions/errorGithub'
}), (req, res) => {

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    mensaje: 'Login OK',
    usuario: req.user
  });
  res.redirect('/products')
});

router.get('/errorGithub', (req, res) => {

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    error: 'Error en Github'
  });
});

router.post('/registro', function (req, res, next) {
  passport.authenticate('registro', function (err, user, info, status) {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.redirect(`/registro?error=${info.message?info.message:info.toString()}`)
    }
    req.user = user
    return next()
  })(req, res, next);
}, (req, res) => {

  res.status(200).redirect(`/login?mensaje=Usuario ${req.user.first_name} registrado correctamente. Username: ${req.user.email}`)
})

router.post('/login', function (req, res, next) {
  passport.authenticate('login', (err, user, info, status) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect(`/login?error=${info.message?info.message:info.toString()}`);
    }

    const token = jwt.sign({
      user: user
    }, 'tu_clave_secreta', {
      expiresIn: '1h'
    });

    // Configurar la cookie para almacenar el token
    res.cookie('jwtToken', token, {
      httpOnly: true
    });

    req.user = user;
    return next();
  })(req, res, next);
}, (req, res) => {
  console.log(req.user);

  req.session.usuario = req.user;

  res.status(200).redirect(`/products?mensaje=Usuario: ${req.user.email} logueado correctamente. Rol: ${req.user.rol}`);
})



router.get('/logout', (req, res) => {

  req.session.destroy(e => console.log(e))

  res.redirect('/login?mensaje=logout correcto...!!!')

});