import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "@/router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia)
   .use(VueQueryPlugin)
   .use(router)
   .component("vue-draggable-resizable", VueDraggableResizable)
   .mount("#app");
