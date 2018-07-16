const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeJsPlugin = require("optimize-js-plugin");
const path = require("path");
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
  devtool: "source-map",
  entry: ["react-hot-loader/patch", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.bundle.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      Src: path.resolve(__dirname, "src/")
    },
    modules: ["node_modules", "src"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|dist)/,
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
            ],
            plugins: ["transform-decorators-legacy"],
            compact: true
          }
        }
      },
      {
        test: /\.(png|jpe?g|svg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=50000&name=./public/img/[name].[ext]"
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
      },
      {
        test: /\.js$/,
        exclude: /dist/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  },
  plugins: plugins,
  devServer: {
    historyApiFallback: {
      index: "/"
    }
  },
  externals: {

    Config: JSON.stringify(
      process.env.NODE_ENV === "production"
        ? {
            serverUrl: "http://10.255.20.241"
          }
        : {
            serverUrl: "http://10.255.20.241"
          }
    )

  }
};
