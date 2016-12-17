module.exports = {
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    devtool: 'source-map',
    devServer: {
        inline: true,
        hot: false
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    }
}
