const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
    mode: 'production', // production-development
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build/static/js/'),
        clean: true,
        publicPath: '/static/js/',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        fallback: {
            process: require.resolve('process/browser'), // Thêm polyfill cho process
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, 
                    },
                },
            }),
            new JavaScriptObfuscator({
                rotateStringArray: true,
                stringArray: true,
                stringArrayThreshold: 0.75,
                output: path.resolve(__dirname, 'build/static/js/obfuscated/bundle.js'),
            }, ['bundle.js']),
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.REACT_APP_SERVER_URL': JSON.stringify(process.env.REACT_APP_SERVER_URL),
            'process.env.REACT_APP_CLIENT_URL': JSON.stringify(process.env.REACT_APP_CLIENT_URL),
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'build/static'), // Chỉ phục vụ từ thư mục này
        compress: true,
        port: 3000, // Cổng phục vụ
        historyApiFallback: true, // Hỗ trợ cho các routes sử dụng History API
        overlay: true, // Hiển thị thông báo lỗi
        publicPath: '/static/js/', // Đường dẫn công khai
        before: (app) => {
            app.get('/src/*', (req, res) => res.status(404).send('Not found'));
        },
    },
};
