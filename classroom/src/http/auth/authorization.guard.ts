import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { promisify } from 'node:util';
import { ConfigService } from '@nestjs/config';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;
  constructor(private configService: ConfigService) {
    //injecting the env variables, this acccess is provided in the http.module by the configmodule.root
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') ?? '';
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // getting req and res context for rest api
    // const httpContext = context.switchToHttp();
    // const req = httpContext.getRequest();
    // const res = httpContext.getResponse();

    // getting req and res for graphql context
    const { req, res } = GqlExecutionContext.create(context).getContext();

    const jwtCheck = promisify(
      jwt({
        secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }),
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      await jwtCheck(req, res);

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
