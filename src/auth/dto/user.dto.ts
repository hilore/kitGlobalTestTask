import { UserDocument } from '../schemas/user.schema';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

class UserTokenDto {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  accessToken: string;
  refreshToken: string;

  constructor(user: UserDocument, tokens: Tokens) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = new Date(user.createdAt).getTime();
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }
}

export { UserTokenDto };
