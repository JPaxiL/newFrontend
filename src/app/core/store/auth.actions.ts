import { User } from "../interfaces/User";

export class SignIn {
    static readonly type = '[Auth] Sign In';
  
    constructor(public name: string, public password: string) {}
  }
  
export class UpdateUser {
static readonly type = '[Auth] Update User';

constructor(public user: User) {}
}