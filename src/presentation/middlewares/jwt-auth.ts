import { type AuthStrategyContract, Box, type Context } from '@catniplabs/box';

@Box.Service()
export class TokenService {
  public resolveUserId(authorization: string | null): string | undefined {
    const token = authorization?.replace(/^Bearer\s+/i, '');
    // In production, verify JWT signature. This is a simplified example.
    return token === 'valid-jwt' ? 'user_1' : undefined;
  }
}

@Box.AuthStrategy({ name: 'jwt', deps: [TokenService] })
export class JwtAuthStrategy implements AuthStrategyContract {
  public constructor(private readonly tokens: TokenService) {}

  public validate(ctx: Context): boolean {
    const userId = this.tokens.resolveUserId(
      ctx.request.headers.get('authorization'),
    );

    if (!userId) return false;

    ctx.state.userId = userId;
    return true;
  }
}
