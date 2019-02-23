const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production';

    return {
        context: path.resolve(__dirname, 'src'),
        entry: './js/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            libraryTarget: 'umd',
        },

        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                attrs: ['img:src'],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../',
                            },
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                  require('autoprefixer')({}),
                                  require('postcss-nested')({}),
                                  require('cssnano')({ preset: 'default' })
                                ],
                            }
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1024,
                                name: '[path][name]-[hash:7].[ext]',
                            },
                        },
                    ],
                },
            ],
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html',
                minify: devMode ? false : {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                },
            }),
            new MiniCssExtractPlugin({
                filename: 'css/main-[contenthash].css',
            }),
        ],

        devServer: {
            port: 9000,
        },
    };
};