import { UserWithAuthProviders } from '../../users/types';

export interface AuthRequest extends Request {
  user: UserWithAuthProviders;
}
