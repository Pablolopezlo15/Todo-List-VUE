<script setup>
import cabecera from './cabecera.vue';
import { ref } from "firebase/storage";
import { useCollection } from 'vuefire'
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs} from "firebase/firestore"; 
import { useFirestore } from 'vuefire';
import { query, where, orderBy } from "firebase/firestore";  
import { getAuth } from "firebase/auth";
import { computed } from "vue";


let db = useFirestore();
// const todos = useCollection(collection(db, 'todos'));

const auth = getAuth();
let uid = auth.currentUser.uid;

const coleccion = collection(db, "todos");
let list = ref(useCollection(query(coleccion, orderBy("prioridad", "desc"))));

function marcarCompletada(id, completada) {
    const docRef = doc(db, "todos", id);
    if (completada) {
        completada = false;
    } else {
        completada = true;
    }
    updateDoc(docRef, {
        completada: completada,
    });
    console.log("marcarCompletada con id" + id);
}


async function borrarCompletadas() {
    const q = query(collection(db, "todos"), where("completada", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });

    console.log("borrarCompletadas");
}

async function borrarTodas() {
    const q = query(collection(db, "todos"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });

    console.log("borrarCompletadas");
}

function eliminarNota(id) {
  deleteDoc(doc(db, "todos", id));
  console.log("eliminarNota con id" + id);
}


function establecerPrioridadBaja(id) {
  const docRef = doc(db, "todos", id);
  updateDoc(docRef, {
    prioridad: "0",
  });
  console.log("Prioridad baja con id" + id);
}

function establecerPrioridadMedia(id) {
  const docRef = doc(db, "todos", id);
  updateDoc(docRef, {
    prioridad: "1",
  });
  console.log("Prioridad media con id" + id);
}

function establecerPrioridadAlta(id) {
  const docRef = doc(db, "todos", id);
  updateDoc(docRef, {
    prioridad: "2",
  });
  console.log("Prioridad alta con id" + id);
}

function tiempoDesdeCreacion(timestamp) {
    const ahora = Date.now();
    const tiempoNota = timestamp.seconds * 1000;
    const diferencia = Math.abs(ahora - tiempoNota);

    const minutos = Math.floor(diferencia / 60000); 

    return minutos;
}

function verArchivo(url) {
  window.open(url);
}

let buscar = ref("");
let busqueda = false;
const listaFiltrada = ref();
let listaOriginal = ref(useCollection(query(coleccion, where("idUsuario", "==", uid), orderBy("prioridad", "desc"))));

function buscarNota() {
  console.log(buscar.value);

  if (buscar.value != "") {
    busqueda = true;
    if (list.value != undefined){
      list.value = list.value.filter((todo) => todo.texto.includes(buscar));
    }
  } else {
    list.value = listaOriginal;
    busqueda = false;
    
  }
}


</script>

<template>
    <cabecera></cabecera>
<main>
    <h1>Menu Administración</h1>
</main>
  <ul>
    <div>   
        <p v-if="busqueda">Resultados de la búsqueda: {{ buscar }}</p>
        <!-- <p>Tareas pendientes: {{ tareasPendientes }} / {{ totalTareas }}</p> -->
        <button @click="borrarCompletadas">Borrar Completadas</button>
        <button @click="borrarTodas">Borrar TODO</button>
        <input type="text" v-model="buscar" @keyup="buscarNota" placeholder="Buscar...">
    </div>
    
    <li v-for="todo in list" ref="listaFiltrada">
      <h4> {{ todo.texto }} </h4>
      <!-- <p>Creado por: {{ user }}</p> -->
      <button @click="eliminarNota(todo.id)">Eliminar</button>
      <button @click="establecerPrioridadAlta(todo.id)">Alta ^</button>
      <button @click="establecerPrioridadMedia(todo.id)">Media -</button>
      <button @click="establecerPrioridadBaja(todo.id)">Baja</button>
      <p>Completada: <input type="checkbox" v-model="todo.completada" @click="marcarCompletada(todo.id, todo.completada)" value="Completado"></p>
      <p v-if="todo.URL != ''">Archivo adjunto: <button @click="verArchivo(todo.URL)">Ver</button></p>
    </li>
  </ul>
</template>