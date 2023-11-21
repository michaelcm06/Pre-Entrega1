const mongoose = require("mongoose")


const messagesCollection = "messages"
const messagesSchema = new mongoose.Schema({

   message : {
              type : String,
              required: true,
},

   user:{
          type: String,
          required: true,
}



})

const messageModelo = mongoose.model(messagesCollection,messagesSchema)

module.exports = messageModelo