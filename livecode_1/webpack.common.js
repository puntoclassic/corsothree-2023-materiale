const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    entry: './src/app.ts',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, './src/assets/'), to: path.resolve(__dirname, './dist/assets') },
            ],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
            minify: true
        }),
    ],
}