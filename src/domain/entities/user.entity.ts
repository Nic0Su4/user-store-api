import { CustomError } from "../errors/custom.error";


export class UserEntity {

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public img?: string,
  ) {

  }

  static fromObject( object: {[key: string]: any} ) {
    const { id, _id, name, email, emailValidated, password, role, img } = object;

    if(!_id && !id) throw CustomError.badRequest('Mising id');

    if(!name) throw CustomError.badRequest('Mising name');
    if(!email) throw CustomError.badRequest('Mising email');
    if(emailValidated === undefined) throw CustomError.badRequest('Mising emailValidated');
    if(!password) throw CustomError.badRequest('Mising password');
    if(!role) throw CustomError.badRequest('Mising role');

    return new UserEntity(_id || id, name, email, emailValidated, password, role, img)
  }

}