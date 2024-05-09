import { Request, Response } from "express";
import { CustomError, LoginUserDTO, RegisterUserDTO } from "../../domain";
import { AuthService } from "../services/auth.service";


export class AuthController {

  constructor(
    public readonly authService: AuthService,
  ) {

  }

  private handleError = (error: unknown, res: Response) => {
    if(error instanceof CustomError) {
      return res.status(error.statusCode).json({error: error.message});
    }

    console.log(`${error}`)
    return res.status(500).json({error: 'Internal server error'});
  }

  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDTO.create(req.body);
    
    if(error) return res.status(400).json({error});

    this.authService.registerUser(registerDto!)
      .then( response => res.json(response))
      .catch( error => this.handleError(error, res));

  }

  loginUser = (req: Request, res: Response) => {
    const [error, loginDto] = LoginUserDTO.auth(req.body);
    
    if(error) return res.status(400).json({error});

    this.authService.loginUser(loginDto!)
      .then( response => res.json(response))
      .catch( error => this.handleError(error, res));

  }

  validateEmail = (req: Request, res: Response) => {
    const {token} = req.params;
    
    this.authService.validateEmail(token)
      .then(() => res.json('Email validated'))
      .catch( error => this.handleError(error, res))

  }

}