import mongoose from 'mongoose'

export const modeloUsuarios=mongoose.model('usuarios', new mongoose.Schema({
    first_name:String,
    last_name:String,
    email: {type: String, unique: true},
    age:Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    rol: {type: String, default: 'user'},
    github: {}

}))