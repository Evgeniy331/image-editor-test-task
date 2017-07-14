var path = require("path")
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./js/index.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/dist"
    },
    plugins: [
        new ExtractTextPlugin({filename: "main.css"})
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["es2015"]
                },
                include: __dirname
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    }
}