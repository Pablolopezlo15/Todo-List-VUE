<script setup>
import { getAuth, signOut } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

import cabecera from './cabecera.vue';

const auth = getAuth();
const provider = new GoogleAuthProvider();
const router = useRouter();

let user = ref(auth.currentUser);


</script>

<template>
    <cabecera></cabecera>
    <main>
        <h1>Bienvenido a To - do List</h1>
        <h2>Organiza tu vida</h2>
        
        <div class="hero">
            <div class="card-text">
                <h3>Organiza tu vida</h3>
                <p>Con To - do List podrás organizar tu vida de una manera sencilla y eficaz.</p>
                <div class="registrate">
                    <h2>EMPEZAR</h2>
                    <div v-if="!user">
                        <button><RouterLink to="/iniciarsesion">Iniciar Sesion</RouterLink></button>
                        <button><RouterLink to="/registrarse">Registrarse</RouterLink></button>
                    </div>
                    <div v-else>
                        <button><RouterLink to="/privada">Mis Notas</RouterLink></button>
                    </div>
                </div>

            </div>
            <div class="card-img">
                <img src="https://clickup.com/blog/wp-content/uploads/2019/01/to-do-list-apps.png" alt="">
            </div>
        </div>

        <div class="hero">
            <div class="card-img">
                <img src="../assets/logo.svg" alt="">
            </div>
            <div class="card-text">
                <h3>Proyecto desarrollado con VUE</h3>
            </div>
        </div>

    </main>
  

</template>