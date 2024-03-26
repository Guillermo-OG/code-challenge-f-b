import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import HomeView from "../views/HomeView.vue"
import MetricsView from "../views/MetricsView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  // {
  //   path: "/upload",
  //   name: "Upload",
  //   component: FileUpload,
  // },
  {
    path: "/metrics",
    name: "Metrics",
    component: MetricsView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
