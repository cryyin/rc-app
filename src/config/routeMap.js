// 路由配置
import Table1 from "@/views/t1/Table1";
import Lawsuit from "@/views/t1/Lawsuit";
import Customer from "@/views/t1/Customer";
import Error404 from "@/views/error/404"

export default [
  { path: "/table1", component: Table1},
  { path: "/lawsuit", component: Lawsuit},
  { path: "/customer", component: Customer},
  { path: "/error/404", component: Error404 }
];
