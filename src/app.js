import express from 'express';
import path from 'path';
import {engine} from 'express-handlebars';
import productsRoutes from './routes/productsRoutes.js';
import cartsRoutes from './routes/cartsRoutes.js';
import viewsRoutes from './routes/viewsRoutes.js';
import conectarDB from './conexionDB.js'; 
import {fileURLToPath} from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


const app = express();

// Conexión a la base de datos MongoDB
conectarDB();

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

// Rutas
app.use('/products', productsRoutes);
app.use('/cart', cartsRoutes);
app.use('/views', viewsRoutes);

app.get('/', (req, res) => {
  res.render('index'); // Esto renderizará 'views/index.handlebars'
});

app.get('/products', (req, res) => {
  res.render('products'); // Esto renderizará 'views/index.handlebars'
});


// Puerto de escucha
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
