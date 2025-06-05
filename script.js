// script.js

// CONTADOR DE LIBROS LEIDOS
const botonSumar = document.getElementById("botonSumar");
const botonRestar = document.getElementById("botonRestar");
const botonReiniciar = document.getElementById("botonReiniciar");
botonReiniciar.className = "btn btn-outline-warning ms-2";
botonReiniciar.innerText = "Reiniciar";
const cantidadLeidos = document.getElementById("cantidadLeidos");

let contador = localStorage.getItem("librosLeidos")
  ? parseInt(localStorage.getItem("librosLeidos"))
  : 0;

cantidadLeidos.innerText = contador;

botonSumar.addEventListener("click", () => {
  contador++;
  actualizarContador();
});

botonRestar.addEventListener("click", () => {
  if (contador > 0) {
    contador--;
    actualizarContador();
  }
});

botonReiniciar.addEventListener("click", () => {
  contador = 0;
  actualizarContador();
});

function actualizarContador() {
  cantidadLeidos.innerText = contador;
  localStorage.setItem("librosLeidos", contador);
}



// AGREGAR LIBRO A LA ESTANTERIA
const formularioLibro = document.getElementById("formularioLibro");
const grillaLibros = document.getElementById("grillaLibros");
const botonesFiltro = document.querySelectorAll(".botonFiltro");
let filtroActivo = "todos";

function obtenerLibrosGuardados() {
  return JSON.parse(localStorage.getItem("librosGuardados")) || [];
}

function guardarLibros(libros) {
  localStorage.setItem("librosGuardados", JSON.stringify(libros));
}

function crearTarjetaLibro(libro, index) {
  if (filtroActivo !== "todos" && libro.estado !== filtroActivo) return;

  const div = document.createElement("div");
  div.className = "col-md-4 tarjetaLibro";

  const tarjeta = document.createElement("div");
  tarjeta.className = "card h-100";


  const cuerpo = document.createElement("div");
  cuerpo.className = "card-body";

  const imagen = document.createElement("img");
  imagen.className = "card-img-top";
  imagen.src = "/libro.png";

  const titulo = document.createElement("h5");
  titulo.className = "card-title";
  titulo.innerText = libro.titulo;

  const autor = document.createElement("p");
  autor.className = "card-text autorLibro";
  autor.innerText = libro.autor;

  const estado = document.createElement("p");
  estado.className = "card-text estadoLibro";
  estado.innerText = formatearEstado(libro.estado);

  const puntaje = document.createElement("p");
  puntaje.className = "card-text puntajeLibro";
  puntaje.innerText = mostrarEstrellas(libro.puntaje);

  const boton = document.createElement("button");
  boton.className = "btn btn-outline-danger btn-sm botonEliminar";
  boton.setAttribute("data-index", index);
  boton.innerText = "🗑️";

  cuerpo.append(imagen, titulo, autor, estado, puntaje, boton);
  tarjeta.append(cuerpo);
  div.append(tarjeta);
  grillaLibros.appendChild(div);
}

function formatearEstado(estado) {
  switch (estado) {
    case "leido": return "✅ Leído";
    case "tbr": return "📖 Por leer";
    case "wishlist": return "⭐ Wishlist";
    case "leyendo": return "📕 En curso";
    default: return estado;
  }
}

function mostrarEstrellas(puntaje) {
  if (!puntaje || isNaN(puntaje)) return "";
  const valor = Math.min(Math.max(parseInt(puntaje), 0), 5);
  return "⭐".repeat(valor) + "☆".repeat(5 - valor);
}

function renderizarLibros() {
  grillaLibros.innerHTML = "";
  const libros = obtenerLibrosGuardados();
  libros.forEach((libro, index) => crearTarjetaLibro(libro, index));
  agregarEventosEliminar();
}

function agregarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll(".botonEliminar");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const index = parseInt(boton.dataset.index);
      const libros = obtenerLibrosGuardados();
      libros.splice(index, 1);
      guardarLibros(libros);
      renderizarLibros();
    });
  });
}

formularioLibro.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevoLibro = {
    titulo: document.getElementById("titulo").value.trim(),
    autor: document.getElementById("autor").value.trim(),
    serie: document.getElementById("serie").value.trim(),
    puntaje: document.getElementById("puntaje").value.trim(),
    generos: document.getElementById("generos").value.trim(),
    estado: document.getElementById("estadoLibro").value,
    comentario: document.getElementById("comentario").value.trim(),
  };
  const libros = obtenerLibrosGuardados();
  libros.push(nuevoLibro);
  guardarLibros(libros);
  formularioLibro.reset();
  renderizarLibros();
});

document.addEventListener("DOMContentLoaded", () => {
  renderizarLibros();
  botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
      botonesFiltro.forEach(b => b.classList.remove("activo"));
      boton.classList.add("activo");
      filtroActivo = boton.dataset.filtro;
      renderizarLibros();
    });
  });
});
