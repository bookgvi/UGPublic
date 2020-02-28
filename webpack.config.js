const path = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  glob = require("glob"),
  webpack = require('webpack'),
  StyleLintPlugin = require('stylelint-webpack-plugin'),
  pugIncludeGlob = require('pug-include-glob');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const SpritePlugin = require('svg-sprite-loader/plugin');

module.exports = function (env) {

  const pluginsOptions = [
    new SpritePlugin(),
    new StyleLintPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: 'assets/styles/style.css',
      disable: env.production === 'true' ? false : true
    }),
    new CopyWebpackPlugin([
      {
        from: './static',
        to: './',
        ignore: ['*.md']
      }
    ]),
    // new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.NoEmitOnErrorsPlugin()
  ];
  if (env.production === 'true') {
    pluginsOptions.push(new UglifyJsPlugin({
      extractComments:true
    }));
  }

  let pages = glob.sync(__dirname + '/source/pages/*.pug');
  pages.forEach(function (file) {
    let base = path.basename(file, '.pug');
    pluginsOptions.push(
      new HtmlWebpackPlugin({
        filename: './' + base + '.html',
        template: './pages/' + base + '.pug',
        inject: true,
        minify: false,
      })
    )
  });
  if (env.production == 'false') {
    pluginsOptions.push(new webpack.DefinePlugin({
      IS_DEV: true,
    }));
  } else {
    pluginsOptions.push(new webpack.DefinePlugin({
      IS_DEV: false,
    }));
  }
  const config = {
    entry: "./autoload.js",
    context: __dirname + '/source/',
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: 'assets/scripts/[name]' + '.bundle' + '.js',
      chunkFilename: "[id].js",
      publicPath: "./"
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "eslint-loader",
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [/node_modules/,/source\/assets/],
          query: {
            presets: ['env']
          }
        }, {
          test: /\.(sass|scss|css)$/,
          use: ExtractTextPlugin.extract({
            fallback: [
              {
                loader: 'style-loader'
              }
            ],
            use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            }, {
              loader: 'group-css-media-queries-loader'
            }, {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('autoprefixer')({browsers: "last 5 versions"})
                  ];
                }
              }
            }, {
              loader: 'sass-loader'
            }, {
              loader: 'import-glob-loader'
            }],
            publicPath: './../../'
          })
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader',
          options: {
            plugins:[pugIncludeGlob()],
            pretty: true
          }
        }, {
          test: /\.(woff|woff2|ttf|otf|eot?)(\?.+)?$/,
          loader: 'url-loader',
          options: {
            name: 'assets/fonts/[name].[ext]',
            limit: 10000
          }
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          options: {
            extract: true,
            spriteFilename: 'assets/sprite.svg'
          }
        },
        {
          test: /\.(png|jpg?)(\?.+)?$/,
          loader: 'url-loader',
          options: {
            name: 'assets/images/[name].[ext]',
            limit: 10000
          }
        },
        {
          test: /\.(webm|mp4)$/,
          loader: 'file-loader',
          options: {
            name: 'assets/videos/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, "source/assets/js")
          ],
          loader: 'file-loader',
          options: {
            name: 'assets/scripts/[name].[ext]',
          },
        },
        {
          test: /\.js$/,
          exclude: [/node_modules\/(?!(dom7|ssr-window|gsap|swiper)\/).*/, /source\/assets/],
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      extensions: [".js", ".json", ".sass"],
      alias: {
        app: './source',
        static: './source/static',
        assets: './source/assets',
        vue$: 'vue/dist/vue.esm.js'
      },
    },
    devtool: "source-map",
    target: "web",
    plugins: pluginsOptions,

    watch: (env.production === 'true') ? false : true,

    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    devServer: {
      contentBase: path.resolve(__dirname, './source/pages/'),
      watchContentBase: true,
      port: 9001,
      open: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      noInfo: true,
      compress: true,
      hot: (env.production === 'true') ? false : true,
      stats: 'minimal',
      publicPath: "/",
      before(app) {
        app.post('*', (req, res) => {
          res.send(req.originalUrl);
        });
        app.delete('*', (req, res) => {
          res.send(req.originalUrl);
        });
      },
    }
  }
  if (env.production === 'true') {
    config.performance = {
      maxEntrypointSize: 1000000,
      maxAssetSize: 300000,
      hints: 'warning'
    };
  }
  return config;
}
