'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const getClientEnvironment = require('./env');
const paths = require('./paths');



// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'cheap-module-source-map',
  externals: {
    civic: 'civic'
  },
  // Providing the mode configuration option tells webpack to use its built-in optimizations accordingly.
  mode: 'development',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // We ship a few polyfills by default:
    require.resolve('./polyfills'),
    // Finally, this is your app's code:
    paths.appIndexJs
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {

      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
    // plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      // new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    // ],
  },

  module: {
    strictExportPresence: true,
    rules: [
      // TODO: Disable require.ensure as it's not a standard language feature.
      // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
      // { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),

            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {

              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              plugins: ['react-hot-loader/babel']
            },
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use a plugin to extract that CSS to a file, but
          // in development "style" loader enables hot editing of CSS.
          {
            test: /\.(css)|(scss)$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  sourceMap: true,
                  modules: false, // "obfuscation" https://github.com/css-modules/css-modules
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
              require.resolve('sass-loader')
            ],
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
    // loaders: [
    //   // Default loader: load all assets that are not handled
    //   // by other loaders with the url loader.
    //   // Note: This list needs to be updated with every change of extensions
    //   // the other loaders match.
    //   // E.g., when adding a loader for a new supported file extension,
    //   // we need to add the supported extension to this loader too.
    //   // Add one new line in `exclude` for each loader.
    //   //
    //   // "file" loader makes sure those assets get served by WebpackDevServer.
    //   // When you `import` an asset, you get its (virtual) filename.
    //   // In production, they would get copied to the `build` folder.
    //   // "url" loader works like "file" loader except that it embeds assets
    //   // smaller than specified limit in bytes as data URLs to avoid requests.
    //   // A missing `test` is equivalent to a match.
    //   {
    //     exclude: [
    //       /\.html$/,
    //       /\.(js|jsx)$/,
    //       /\.css$/,
    //       /\.json$/,
    //       /\.woff$/,
    //       /\.woff2$/,
    //       /\.(ttf|svg|eot)$/
    //     ],
    //     loader: 'url',
    //     query: {
    //       limit: 10000,
    //       name: 'static/media/[name].[hash:8].[ext]'
    //     }
    //   },
    //   // Process JS with Babel.
    //   {
    //     test: /\.(js|jsx)$/,
    //     include: paths.appSrc,
    //     loader: 'babel',
    //     query: {
    //
    //       // This is a feature of `babel-loader` for webpack (not Babel itself).
    //       // It enables caching results in ./node_modules/.cache/babel-loader/
    //       // directory for faster rebuilds.
    //       cacheDirectory: true
    //     }
    //   },
    //   // "postcss" loader applies autoprefixer to our CSS.
    //   // "css" loader resolves paths in CSS and adds assets as dependencies.
    //   // "style" loader turns CSS into JS modules that inject <style> tags.
    //   // In production, we use a plugin to extract that CSS to a file, but
    //   // in development "style" loader enables hot editing of CSS.
    //   {
    //     test: /\.css$/,
    //     loader: 'style!css?importLoaders=1!postcss'
    //   },
    //   // JSON is not enabled by default in Webpack but both Node and Browserify
    //   // allow it implicitly so we also enable it.
    //   {
    //     test: /\.json$/,
    //     loader: 'json'
    //   },
    //   // "file" loader for svg
    //   {
    //     test: /\.svg$/,
    //     loader: 'file',
    //     query: {
    //       name: 'static/media/[name].[hash:8].[ext]'
    //     }
    //   },
    //   // "file" loader for fonts
    //   {
    //     test: /\.woff$/,
    //     loader: 'file',
    //     query: {
    //       name: 'fonts/[name].[hash].[ext]'
    //     }
    //   },
    //   {
    //     test: /\.woff2$/,
    //     loader: 'file',
    //     query: {
    //       name: 'fonts/[name].[hash].[ext]'
    //     }
    //   },
    //   {
    //     test: /\.(ttf|eot)$/,
    //     loader: 'file',
    //     query: {
    //       name: 'fonts/[name].[hash].[ext]'
    //     }
    //   },
    //   // Truffle solidity loader to watch for changes in Solitiy files and hot
    //   // reload contracts with webpack.
    //   //
    //   // CURRENTLY REMOVED DUE TO INCOMPATIBILITY WITH TRUFFLE 3
    //   // Compile and migrate contracts manually.
    //   //
    //   /*{
    //     test: /\.sol$/,
    //     loader: 'truffle-solidity?network_id=123'
    //   }*/
    // ]
  },

  // We use PostCSS for autoprefixing only.
  // postcss: function() {
  //   return [
  //     autoprefixer({
  //       browsers: [
  //         '>1%',
  //         'last 4 versions',
  //         'Firefox ESR',
  //         'not ie < 9', // React doesn't support IE8 anyway
  //       ]
  //     }),
  //   ];
  // },
  plugins: [
    new MiniCssExtractPlugin(),

    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),

    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),

    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
