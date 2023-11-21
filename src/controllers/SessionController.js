const { generaJWT, generaAdminJWT } = require("../utils.js");
const usersService = require("../services/users.service.js");
const bcrypt = require("bcrypt");
const send = require("../mail/send.js");

async function errGithub(req, res) {
  res.status(200).send({ error: "fallo al autenticar" });
}

async function githubLogin(req, res) {
  const token = generaJWT(req.user._id);
  if (token) {
    res.cookie("token", token, { httpOnly: false });
  }
  res.status(200).redirect("/api/products");
  console.log("holaa");
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("complete todos los campos");
  } else {
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      const adminData = { email: email };
      const adminCookie = generaAdminJWT(adminData);
      res.cookie("admin", adminCookie, { httpOnly: true });
      res.status(200).redirect("/realtimeproducts");
    } else {
      const user = await usersService.verifyEmailUser(email);
      if (!user) {
        res.status(400).send({ message: "usuario no encontrado" });
      } else {
        let uncryptPassword = await bcrypt.compare(password, user.password);
        if (!uncryptPassword) {
          res.status(400).send("usuario no existente");
        } else {
          const token = generaJWT(user);
          if (token) {
            send(email)
              .then((d) => console.log(d))
              .catch((error) => console.log(error));

            res.cookie("token", token, { httpOnly: false });
            let datos = { nombre: user.nombre, email: email };
            res.cookie("datos", datos, { httpOnly: false });
            res.status(200).redirect("/api/products");
          }
        }
      }
    }
  }
}

async function register(req, res) {
  const { nombre, apellido, email, password } = req.body;
  let { edad } = req.body;

  if (!nombre || !email || !password || !apellido || !edad) {
    res.status(400).send("complete todos los campos");
  } else {
    const emailVerification = await usersService.verifyEmailUser(email);

    if (emailVerification) {
      res.status(400).send("usuario con ese email ya existe");
    } else {
      hash = await bcrypt.hash(password, 10);
      edad = parseInt(edad);
      const userCreate = await usersService.createUser({
        nombre,
        apellido,
        edad,
        email,
        password: hash,
      });

      if (userCreate) {
        res.status(200).redirect("/api/sessions/login");
      } else {
        res.status(400).send("no es posible crear este usuario");
      }
    }
  }
}

module.exports = {
  errGithub,
  githubLogin,
  login,
  register,
};
