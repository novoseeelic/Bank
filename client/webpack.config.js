const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = (env) => ({
  entry: './src/js/main.js',
  output: {
    filename: 'main.[contenthash].js',
    clean: true,
  },
  externalsType: 'script',
  externals: {
    ymaps: [
      'https://api-maps.yandex.ru/2.1/?apikey=4cb20f90-fa06-40c3-b5c5-958a9021a8bc&lang=ru_RU',
      'ymaps'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.scss$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main.[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [['optipng', { optimizationlevel: 5 }]],
          },
        },
      }),
    ],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
});
