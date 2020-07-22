import Loadable from 'react-loadable';
import Loading from '@/components/Loading'

// 组件配置
const Table1 = Loadable({loader: () => import(/*webpackChunkName:'Table1'*/'@/views/t1/Table1'),loading: Loading});
const Lawsuit = Loadable({loader: () => import(/*webpackChunkName:'Lawsuit'*/'@/views/t1/Lawsuit'),loading: Loading});
const Customer = Loadable({loader: () => import(/*webpackChunkName:'Customer'*/'@/views/t1/Customer'),loading: Loading});
const Error404 = Loadable({loader: () => import(/*webpackChunkName:'Error404'*/'@/views/error/404'),loading: Loading});

// 路由配置
export default [
  { path: "/table1", component: Table1},
  { path: "/lawsuit", component: Lawsuit},
  { path: "/customer", component: Customer},
  { path: "/error/404", component: Error404 }
];
