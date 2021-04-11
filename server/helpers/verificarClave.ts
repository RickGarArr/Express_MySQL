import bcrypt from 'bcrypt';

export default function isClaveValida(clave: string) {
    let bool = false;
    bcrypt.compareSync(clave, process.env.CLAVE as string) ? bool = true : bool = false;
    return bool;
}