const nodemailer = require("nodemailer")
const  config  = require("../config/config")

const transporter = nodemailer.createTransport({

   service : config.SERVICE, 
   port : config.MAILINGPASSWORD , 
   auth : {

     user: config.MAILINGUSER,
     pass : config.MAILINGPASSWORD

   },
   tls: {
    rejectUnauthorized: false,
  },

})

const send = async(email) => {

    return transporter.sendMail({
        
    from : "Michael <maicolcastro54@gmail.com>",
    to : email ,
    subject : "Inicio de inicio de sesion ",
    html: `<h1>Bienvenido</h1>`
})  

}
module.exports = send