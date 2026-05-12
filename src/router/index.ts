import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import AppView from "@/views/AppView.vue";
import FocusView from "@/views/FocusView.vue";

const routes = [
   { path: "/", component: HomeView },
   {
      path: "/app",
      component: AppView,
      children: [
         {
            path: "",
            name: "app-focus",
            component: FocusView,
         },
      ],
   },
];

export const router = createRouter({
   history: createWebHistory(),
   routes,
});
