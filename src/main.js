import { createApp } from 'vue';
import App from './App.vue';
import 'tailwindcss/tailwind.css';
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/home.vue';
import Projects from './views/projects.vue';
import ManageProjects from './views/manageProjects.vue';
import Tasks from './views/tasks.vue';
import Teams from './views/teams.vue';
import Workers from './views/workers.vue';
import Clients from './views/clients.vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/projects', name: 'Projects', component: Projects },
    { path: '/management/projects', name: 'ProjectManagement', component: ManageProjects },
    { path: '/tasks', name: 'Tasks', component: Tasks },
    { path: '/teams', name: 'Teams', component: Teams },
    { path: '/workers', name: 'Workers', component: Workers },
    { path: '/clients', name: 'Clients', component: Clients },
  ],
});

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(router);
app.mount('#app');
