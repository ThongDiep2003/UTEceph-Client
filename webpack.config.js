// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "build"),
  },
  devServer: {
    historyApiFallback: true,
    open: true,
    host: "localhost",
    port: 8001,
  },
  watchOptions: {
    ignored: "**/node_modules",
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify("0.0.1"),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: "1+1",
      "typeof window": JSON.stringify("object"),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public/assets", to: "assets" }],
    }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer"),
      constants: require.resolve("constants-browserify"),
      assert: false,
      stream: require.resolve("stream-browserify"),
      fs: false,
      path: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.pem$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./src/certs/",
            },
          },
          {
            loader: "raw-loader",
          },
        ],
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  performance: {
    maxAssetSize: 1000000, // in bytes
    maxEntrypointSize: 1000000, // in bytes
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
