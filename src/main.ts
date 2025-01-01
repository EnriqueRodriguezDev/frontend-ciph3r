import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './plugins/pinia';
import vuetify from './plugins/vuetify';

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount('#app');