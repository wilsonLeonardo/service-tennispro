/* eslint-disable @typescript-eslint/camelcase */

const path = require('path');

module.exports = {
  apps: [
    {
      name: 'API',
      script: path.resolve(__dirname, 'deploy.sh'),
      instances: 1,
      autorestart: true,
      watch: [path.resolve(__dirname, 'dist')],
      ignore_watch: [path.resolve(__dirname, 'node_modules')],
    },
  ],
};
