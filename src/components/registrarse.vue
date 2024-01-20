<script setup>
import cabecera from './cabecera.vue';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { nextTick } from 'vue';

import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const auth = getAuth();
const email = ref('');
const password = ref('');
const password2 = ref('');
const error = ref([]);

const provider = new GoogleAuthProvider();
const providerGithub = new GithubAuthProvider();
const providerFacebook = new FacebookAuthProvider();
let errorPorCorreoExisitente = ref('');

function registrarse () {
    error.value = [];

    if (!email.value) {
        error.value.push('Introduce un email.');
    }

    if (!password.value) {
        error.value.push('Introduce una contraseña.');
    }

    if (password.value.length < 6) {
        error.value.push('La contraseña debe tener al menos 6 caracteres.');
    }

    if (password.value !== password2.value) {
        error.value.push('Las contraseñas no coinciden.');
    }

    if (error.value.length === 0) {
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                console.log("Registrado");

                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const errorMessageemail = error.customData.email;


            });
    }
}


function iniciarSesion() {
    console.log("iniciarSesion");
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(user.displayName);
      router.push("/privada");
      // IdP data available using getAdditionalUserInfo(result)
      // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}

function iniciarConGithub() {
  console.log("iniciarConGithub");
    signInWithPopup(auth, providerGithub)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(user.displayName);
      router.push("/privada");
      // IdP data available using getAdditionalUserInfo(result)
      // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
	console.log(errorCode);
	if (errorCode === 'auth/account-exists-with-different-credential') {
		errorPorCorreoExisitente = 'Ya existe un usuario con la misma dirección de correo electrónico pero con diferentes credenciales de inicio de sesión.';
	}
    // ...
  });
}

function iniciarConFaceBook() {
	signInWithPopup(auth, providerFacebook)
  .then((result) => {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

	const user = result.user;
    console.log(user.displayName);
    router.push("/privada");
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });

}

nextTick(() => {
  errorPorCorreoExisitente = null;
});


</script>

<template>
    <cabecera></cabecera>
    <main>
	<h2>Regístrate</h2>
    <div class="form-container">
	<p class="title">Registro</p>
	<p class="errores" v-if="errorPorCorreoExisitente != ''">{{ errorPorCorreoExisitente }}</p>
    <p class="errores" v-for="(err, index) in error" :key="index">{{ err }}</p>
	<div class="form">
		<div class="input-group">
			<label for="email">Email</label>
			<input v-model="email" type="text" name="email" id="email" placeholder="">
		</div>
		<div class="input-group">
			<label for="password">Contraseña</label>
			<input v-model="password" type="password" name="password" id="password" placeholder="">
		</div>
        <div class="input-group">
			<label for="password2">Repite Contraseña</label>
			<input v-model="password2" type="password" name="password2" id="password2" placeholder="">
			<div class="forgot">
				<a rel="noopener noreferrer" href="#">Forgot Password ?</a>
			</div>
		</div>
		<button @click="registrarse" class="sign">Sign up</button>
	</div>
	<div class="social-message">
		<div class="line"></div>
		<p class="message">Login with social accounts</p>
		<div class="line"></div>
	</div>
	<div class="social-icons">
		<button @click="iniciarSesion" aria-label="Log in with Google" class="icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
				<path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
			</svg>
		</button>
		<button @click="iniciarConGithub" aria-label="Log in with GitHub" class="icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
				<path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
			</svg>
		</button>
		<button @click="iniciarConFaceBook" aria-label="Log in with FaceBook" class="icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)"><path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"></path></svg>
		</button>
	</div>
	<p class="signup">¿Tienes ya una cuenta?
		<RouterLink to="/iniciarsesion"><a rel="noopener noreferrer" href="#" class="">Inicia Sesión</a></RouterLink>
	</p>
</div>
    </main>
</template>