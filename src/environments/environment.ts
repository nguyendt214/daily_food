// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  standalone: true,
  version: require('../../package.json').version,
  app_name: require('../../package.json').name,
  mu_api: 'http://www.ccmart.info/wp-json/kevinblack/v1/'
};

/*
 * We require package.json in dev server only.
 * In other environments files we replace pattern pattern for version and app_name in CI pipeline.
*/
