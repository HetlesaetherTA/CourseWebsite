const currentTask = process.env.npm_lifecycle_event
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HTMLWebPackpPlugin = require("html-webpack-plugin")
const fse = require("fs-extra")

const path = require("path");
const postCSSPlugins = [
    require("postcss-mixins"),
    require("postcss-import"),
    require("postcss-simple-vars"),
    require("postcss-nested"),
    require("autoprefixer")
]

class RunAfterCompile {
    apply(compiler) {
        compiler.hooks.done.tap("Copy img", function() {
            fse.copySync("./app/assets/images", "./docs/assets/images")
        })
    }
}

let cssConfig = {
    test: /\.css$/i,
    use: ['css-loader?url=false', {loader: "postcss-loader", options: {postcssOptions: {plugins: postCSSPlugins}}}]
}

let pages = fse.readdirSync("./app").filter(function(file) {
    return file.endsWith(".html")
}).map(function(page) {
    return new HTMLWebPackpPlugin({
        filename: page,
        template: `./app/${page}`
    })
})

let config = {
    entry: "./app/assets/scripts/App.js",
    plugins: pages,
    module: {
        rules: [
            cssConfig
        ]
    }
}

if (currentTask == "dev") {
    config.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"]
            }
        }
    })
    cssConfig.use.unshift("style-loader")
    config.output = {
        filename: "bundled.js",
        path: path.resolve(__dirname, "app")
    }
    config.devServer = {
        before: function(app, server) {
            server._watch("./app/**/*.html")
        },
        contentBase: path.join(__dirname, "app"),
        hot: true,
        port: 3000
    }
    config.mode = "development"
}

if (currentTask == "build") {
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    config.output = {
            filename: "[name].[chunkhash].js",
            chunkFilename: "[name].[chunkhash].js",
            path: path.resolve(__dirname, "docs")
    }
    config.mode = "production"
    config.optimization = {
        splitChunks: {chunks: 'all', minSize: 1000},
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()]
    }
    config.plugins.push(
        new CleanWebpackPlugin(), 
        new MiniCssExtractPlugin({filename: "styles.[chunkhash].css"}),
        new RunAfterCompile()
        )
}

module.exports = config;