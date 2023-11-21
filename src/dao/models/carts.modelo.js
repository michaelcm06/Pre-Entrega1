const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const cartCollection = "carts"
const cartEsquema = new mongoose.Schema({

    idUser : { type : Schema.Types.ObjectId, required : true},
    products:[
        {
            product : { type : Schema.Types.ObjectId , required : true},
            
            quantity : { type : Number , default : 0 }
            
        }
             ]})



const cartsModel = mongoose.model( cartCollection , cartEsquema )

module.exports = cartsModel