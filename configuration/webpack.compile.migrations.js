/* eslint-disable @typescript-eslint/camelcase */
const glob = require('glob');
const path = require('path');
const NodeExternals = require('webpack-node-externals');

const babelOptions = require('../.babelrc.js');

module.exports = {
  name: 'server',
  target: 'node',
  mode: 'development',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [NodeExternals()],
  entry: glob
    .sync(path.resolve('src', 'database', 'migrations', '*.ts'))
    .reduce((entries, filename) => {
      const migrationName = path.basename(filename, '.ts');
      return { ...entries, [migrationName]: filename };
    }, {}),
  output: {
    path: path.resolve('tmp'),
    libraryTarget: 'commonjs2',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              ...babelOptions,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: false,
              configFile: path.resolve('tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      '~': path.resolve('src'),
    },
    extensions: ['.js', '.json', '.ts'],
  },
};
