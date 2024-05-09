import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDTO, RegisterUserDTO, UserEntity } from "../../domain";
import { EmailService } from "./email.service";
import jwt from 'jsonwebtoken';


export class AuthService {

  constructor(
    private readonly emailService: EmailService,
  ) {

  }

  public async registerUser( registerDto: RegisterUserDTO ) {

    const existUser = await UserModel.findOne({email: registerDto.email})
    if(existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerDto);
      
      // Encriptar la contraseña
      user.password = bcryptAdapter.hash(registerDto.password);
      await user.save();

      // JWT <--- para mantener la autenticación del usuario
      const token = await JwtAdapter.generateToken({id: user.id, email: user.email});
      if(!token) throw CustomError.internalServer('Error while creating JWT');

      // Email de confirmación
      this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: token,
      }

      return user;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

  }

  public async loginUser(loginDto: LoginUserDTO) {

    // FindOne para verificar si existe
    const user = await UserModel.findOne({email: loginDto.email})
    if(!user) throw CustomError.badRequest('Email does not exist');

    // isMatch usando bcrypt compare
    const isMatching = bcryptAdapter.compare(loginDto.password, user.password);
    if(!isMatching) throw CustomError.badRequest('Password is not valid');

    const {password, ...userEntity} = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({id: user.id, email: user.email});
    if(!token) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token,
    }

  }

  private sendEmailValidationLink = async(email: string) => {

    const token = await JwtAdapter.generateToken({email});
    if(!token) throw CustomError.internalServer('Error while creating JWT');

    const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate email: ${email}</a>
    `
    
    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const emailSent = await this.emailService.sendEmail(options);
    if(!emailSent) throw CustomError.internalServer('Error while sending email');

    return true;

  }

  public validateEmail = async(token: string) => {

    const payload = await JwtAdapter.validateToken(token);
    if(!payload) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as {email: string};
    if(!email) throw CustomError.internalServer('Email not found in token');

    const user = await UserModel.findOne({email});
    if(!user) throw CustomError.internalServer('Email does not exist');

    user.emailValidated = true;
    await user.save();

    return true;

  }

}