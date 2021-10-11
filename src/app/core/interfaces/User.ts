export interface User {
  name: string;
  email: string;
}

export interface OAuthResource {
  //  stripe_publishable_key?: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}
