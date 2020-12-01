const WebpackPWAManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: "./public/assets/js/index.js",
    output: {
        path: path.resolve(__dirname, "public/dist"),
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }]
    },
    plugins: [
        new WebpackPWAManifest({
            publicPath: "/dist",
            filename: "manifest.webmanifest",
            inject: false,
            fingerprints: false,
            name: "Budget Tracket App",
            short_name: "Budget",
            description: "An application to keep track of your personal finances.",
            background_color: "#01579b",
            theme_color: "#ffffff",
            "theme_color": "#ffffff", // TODO
            start_url: "/",
            display: "standalone",
            icons: [{
                src: path.resolve("public/assets/images/icons/icon-512x512.png"), // TODO: why not path.join() ?
                sizes: [96, 128, 192, 256, 384, 512]
            }]
        })
    ]
};

module.exports = config;