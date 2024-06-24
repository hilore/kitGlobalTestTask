import { TokenDocument } from '../schemas/token.schema';

class TokenDto {
  id: string;
  userId: string;
  refreshToken: string;

  constructor(token: TokenDocument) {
    this.id = token.id;
    this.userId = token.user;
    this.refreshToken = token.refreshToken;
  }
}

export default TokenDto;
