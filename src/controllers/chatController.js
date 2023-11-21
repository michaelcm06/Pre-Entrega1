async function chat( req , res ){

    let email  = req.cookies.datos
    
    res.status(200).render("chat",{

        email : email.email
    })


}

module.exports = chat