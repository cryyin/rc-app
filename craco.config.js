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
                    lessOptions: {
                        modifyVars: { '@primary-color': '#1DA57A' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
