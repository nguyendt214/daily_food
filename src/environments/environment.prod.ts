export const environment = {
  production: false,
  standalone: true,
  version: require('../../package.json').version,
  app_name: require('../../package.json').name,
  sso_url: 'https://dev-503543.oktapreview.com/oauth2/default',
  sso_client_id: '0oagd6vz6u9mvfogi0h7',
  sso_redirect_uri: 'http://mu.local.nordnet.fr:4200/implicit/callback',
  mu_api: 'https://apim-kong-staging.dev.nordnet.fr:8443/mu-server-api/api',
  mu_api_key: '1989dccd-b1f1-4cee-aea2-a1eb1a50a36d'
};
