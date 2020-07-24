const CracoLessPlugin = require('craco-less');
// craco配置 "https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#custom-location-for-cracoconfigjs"
const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    webpack: {
        alias: {
            "@": resolve("src"),
        },
        configure: (config, {env, paths}) => {
            // 使用@svgr/webpack加载自定义svg图标
            config.module.rules.push({
                // 直接使用antd icon的配置会报错,使用url-loader可以运行。
                // @see "https://react-svgr.com/docs/options/#file-extension"
                // @see "https://stackoverflow.com/a/59534878"
                // 使用需要这样写 import { ReactComponent as XxLogo } from "../assets/icon/xx.svg";
                // @see "https://stackoverflow.com/a/60074340"
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: '@svgr/webpack',
                    options: {
                        icon: true
                    }
                }, {
                    loader: 'url-loader'
                }
                ]
            })
            // 输出目录
            config.output.publicPath = process.env.NODE_ENV === "production" ? "" : "/"
            return config;
        }

    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    // 可以在这里更改antd主题
                    // @see "https://ant.design/docs/react/use-with-create-react-app-cn"
                    lessOptions: {
                        modifyVars: {'@primary-color': '#1890ff'},
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
