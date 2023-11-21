const dotenv = require("dotenv")
const { getDAO } = require("../functions/selectDAO")
const dao = getDAO()

dotenv.config({

     override : true ,
     path: __dirname + "/.env.sample" 

})

const config = {

  PORT : process.env.PORT,
  SECRET : process.env.SECRET,
  MONGO_URL : process.env.MONGO_URL,
  DB_NAME : process.env.DB_NAME,
  SERVICE : process.env.SERVICE,
  MAILINGPORT : process.env.MAILINGPORT,
  MAILINGUSER : process.env.MAILINGUSER,
  MAILINGPASSWORD : process.env.MAILINGPASSWORD,
  PRIVATE_KEY00 : process.env.PRIVATE_KEY00,
  PRIVATE_KEY01 : process.env.PRIVATE_KEY01,
  DAO : dao.DAO || process.env.DAO,


}


module.exports = config