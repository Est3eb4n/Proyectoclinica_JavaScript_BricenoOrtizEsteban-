//***********************************************************************************/
//************************ funcion para crear el archivo ****************************/
//***********************************************************************************/

function initDB() {
  const openDB = window.indexedDB.open('clinica', 1);

  openDB.onupgradeneeded = (event) => {
    let inventarioDB = event.target.result;

    inventarioDB.onerror = () => {
      console.error('Error cargando la base de datos.');
    };

    // Crear la tabla 'usuarios' con 'cc' como clave primaria
    let table = inventarioDB.createObjectStore('usuarios', { keyPath: 'cc' });

    // Crear un índice para 'apellido' (no único)
    table.createIndex('apellido', 'apellido', { unique: false });
  };

  openDB.onerror = () => console.error('Error abriendo la base de datos');

  openDB.onsuccess = () => {
    console.log('Base de datos abierta!');
  };
}

//***********************************************************************************/
//******************************* Registro medico ***********************************/
//***********************************************************************************/

function agregarUsuario(cc, nombre, apellido, cargo, telefono, correo, clave) {
  const openDB = window.indexedDB.open('clinica', 1);

  openDB.onerror = () => console.error('Error abriendo la base de datos');

  openDB.onsuccess = () => {
    let inventarioDB = openDB.result;
    const transaction = inventarioDB.transaction(["usuarios"], "readwrite");
    const usuariosStore = transaction.objectStore("usuarios");

    const nuevoUsuario = { cc, nombre, apellido, cargo, telefono, correo, clave };
    const agregarRequest = usuariosStore.add(nuevoUsuario);

    agregarRequest.onsuccess = () => {
      console.log("Usuario creado correctamente");
    };

    agregarRequest.onerror = (error) => {
      if (error.target.error.name == "ConstraintError") {
        console.log("Error: El código del usuario ya está registrado.");
      } else {
        console.log("Error desconocido.", error.target.error.name);
      }
    };
  };
}

initDB();

const cracionUser = document.querySelector("#formulario")
const btnGuardar = document.getElementById("prin")

btnGuardar.addEventListener("click", (event)=>{
  event.preventDefault()
  console.log(cracionUser)
  const frmData = new FormData(cracionUser);
  console.log(frmData)
  agregarUsuario(
    frmData.get("cc"), 
    frmData.get("nombre"), 
    frmData.get("apellido"), 
    frmData.get("correo"), 
    frmData.get("telefono"), 
    frmData.get("clave"), 
    frmData.get("cargo")
  );
});


