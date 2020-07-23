const CracoLessPlugin = require('craco-less');
// craco配置 "https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#custom-location-for-cracoconfigjs"
const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    webpack:{
        alias: {
            "@": resolve("src"),
        },
        configure:{
            module:{
                rules:[
                    {
                        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                        use: [
                            {
                                loader: 'babel-loader',
                            },
                            {
                                loader: '@svgr/webpack',
                                options: {
                                    babel: false,
                                    icon: true,
                                },
                            },
                        ],
                    }
                ]
            },
            output:{
                publicPath:process.env.NODE_ENV === "production" ? "" : "/"
            }
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
                        modifyVars: { '@primary-color': '#1890ff' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
