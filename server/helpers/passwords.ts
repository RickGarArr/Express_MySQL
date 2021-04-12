import { compare, genSaltSync, hash } from 'bcrypt';

export function coincidenPasswords(password: string, bcryptPass: string) {
    return new Promise<boolean>((resolve) => {
        compare(password, bcryptPass, (err) => {
            if (err) resolve(false);
            resolve(true);
        });
    });
}

export function cifrarPassword(password: string) {
    return new Promise<string>((resolve, reject) => {
        hash(password, genSaltSync(7), (err, encrypted) => {
            if (err) reject(err);
            resolve(encrypted);
        });
    });
}