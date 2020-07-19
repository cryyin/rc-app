风控项目

## 命令

项目启动：

### `yarn start`

然后在浏览器打开 [http://localhost:3000](http://localhost:3000) 即可.

单元测试运行以下命令：

### `yarn test`

生产构建：

### `yarn build`



打包及部署信息：

### `yarn eject`

## 开发

### 使用craco

使用craco更改create-react-app(简称cra)的webpack预配置

配置项参考[这里](https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-overview)
例如，更改output的publicPath, 如下：
```
module.exports = {
    webpack:{
        configure:{
            output:{
                publicPath:process.env.NODE_ENV === "production" ? "" : "/"
            }
        }
    },
    ...
}
```

### 使用commitizen

git格式化提交, 详见[官网](https://github.com/commitizen/cz-cli)

参考官网文档将git仓库变为 Commitizen-friendly 后
使用 ```git cz```代替```git commit```, 比如```git cz -a```。

## 构建
