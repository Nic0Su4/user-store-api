import { regularExps } from "../../../config";


export class RegisterUserDTO {

  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {

  }

  static create( object: { [key: string]: any } ): [string?, RegisterUserDTO?] {
    const { name, email, password } = object;

    if(!name) return ['Mising name'];
    if(!email) return ['Mising email'];
    if(!regularExps.email.test(email)) return ['Email is not valid'];
    if(!password) return ['Mising password'];
    if(password.length < 6) return ['Password too short'];

    return [undefined, new RegisterUserDTO(name, email, password)]

  }

}