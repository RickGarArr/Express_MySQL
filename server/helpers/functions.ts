import fs from 'fs';
import uniqid from 'uniqid';

export function generarNombreUnico(filename: string) {
    const nombreSplit = filename.split('.');
    const ext = nombreSplit[nombreSplit.length - 1].toLocaleLowerCase();
    const nombreUnico = uniqid();

    return `${nombreUnico}.${ext}`;
}


export function borrarCarpeta(path: string) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                var curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    borrarCarpeta(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
            resolve('Carpeta eliminada correctamente');
        } else {
            reject('Carpeta no existe, hable con el administrador');
        }
    })
}