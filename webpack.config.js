const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeJsPlugin = require("optimize-js-plugin");

const env = process.env.NODE_ENV || "development";

const plugins = [
  new HtmlWebpackPlugin({
    template: "./public/index.ejs",
    filename: "index.html",
    inject: "body"
  })
];

if (env === "production") {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeJsPlugin({
      sourceMap: false
    })
  );
}

module.exports = {
  entry: ["react-hot-loader/patch", "./src/index.js"],
  output: {
    path: __dirname + "/dist",
    filename: "app.bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              require.resolve("babel-preset-react"),
              [
                require.resolve("babel-preset-env"),
                {
                  modules: false
                }
              ],
              require.resolve("babel-preset-stage-0")
            ]
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000"
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader?sourceMap"]
      },
      {
        test: /(\.css$)/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  plugins: plugins,
  devServer: {
    historyApiFallback: true
  }
};
