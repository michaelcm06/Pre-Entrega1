const { Command , option } = require("commander")
const fs = require("fs")
const path = require("path")
const { fork } = require("child_process")
const { json } = require("body-parser")

const pathDAO = path.join(__dirname,"../","Json","persistance.json")
const pathJsonUsers = path.join(__dirname,"../","Json","users.json")

async function getJsonUsers(){

  return JSON.parse(fs.readFileSync(pathJsonUsers))

}

function getDAO(){return JSON.parse(fs.readFileSync(pathDAO))}


async function selectDAO(){

    let program = new Command()

program
   .option("-D , --DAO <DAO> " , "PERSISTENCIA DE LA APP", "MONGO")
   .parse(process.argv)


const opciones = program.opts()
const daoObject = { DAO :  opciones.DAO }

fs.writeFileSync(pathDAO , JSON.stringify(daoObject))
}



module.exports = { selectDAO , getDAO , getJsonUsers }

