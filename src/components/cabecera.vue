<script setup>
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";
import { ref } from "vue";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
const lanzarEvento = defineEmits(["nuevaNota", "borrarCompletadas", "nuevoArchivo"] );

const auth = getAuth();
const provider = new GoogleAuthProvider();

let user = ref(auth.currentUser);
if (user) {
    let uid = user.uid;
}

const router = useRouter();


function cerrarSesion() {

    signOut(auth).then(() => {
    // Sign-out successful.
    user = null;
    console.log("sesion cerrada");
    router.push("/");
    }).catch((error) => {
    // An error happened.
    });
}

</script>

<template>
    <header class="header">
        <h1><RouterLink to="/">To - Do List</RouterLink></h1>
        <ul v-if="user">
            <button><RouterLink to="/privada">Mis Notas</RouterLink></button>
            <button v-if="user.email === 'plopezlozano12@gmail.com'"><RouterLink to="/administracion">Administracion</RouterLink></button>
            <p v-if="user.displayName != null">Bienvenido, {{ user.displayName }}</p>
            <p v-else>Bienvenido, {{ user.email }}</p>
            <img v-if="user.photoURL !=null" class="foto" :src="user.photoURL" alt="">
            <button @click="cerrarSesion">Cerrar Sesión</button>
        </ul>
        <ul v-else>
            <RouterLink to="/iniciarsesion">Iniciar Sesion</RouterLink>
            <RouterView></RouterView>
        </ul>
    </header>
</template>