/* eslint-disable no-console */
import http from 'http';

import App from './app';

let currentApp = App;

const server = http.createServer(App);

const port = process.env.PORT || 3001;

server
  .listen(port, () => {
    console.log(`Server started on port ${process.env.HOST}:${port}`);
  })
  .on('error', error => {
    console.log(error);
  });

if (module.hot) {
  console.log('Server-side HMR Enabled!');

  module.hot.accept('./app.ts', () => {
    try {
      // eslint-disable-next-line global-require
      const newApp = require('./app').default;
      server.removeListener('request', currentApp);
      server.on('request', newApp);
      currentApp = newApp;
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  });
}
