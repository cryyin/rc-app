// 路由配置
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
