import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import TableView from "../components/TableView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "TableView",
    component: TableView,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;