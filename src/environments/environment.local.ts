// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://apidev.glmonitoreo.com',
  apiUrl: 'http://localhost:8000',
  idClient: '106',
  secretClient: 'au2vdKGrRK013Sy1rlgu5H7yb9k1LOzTx5wXz9Uu',
  socketUrl: 'https://escucha.glmonitoreo.com/',
  // socketUrl: 'http://localhost:3030',
  socketEvent: 'https://eventos.glmonitoreo.com/'
  // socketEvent: 'http://localhost:5000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
