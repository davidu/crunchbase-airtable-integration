var path = require('path');

module.exports = {
    devtool: 'source-map',
    context: path.join(__dirname, '/src'),
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'src'),
        filename: 'bundle.min.js',
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "src"),
        compress: true,
        hot: true,
        port: 9000,
        proxy: {
            '/': 'http://localhost:3345',
            changeOrigin: true,
            context: () => true
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "file-loader?name=src/img/[name].[ext]"
            },
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};