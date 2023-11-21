const mongoose = require("mongoose")
const { Schema } = require("mongoose")


const ticketsCollection = "tickets"

const ticketsSchema = new mongoose.Schema({


products : [ {product : { type : String } , quantity : { type : Number}}] ,

amount : { type : Number},

userId : { type :  Schema.Types.ObjectId },

purchaser : { type : String },

purchase_datetime : { type : String },

code : {type : Schema.Types.ObjectId ,  default: () => new mongoose.Types.ObjectId()  },
 
email : { type : String }





})

const ticketsModelo =  mongoose.model(ticketsCollection , ticketsSchema)

module.exports = ticketsModelo