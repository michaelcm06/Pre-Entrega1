import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import {engine} from 'express-handlebars';
import productsRoutes from './routes/productsRoutes.js';
import cartsRoutes from './routes/cartsRoutes.js';
import conectarDB from './conexionDB.js'; 
import viewsRoutes from './routes/viewsRoutes.js';
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import session from 'express-session'
import { inicializaPassport } from './config/passport.config.js';
import passport from 'passport';
import ConnectMongo from 'connect-mongo'
import { router as sessionsRouter } from './routes/sessions.router.js';
import { config } from "./config/config.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


const app = express();

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

// Configuración de la base de datos
app.use(session({
  secret:'claveSecreta',
  resave:true, saveUninitialized:true,
  store: ConnectMongo.create({
      mongoUrl:'mongodb+srv://Michaelcm2000:Coder123@cluster0.arcaq42.mongodb.net/?retryWrites=true&w=majority&dbName=Tienda',
      dbName:config.DB_NAME,
      ttl: 3600
  })
}))

inicializaPassport()
app.use(passport.initialize())
app.use(passport.session())

// Rutas
app.use('/products', productsRoutes);
app.use('/sessions', sessionsRouter);
app.use('/carts', cartsRoutes);
app.use('/', viewsRoutes);

app.get('/carts', (req, res) => {
  res.render('carts'); 
});

console.log(config.PORT)

console.log(config)



// Puerto de escucha
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// Conexión a la base de datos MongoDB
conectarDB();


