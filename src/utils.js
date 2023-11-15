import bcrypt from 'bcrypt'


export const generaHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const validaHash=(usuario, password)=>bcrypt.compareSync(password, usuario.password)