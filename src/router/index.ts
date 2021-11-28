import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Contract from "../views/Contract.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Contract",
    component: Contract,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
