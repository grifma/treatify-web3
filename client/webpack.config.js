const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    // path: path.resolve(__dirname, "/dist"),
    // path: path.resolve(__dirname, "/"),
    publicPath: "/dist",
    // publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3030,
    publicPath: "http://localhost:3030/dist/",
    hotOnly: true,
    historyApiFallback: true,
  },
  // devtool: "inline-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.SourceMapDevToolPlugin({}),
  ],
};
