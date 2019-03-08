// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  standalone: true,
  version: require('../../package.json').version,
  app_name: require('../../package.json').name,
  sso_url: 'https://dev-503543.oktapreview.com/oauth2/default',
  sso_client_id: '0oagd6vz6u9mvfogi0h7',
  sso_redirect_uri: 'http://mu.local.nordnet.fr:4200/implicit/callback',
  mu_api: 'https://apim.kong.dev.nordnet.fr:8443/mu-server-api/api',
  mu_api_key: 'bcf03c30-ff74-4c0c-9095-6d71b830cf24',
  direct_scout_api: 'https://scout.nordnet.test/api',
  kong_url: 'https://apim.kong.dev.nordnet.fr:8443/adp-api/',
  adp_api: 'graphql'
};

/*
 * We require package.json in dev server only.
 * In other environments files we replace pattern pattern for version and app_name in CI pipeline.
*/
