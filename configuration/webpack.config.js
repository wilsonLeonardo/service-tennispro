/* eslint-disable global-require, @typescript-eslint/camelcase */
const eslintFormatter = require('react-dev-utils/eslintFormatter');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const FriendlyErrorsPlugin = require('razzle-dev-utils/FriendlyErrorsPlugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const NodeExternals = require('webpack-node-externals');

const babelOptions = require('../.babelrc.js');

const isProd = process.env.NODE_ENV === 'production';

const nodeArgs = ['-r', 'source-map-support/register'];

if (process.env.INSPECT_BRK) {
  nodeArgs.push(process.env.INSPECT_BRK);
} else if (process.env.INSPECT) {
  nodeArgs.push(process.env.INSPECT);
}

module.exports = {
  watch: !isProd,
  bail: isProd,
  name: 'server',
  devtool: 'source-map',
  mode: isProd ? 'production' : 'development',
  performance: false,
  stats: isProd ? undefined : 'none',
  watchOptions: {
    ignored: [/node_modules/, /dist/],
  },
  target: 'node',
  node: {
    __console: false,
    __dirname: false,
    __filename: false,
  },
  externals: [
    NodeExternals({
      whitelist: [...(isProd ? [] : ['webpack/hot/poll?300'])],
    }),
  ],
  entry: [
    ...(isProd
      ? []
      : ['razzle-dev-utils/prettyNodeErrors', 'webpack/hot/poll?300']),
    'reflect-metadata',
    path.resolve('src', 'index.ts'),
  ],
  output: {
    path: path.resolve('dist'),
    publicPath: '/static/',
    libraryTarget: 'commonjs2',
    filename: 'index.js',
    pathinfo: true,
    // futureEmitAssets: true,
    devtoolModuleFilenameTemplate: isProd
      ? info =>
          path
            .resolve(path.resolve('src'), info.absoluteResourcePath)
            .replace(/\\/g, '/')
      : info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: {
    removeAvailableModules: isProd,
    removeEmptyChunks: isProd,
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        cache: true,
        parallel: true,
        extractComments: false,
        terserOptions: {
          output: {
            ecma: 8,
            comments: false,
          },
          parse: {
            ecma: 8,
          },
          compress: {
            comparisons: true,
            inline: 2,
          },
        },
      }),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'eslint-loader',
          options: {
            cache: true,
            formatter: eslintFormatter,
          },
        },
        enforce: 'pre',
      },
      {
        oneOf: [
          {
            test: /\.hbs$/,
            use: [
              { loader: 'handlebars-loader' },
              {
                loader: 'html-minifier-loader',
                options: {
                  collapseInlineTagWhitespace: true,
                  collapseWhitespace: true,
                  removeComments: true,
                  customAttrSurround: [[/\{\{#[^}]+\}\}/, /\{\{\/[^}]+\}\}/]],
                },
              },
            ],
          },
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  babelrc: false,
                  configFile: false,
                  cacheDirectory: true,
                  cacheCompression: !isProd,
                  compact: !isProd,
                  ...babelOptions,
                },
              },
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                  experimentalWatchApi: !isProd,
                  configFile: path.resolve('tsconfig.json'),
                },
              },
            ],
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '~': path.resolve('src'),
      lodash: 'lodash-es',
      'webpack/hot/poll': require.resolve('webpack/hot/poll'),
    },
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      TARGET: 'server',
      BASE_DIR: path.resolve('.'),
      DEPLOYMENT: process.env.DEPLOYMENT || 'development',
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    ...(isProd
      ? [new CleanWebpackPlugin()]
      : [
          new FriendlyErrorsPlugin({
            target: 'SERVER',
          }),
          new StartServerPlugin({
            name: 'index.js',
            keyboard: !isProd,
            nodeArgs,
          }),
          new webpack.HotModuleReplacementPlugin({ quiet: true }),
        ]),
  ],
};
