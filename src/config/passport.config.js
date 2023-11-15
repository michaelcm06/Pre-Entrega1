import passport from 'passport'
import { Strategy as LocalStrategy }  from 'passport-local'
import github from 'passport-github2'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { modeloUsuarios } from '../Dao/models/UsuariosMongoDAO.js';
import { generaHash, validaHash } from '../utils.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

export const inicializaPassport = () => {
     // estrategias
     passport.use('github', new github.Strategy(
        {
            clientID: 'Iv1.57172691f62bef81', 
            clientSecret: '2a4922cf430c68357a0c443e32634bd6bcb45a24',
            callbackURL: 'http://localhost:8080/sessions/callbackGithub'
        },
        async(token, tokenRefresh, profile, done)=>{
            try {
                console.log(profile)
                let usuario=await modeloUsuarios.findOne({email:profile._json.email})
                if(!usuario){
                    usuario=await modeloUsuarios.create({
                        nombre: profile._json.name,
                        email: profile._json.email,
                        github: profile
                    })
                }

                done(null, usuario)


            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('registro', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
          try {
            let { first_name, last_name, email, age } = req.body;
      
            if (!first_name || !last_name || !email || !password || !age) {
              return done(null, false, { message: 'Complete todos los campos.' });
            }
      
            let existe = await modeloUsuarios.findOne({ email });
      
            if (existe) {
              return done(null, false, { message: `El usuario ${email} ya existe en la base de datos.` });
            }
      
            let hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      
            let usuario = await modeloUsuarios.create({
              first_name,
              last_name,
              email,
              age,
              password: hashedPassword,
            });
      
            return done(null, usuario);
      
          } catch (error) {
            return done(error);
          }
        }
      ))
    
      passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
          try {
            let usuario = await modeloUsuarios.findOne({ email:username });
            if (!usuario) {
              return done(null, false, { message: `El usuario ${username} no existe en la base de datos.` });
            }
            if (!bcrypt.compareSync(password, usuario.password)) {
              return done(null, false, { message: 'Credenciales inválidas.' });
            }
            return done(null, usuario);
          } catch (error) {
            return done(error);
          }
        }
      ))

      const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['jwtToken'];
        }
        return token;
      };
      
      const jwtOptions = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: 'Coder@23', // Reemplaza con tu clave secreta
      };

      passport.use('current', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
          const user = await getUserFromDatabase(jwt_payload.id);
          
          if (user) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Token inválido' });
          }
        } catch (error) {
          return done(error, false);
        }
      }))
      
}


    // passport.use('registro', new local.Strategy(
    //     {
    //         usernameField:'email', passReqToCallback:true
    //     },
    //     async(req, username, password, done)=>{
    //         try {

    //             // logica de registro
    //             let {nombre, email, password}=req.body


    //             if(!nombre || !email || !password){
    //                 done(null, false)
    //             }
            
    //             let existe=await modeloUsuarios.findOne({email})
    //             if(existe){
    //                 done(null, false)
    //             }
            
    //             let role = 'usuario'; // Por defecto, el rol es "usuario"
    //             if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    //                 role = 'admin'; // Asignar el rol de administrador
    //             }

    //             let usuario=await modeloUsuarios.create({
    //                 nombre, email, role,
    //                 password: generaHash(password)
    //             })

    //             console.log('pasando x passport registro...!!!')

    //             done(null, usuario)
            
    //         } catch (error) {
    //             done(error)
    //         }
    //     }
    // ))


    // passport.use('login', new local.Strategy(
    //     {
    //         usernameField:'email'
    //     },
    //     async(username, password, done)=>{
    //         try {
    //             if(!username || !password) {
    //                 return done(null, false)
    //             }
    //             let usuario=await modeloUsuarios.findOne({email:username})
    //             if(!usuario){

    //                 return done(null, false)
    //             }else{
    //                 if(!validaHash(usuario, password)){
    //                     // clave invalida
    //                     return done(null, false)
    //                 }
    //             }

    //             usuario={
    //                 nombre: usuario.nombre, 
    //                 email: usuario.email, 
    //                 _id: usuario._id,
    //                 rol: usuario.rol
    //             }

    //             return done(null, usuario)
            
    //         } catch (error) {
    //             // done(error, null)
    //             return done(error)
    //         }
    //     }
    // ) )

    // passport.serializeUser((ususario, done)=>{
    //     return done(null, ususario._id)
    // })

    // passport.deserializeUser(async(id, done)=>{
    //     let usuario=await modeloUsuarios.findById(id)
    //     return done(null, usuario)
    // })

//} // fin de inicializaPassport