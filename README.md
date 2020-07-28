# 简介

风控项目。

技术栈如下：
+ [React](https://react.docschina.org/)
+ [Antd](https://ant.design/docs/react/introduce-cn)

原本打算使用vue+element ui，原因是portal使用了vue。但是element ui表格固定列功能无法满足要求，且该项目貌似已停止维护。
因此转向react+antd。

# 目录结构
```bash
├─ public                      # 静态资源
│   ├─ favicon.ico             # favicon图标
│   └─ index.html              # html模板
└── src                        # 项目源码
│   ├── api                    # 所有请求
│   ├── assert                 # 图标、字体等静态资源
│   ├── components             # 全局公用组件
│   ├── config                 # 全局配置
│       └── routeMap.js        # 路由配置
│   ├── core                   # 项目启动代码
│   ├── env                    # 运行环境相关
│       └── polyfill.js        # 适应Portal-Web项目的的代码
│   ├── store                  # 全局 store管理
│   ├── style                  # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├──App.js                  # 入口页面
│   └──index.js                # 源码入口
├── .env.development           # 开发环境变量配置
├── .env.production            # 生产环境变量配置
├── craco.config.js            # 对cra的webpack自定义配置
└── package.json               # package.json

```
# 安装

```shell script
# 克隆项目
git clone https://github.com/mylinlan/rc-app.git

# 进入项目目录
cd rc-app

# 安装依赖
npm install 或者 yarn install

# 切换淘宝源，解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm start
```

项目暂时没添加mock数据功能，因此需要先启动后端相关服务,即Portal应用和ng代理。

本机没有Portal应用的同学，可以修改一下接口配置,见[接口配置](#接口配置) 一节

启动完成后会自动打开浏览器访问 [http://localhost:3000](http://localhost:3000)， 将会看到以下页面：
![](./guide.gif)

# 部署
```shell script
# 打包构建
npm run build
```
然后将build目录下的文件覆盖Portal-Web目录下的modules/rc即可

# 开发

## 接口配置

如果本机没有Portal应用提供后端接口，可以替换```.env.development```文件配置如下：
```shell script
REACT_APP_BASE_API = 'http://172.30.25.8:8093/utrust'
```

注意，该接口目前使用的生产环境接口

## 路由配置
目前项目仍是一个单页面应用(SPA)，对于不同的页面使用[React-Router](https://reactrouter.com/web/guides/quick-start)
进行导航。具体的配置文件位于```src/config/routeMap.js```, 每新增一个页面均需要在这里配置路由。

为减少单文件体积，后续考虑使用[react-loadable](https://www.npmjs.com/package/react-loadable) 这样的
包动态加载页面组件。

## Rc通用表格配置

仅仅提供自定义的参数即可，部分固定参数如IN_MONTH、DATA_SOURCE会自动合并

### 公共参数：
以下参数为目前默认的公共参数，自定义时需要省略掉
```javascript
// 当前查询年月
export const lastYearMonth = [
    {name: 'IN_MONTH', type: 'VARCHAR2', value: "计算得到的上一个年月"}
]
// 存储过程通用参数
export const commonParams = [
    {name: 'IN_USER_GROUP', type: 'VARCHAR2', value: ""},
    {name: 'IN_DATA_SOURCE', type: 'VARCHAR2', value: DATA_SOURCE}
]
// 分页参数, 筛选框查询查询不需提供
export const pageParams = [
    {name: 'IN_ROWNB_BEGIN', type: 'NUMBER', value: 0},
    {name: 'IN_ROWNB_END', type: 'NUMBER', value: 10}
]
// 存储过程输出参数名称
export const outParamName = 'OUT_DATASET'
```
### 自定义参数：
目前，如果不提供筛选框的相关参数，则会使用默认的筛选框存储过程配置

- name: 存储过程对应的参数名
- type: 存储过程对应的参数类型

- filter: filter对应存在，即表明该项作为筛选框条件，用户可在前端页面配置。以下参数一般与对应的Antd组件参数关联：
  + id： 筛选框标识, 应该唯一。值大小代表顺序
  + code: code可根据id生成，如id为1的下拉框code为D001,作为IN_DIM_TYPE_CODE参数值传入存储过程
  + label: 筛选框控件label
  + type: 筛选框类型，与antd组件对应，目前支持的type有
    * select(默认)
    * autoComplete
    * input
  + defaultValue： 筛选框控件默认值
  + deps： 表示当前筛选框依赖其他筛选框的值,暂时只考虑支持一个依赖
  + 是针对select下拉框的配置
    * skipInit: 是否跳过初始化，针对具有依赖关系，且数据量较大的下拉框。如果传入父值数据量仍旧很大，应该设置dynamic
    * dynamic: 如果值存在，即代表下拉框需动态生产，dynamic的值代表搜索值对应的存储过程参数
    * searchable：是否可输入
  + 针对autoComplete的配置
    * dynamic: 如果值存在，即代表autoComplete候选项需动态生产，dynamic的值代表搜索值对应的存储过程参数
 
为获取存储过程自定义参数，一般可以打开plsql查看具体的存储过程，复制到notepad++后直接进行列操作可得到该配置信息
 
## 使用svg图标
项目使用[@svgr/webpack](https://github.com/gregberge/svgr/tree/master/packages/webpack) 处理svg图标

图标来源可以让UI提供，或者从[阿里巴巴矢量图标库](https://www.iconfont.cn/) 搜索并下载，找不到满意不妨自己画一个。
将图标放入项目目录，即可像使用React组件一样使用图标。

有一点需要注意的是:
```
   // 目前引入自定义图标需要这样写，可能是craco的问题,LawsuitIcon是我们的图标组件
   import {ReactComponent as LawsuitIcon} from '@/assert/icon/lawsuit.svg'
```

## webpack配置

项目使用使用craco更改create-react-app(简称cra)的webpack预配置

配置项参考[这里](https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-overview)
例如，更改output的publicPath, 如下：
```
module.exports = {
    webpack:{
        configure: (config, {env, paths}) => {
            // 输出目录
            config.output.publicPath = process.env.NODE_ENV === "production" ? "" : "/"
            return config;
        }
    },
    ...
}
```

# 参考
如果能够了解以下内容，会对该项目有更好的理解

+ [es6系列](https://github.com/mqyqingfeng/Blog#es6-系列目录)
+ [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
+ [渲染器](http://hcysun.me/vue-design/zh/essence-of-comp.html)
+ [React Fiber架构](https://zhuanlan.zhihu.com/p/37095662)
+ [react-antd-admin-template](https://github.com/NLRX-WJC/react-antd-admin-template)
