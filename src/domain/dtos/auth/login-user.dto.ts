import { regularExps } from "../../../config";


export class LoginUserDTO {

  private constructor(
    public email: string,
    public password: string,
  ) {

  }

  static auth( object: { [key: string]: any } ): [string?, LoginUserDTO?] {
    const { email, password } = object;

    if(!email) return ['Mising email'];
    if(!regularExps.email.test(email)) return ['Email is not valid'];
    if(!password) return ['Mising password'];
    if(password.length < 6) return ['Password too short'];

    return [undefined, new LoginUserDTO(email, password)]

  }

}