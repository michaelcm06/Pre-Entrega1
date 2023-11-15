import { config } from './config/config.js';
import mongoose from 'mongoose';


const conectarDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, {
            dbName: config.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
}

export default conectarDB;