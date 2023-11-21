async function current(req, res) {
    let data = req.user.usuario;
    console.log(data);
    if (data) {
      res.status(200).render("current", {
        nombre: data.nombre,
        id: data._id,
        email: data.email,
        rol: data.rol,
        token: req.cookies.token,
      });
    }
  }
  
  async function loginRedirection(req, res) {
    res.redirect("/api/sessions/login");
  }
  
  async function loginView(req, res) {
    res.status(200).render("login");
  }
  
  async function deleteCookiesSession(req, res) {
    req.user = null;
  
    res.clearCookie("admin");
    if (res.clearCookie("admin")) {
      console.log("cookie admin destruida archivo views.router.js:7");
    }
  
    res.clearCookie("datos");
    if (res.clearCookie("datos")) {
      console.log("cookie datos destruida archivo views.router.js:10");
    }
  
    res.clearCookie("current");
    if (res.clearCookie("current")) {
      console.log("cookie current destruida archivo views.router linea 13");
    }
  
    res.clearCookie("token");
    if (res.clearCookie("token")) {
      console.log("cookie token destruida archivo views.router linea 16");
    }
  
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
      } else {
        console.log("Sesión de usuario destruida con éxito views.router linea 22");
        res.redirect("/api/sessions/login");
      }
    });
  }
  
  async function profile(req, res) {
    res.status(200).render("profile");
  }
  
  async function realtimeproductsView(req, res) {
    res.status(200).render("realtimeproducts");
  }
  
  async function registerView(req, res) {
    res.status(200).render("register");
  }
  
  module.exports = {
    current,
    loginRedirection,
    loginView,
    deleteCookiesSession,
    profile,
    realtimeproductsView,
    registerView,
  };
  