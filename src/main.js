import './assets/styles.css'

import { createApp } from 'vue'
import App from './index.vue'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'
import { getAuth, onAuthStateChanged } from "firebase/auth";

import privada from './components/privada.vue'
import Inicio from './components/Inicio.vue'
import Administracion from './components/Administracion.vue';
import IniciaSesion from './components/iniciarsesion.vue';
import Registrarse from './components/registrarse.vue';
import { createRouter, createWebHistory, onBeforeRouteUpdate } from 'vue-router'

const admin = "plopezlozano12@gmail.com"; 

const routes = [
  { 
    path: '/', 
    component: Inicio
  },
  {
    path: '/privada',
    name: 'privada',
    component: privada,
  },
  { 
    path: '/administracion', 
    component: Administracion 
  },
  {
    path: '/iniciarsesion',
    name: 'iniciarsesion',
    component: IniciaSesion,
  },
  {
    path: '/registrarse',
    name: 'registrarse',
    component: Registrarse,
  },

]
let estasIdentificado = false;


const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
if (user) {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/auth.user
  const uid = user.uid;
  estasIdentificado = true;
  // ...
} else {
  // User is signed out
  estasIdentificado = false;
  

  // ...
}
});

router.beforeEach((to, from) => {

  const user = auth.currentUser;
  console.log(user);
  if (to.path == "/privada" && !estasIdentificado) {
    console.log("ruta privada");
    return false;
  }
  if (to.path == "/administracion" && (!estasIdentificado || user.email != admin)) {
    console.log("ADMINISTRACION");
    return false;
  }
});




const app = createApp(App)
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})
app.use(router)
app.mount('#app')