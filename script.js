//Javascript

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

let modoEdicion = false;
let indiceEditar = null;


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
  div.setAttribute("data-id", libro.id);

  const tarjeta = document.createElement("div");
  tarjeta.className = "card h-100";


  const cuerpo = document.createElement("div");
  cuerpo.className = "card-body";

  const imagen = document.createElement("img");
  imagen.className = "card-img-top";
  imagen.src = "libro.png";

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

  const estrellas = mostrarEstrellas(libro.puntaje);
  puntaje.innerHTML = estrellas !== "" ? estrellas : "<span>☆☆☆☆☆</span>";



  const contenedorBotones = document.createElement("div");

  contenedorBotones.className = "d-flex justify-content-between";

  const botonEditar = document.createElement("button");
  botonEditar.className = "btn btn-outline-secondary btn-sm botonEditar";
  botonEditar.setAttribute("data-id", libro.id);
  botonEditar.innerText = "✏️";

  const botonEliminar = document.createElement("button");
  botonEliminar.className = "btn btn-outline-danger btn-sm botonEliminar";
  botonEliminar.setAttribute("data-id", libro.id);
  botonEliminar.innerText = "🗑️";

  contenedorBotones.append(botonEditar, botonEliminar);


  cuerpo.append(imagen, titulo, autor, estado, puntaje, contenedorBotones);
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
  agregarEventosEditar(); 
  agregarEventosDetalles();
}

function agregarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll(".botonEliminar");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = boton.dataset.id;
      const libros = obtenerLibrosGuardados();
      const index = libros.findIndex(l => l.id == id);
      libros.splice(index, 1);
      guardarLibros(libros);
      renderizarLibros();
    });
  });
}

function agregarEventosEditar() {
  const botonesEditar = document.querySelectorAll(".botonEditar");
  botonesEditar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = boton.dataset.id;
      const libros = obtenerLibrosGuardados();
      const libro = libros.find(l => l.id == id);
      const index = libros.findIndex(l => l.id == id);

      // Llenar el formulario con los datos del libro
      document.getElementById("titulo").value = libro.titulo;
      document.getElementById("autor").value = libro.autor;
      document.getElementById("serie").value = libro.serie;
      document.getElementById("puntaje").value = libro.puntaje;
      document.getElementById("generos").value = libro.generos;
      document.getElementById("estadoLibro").value = libro.estado;
      document.getElementById("comentario").value = libro.comentario;

      // Activar modo edición
      modoEdicion = true;
      indiceEditar = index;

      // Scrollear al formulario
      window.scrollTo({
        top: document.getElementById("agregarLibro").offsetTop,
        behavior: "smooth",
      });
    });
  });
}


formularioLibro.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevoLibro = {
    id: Date.now(), 
    titulo: document.getElementById("titulo").value.trim(),
    autor: document.getElementById("autor").value.trim(),
    serie: document.getElementById("serie").value.trim(),
    puntaje: document.getElementById("puntaje").value.trim(),
    generos: document.getElementById("generos").value.trim(),
    estado: document.getElementById("estadoLibro").value,
    comentario: document.getElementById("comentario").value.trim(),
  };
  const libros = obtenerLibrosGuardados();
  if (modoEdicion) {
    libros[indiceEditar] = nuevoLibro;
    modoEdicion = false;
    indiceEditar = null;
} else {
    libros.push(nuevoLibro);
}

  guardarLibros(libros);
  formularioLibro.reset();
  renderizarLibros();
});

document.addEventListener("DOMContentLoaded", () => {
  renderizarLibros();
  agregarEventosDetalles();
  botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
      botonesFiltro.forEach(b => b.classList.remove("activo"));
      boton.classList.add("activo");
      filtroActivo = boton.dataset.filtro;
      renderizarLibros();
      agregarEventosDetalles();
    });
  });
});

function agregarEventosDetalles() {
  const tarjetas = document.querySelectorAll(".tarjetaLibro");

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      const id = tarjeta.dataset.id;
      const libros = obtenerLibrosGuardados();
      const libro = libros.find(l => l.id == id);
      document.getElementById("modalTitulo").innerText = libro.titulo;
      document.getElementById("modalCuerpo").innerHTML = `
        <p><strong>Autor:</strong> ${libro.autor}</p>
        <p><strong>Serie:</strong> ${libro.serie || "—"}</p>
        <p><strong>Géneros:</strong> ${libro.generos || "—"}</p>
        <p><strong>Puntaje:</strong> ${mostrarEstrellas(libro.puntaje)}</p>
        <p><strong>Comentario:</strong> ${libro.comentario || "—"}</p>
      `;
      const modalElemento = document.getElementById("modalLibro");
      const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);
      modal.show();
    });
  });
}


