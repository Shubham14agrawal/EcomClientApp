import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {

  issuer: 'https://localhost:5443',
  redirectUri: 'https://localhost:4200/signin-oidc',
  postLogoutRedirectUri: 'http://localhost:4200/',
  clientId: 'interactive',
  scope: 'CoffeeAPI.read openid profile',
  responseType: 'code',
 useSilentRefresh: true,
  //useRefreshToken: true,
  //logLevel: LogLevel.Debug,
};
