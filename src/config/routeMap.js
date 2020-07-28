// 路由配置
// 项目整体开发完毕后可使用react-loadable动态加载页面，减少单文件体积
// import Table1 from "@/views/t1/Table1";
// import Lawsuit from "@/views/t1/Lawsuit";
// import Customer from "@/views/t1/Customer";
// import ArDetail from "@/views/t1/ArDetail";
// import Error404 from "@/views/error/404"
// import Report from "@/views/charts/index"
// import CustomerCode from "@/views/t1/CustomerCode";
import Loadable from 'react-loadable';
import Loading from '@/components/Loading'

const Table1 = Loadable({loader: () => import(/*webpackChunkName:'Table1'*/'@/views/t1/Table1'),loading: Loading});
const Lawsuit = Loadable({loader: () => import(/*webpackChunkName:'Lawsuit'*/'@/views/t1/Lawsuit'),loading: Loading});
const Customer = Loadable({loader: () => import(/*webpackChunkName:'Customer'*/'@/views/t1/Customer'),loading: Loading});
const ArDetail = Loadable({loader: () => import(/*webpackChunkName:'ArDetail'*/'@/views/t1/ArDetail'),loading: Loading});
const Error404 = Loadable({loader: () => import(/*webpackChunkName:'Error404'*/'@/views/error/404/index'),loading: Loading});
const Report = Loadable({loader: () => import(/*webpackChunkName:'Report'*/'@/views/charts/index'),loading: Loading});
const CustomerCode = Loadable({loader: () => import(/*webpackChunkName:'CustomerCode'*/'@/views/t1/CustomerCode'),loading: Loading});

export default [
  { path: "/table1", component: Table1},
  { path: "/lawsuit", component: Lawsuit},
  { path: "/customer", component: Customer},
  { path: "/customer_code", component: CustomerCode},
  { path: "/ar_detail", component: ArDetail},
  { path: "/report", component: Report},
  { path: "/error/404", component: Error404 }
];
