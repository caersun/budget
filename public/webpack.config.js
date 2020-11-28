const WebpackPWAManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: {
        index: "./assets/js/index.js"
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
    mode: "development",
    module: {
        rules: {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }
    },
    plugins: [
        new WebpackPWAManifest({
            publicPath: "/dist",
            fingerprints: false,
            name: "Budget Tracket App",
            short_name: "Budget",
            description: "An application to keep track of your personal finances.",
            background_color: "#01579b",
            theme_color: "#ffffff",
            "theme_color": "#ffffff",
            start_url: "/",
            icons: [{
                src: path.resolve("assets/images/icons/icon-512x512.png"),
                sizes: [96, 128, 192, 256, 384, 512],
                destination: path.join("assets", "icons")
            }]
        })
    ]
};

module.exports = config;