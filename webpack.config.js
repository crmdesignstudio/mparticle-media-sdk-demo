const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = (env, argv) => ({
    mode: argv.mode === 'production' ? 'production' : 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: argv.mode === 'production'
        }),
        argv.mode === 'production' 
            ? new webpack.EnvironmentPlugin(['MPARTICLE_WEB_API_KEY'])
            : new Dotenv({
                path: './.env',
                safe: true,
                systemvars: true,
                defaults: false
            })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 8081,
        hot: true,
        open: true
    },
    optimization: {
        minimize: argv.mode === 'production'
    }
}); 