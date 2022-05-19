import { createApp } from 'vue';
import 'element-plus/theme-chalk/src/index.scss';
import ElementPlus from 'element-plus';
import App from './App.vue';
const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');

setTimeout(() => {
  window.removeLoading();
}, 1000);
