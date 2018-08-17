// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  standalone: true,
  sso_url: 'https://sso.dev.nordnet.fr/auth',
  sso_realm: 'nordnet-mu',
  ws_log_url: 'http://appnodejs1-c1.dev.nordnet.fr:34110',
};
