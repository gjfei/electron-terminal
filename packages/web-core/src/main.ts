import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);
app.mount('#app');

setTimeout(() => {
  window.removeLoading();
}, 1000);
