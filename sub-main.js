//***********************************************************************************/
//************************ funcion para crear el archivo ****************************/
//***********************************************************************************/

function initDB() {
  const openDB = window.indexedDB.open('clinica', 1);

  openDB.onupgradeneeded = (event) => {
    let clinicaDB = event.target.result;

    clinicaDB.onerror = () => {
      console.error('Error cargando la base de datos.');
    };

    // Crear la tabla 'usuarios' con 'cc' como clave primaria
    let table = clinicaDB.createObjectStore('usuarios', { keyPath: 'cc' });

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
    let clinicaDB = openDB.result;
    const transaction = clinicaDB.transaction(["usuarios"], "readwrite");
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

const cracionUser = document.querySelector("#formularioMedico")
const btnGuardar = document.getElementById("btnPersonal")

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

//***********************************************************************************/
//************************ funcion para crear el archivo ****************************/
//***********************************************************************************/
function pacienteDB() {
  const openDB = window.indexedDB.open('pacientes', 2); // Incrementa la versión a 2

  openDB.onupgradeneeded = (event) => {
    let registroPacientes = event.target.result;

    registroPacientes.onerror = () => {
      console.error('Error cargando la base de datos.');
    };

    // Verifica si el almacén de objetos ya existe
    if (!registroPacientes.objectStoreNames.contains('pacientes')) {
      // Crear la tabla 'pacientes' con 'doc' como clave primaria
      let table = registroPacientes.createObjectStore('pacientes', { keyPath: 'doc' });

      // Crear un índice para 'doc' (no único)
      table.createIndex('doc', 'doc', { unique: false });

      console.log('Almacén de objetos "pacientes" creado correctamente.');
    }
  };

  openDB.onerror = () => console.error('Error abriendo la base de datos');

  openDB.onsuccess = () => {
    console.log('Base de datos abierta!');
  };
}

//***********************************************************************************/
//***************************** Registro pacientes **********************************/
//***********************************************************************************/

function agregarPaciente(doc, nombrePaciente, apellidoPaciente, genero, fecha, imagen) {
  const openDB = window.indexedDB.open('pacientes', 2); // Usa la misma versión

  openDB.onerror = () => console.error('Error abriendo la base de datos');

  openDB.onsuccess = () => {
    let registroPacientes = openDB.result;

    // Verifica si el almacén de objetos existe
    if (!registroPacientes.objectStoreNames.contains('pacientes')) {
      console.error('El almacén de objetos "pacientes" no existe.');
      return;
    }

    const transaction = registroPacientes.transaction(["pacientes"], "readwrite");
    const pacientesStore = transaction.objectStore("pacientes");

    const nuevoPaciente = { doc, nombrePaciente, apellidoPaciente, genero, fecha, imagen };
    const agregarRequest = pacientesStore.add(nuevoPaciente);

    agregarRequest.onsuccess = () => {
      console.log("Paciente creado correctamente");
    };

    agregarRequest.onerror = (error) => {
      if (error.target.error.name == "ConstraintError") {
        console.log("Error: El documento del paciente ya está registrado.");
      } else {
        console.log("Error desconocido.", error.target.error.name);
      }
    };
  };
}

pacienteDB();

const cargarPaciente = document.querySelector("#formularioPacientes");
const btnGuardarPaciente = document.getElementById("btnPaciente");

btnGuardarPaciente.addEventListener("click", (event) => {
  event.preventDefault();

  const frmData = new FormData(cargarPaciente);

  agregarPaciente(
    frmData.get("doc"),
    frmData.get("nombrePaciente"),
    frmData.get("apellidoPaciente"),
    frmData.get("genero"),
    frmData.get("fecha"),
    frmData.get("imagen") // Aquí debes procesar el archivo si es necesario
  );
});

//***********************************************************************************/
//************************ Función para crear la base de datos **********************/
//***********************************************************************************/
function initRecetaDB() {
  const openDB = window.indexedDB.open('recetasMedicas', 1); // Nombre y versión de la base de datos

  openDB.onupgradeneeded = (event) => {
    let db = event.target.result;

    db.onerror = () => {
      console.error('Error cargando la base de datos.');
    };

    // Crear el almacén de objetos 'recetas' con 'numIdentificacion' como clave primaria
    if (!db.objectStoreNames.contains('recetas')) {
      let table = db.createObjectStore('recetas', { keyPath: 'numIdentificacion' });

      // Crear índices para otros campos (opcional)
      table.createIndex('sintomas', 'sintomas', { unique: false });
      table.createIndex('diagnostico', 'diagnostico', { unique: false });
      table.createIndex('nombreMedicamento', 'nombreMedicamento', { unique: false });

      console.log('Almacén de objetos "recetas" creado correctamente.');
    }
  };

  openDB.onerror = () => console.error('Error abriendo la base de datos');

  openDB.onsuccess = () => {
    console.log('Base de datos "recetasMedicas" abierta correctamente.');
  };
}

//***********************************************************************************/
//***************************** Función para agregar recetas ************************/
//***********************************************************************************/
function agregarReceta(numIdentificacion, sintomas, diagnostico, nombreMedicamento, docis, tratamiento) {
  const openDB = window.indexedDB.open('recetasMedicas', 1);

  openDB.onerror = () => console.error('Error abriendo la base de datos');

  openDB.onsuccess = () => {
    let db = openDB.result;

    // Verificar si el almacén de objetos existe
    if (!db.objectStoreNames.contains('recetas')) {
      console.error('El almacén de objetos "recetas" no existe.');
      return;
    }

    const transaction = db.transaction(["recetas"], "readwrite");
    const recetasStore = transaction.objectStore("recetas");

    const nuevaReceta = { numIdentificacion, sintomas, diagnostico, nombreMedicamento, docis, tratamiento };
    const agregarRequest = recetasStore.add(nuevaReceta);

    agregarRequest.onsuccess = () => {
      console.log("Receta médica guardada correctamente.");
    };

    agregarRequest.onerror = (error) => {
      if (error.target.error.name == "ConstraintError") {
        console.log("Error: Ya existe una receta con este número de identificación.");
      } else {
        console.log("Error desconocido:", error.target.error.name);
      }
    };
  };
}

//***********************************************************************************/
//***************************** Registro de recetas *********************************/
//***********************************************************************************/
const formularioReceta = document.querySelector("#formularioReceta"); // Asegúrate de agregar un id al formulario
const btnGuardarReceta = document.getElementById("btnGuardarReceta"); // Asegúrate de agregar un id al botón

btnGuardarReceta.addEventListener("click", (event) => {
  event.preventDefault();

  // Obtener los valores del formulario
  const numIdentificacion = document.getElementById("identificación").value;
  const sintomas = document.getElementById("sintomas").value;
  const diagnostico = document.getElementById("diagnostico").value;
  const nombreMedicamento = document.getElementById("nombreMedicamento").value;
  const docis = document.getElementById("docis").value;
  const tratamiento = document.getElementById("tratamiento").value;

  // Verificar los valores obtenidos del formulario
  console.log("Número de identificación:", numIdentificacion);
  console.log("Síntomas:", sintomas);
  console.log("Diagnóstico:", diagnostico);
  console.log("Nombre del medicamento:", nombreMedicamento);
  console.log("Dosis:", docis);
  console.log("Tratamiento:", tratamiento);

  // Guardar la receta en IndexedDB
  agregarReceta(numIdentificacion, sintomas, diagnostico, nombreMedicamento, docis, tratamiento);
});

// Inicializar la base de datos
initRecetaDB();