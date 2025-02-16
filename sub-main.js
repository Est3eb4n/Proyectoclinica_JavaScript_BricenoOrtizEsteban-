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

    // Verifica si el almacén de objetos ya existe
    if (!clinicaDB.objectStoreNames.contains('pacientes')) {
      // Crear la tabla 'pacientes' con 'doc' como clave primaria
      let table = clinicaDB.createObjectStore('pacientes', { keyPath: 'doc' });

      // Crear un índice para 'doc' (no único)
      table.createIndex('doc', 'doc', { unique: false });
    }
        // Crear el almacén de objetos 'recetas' con 'numIdentificacion' como clave primaria
        if (!clinicaDB.objectStoreNames.contains('recetas')) {
          let table = clinicaDB.createObjectStore('recetas', { keyPath: 'numIdentificacion' });
    
          // Crear índices para otros campos (opcional)
          table.createIndex('sintomas', 'sintomas', { unique: false });
          table.createIndex('diagnostico', 'diagnostico', { unique: false });
          table.createIndex('nombreMedicamento', 'nombreMedicamento', { unique: false });
    
          console.log('Almacén de objetos "recetas" creado correctamente.');
        }

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

btnGuardar.addEventListener("click", (event) => {
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
//***************************** Registro pacientes **********************************/
//***********************************************************************************/

function agregarPaciente(doc, nombrePaciente, apellidoPaciente, genero, fecha, imagen) {
  const openDB = window.indexedDB.open('clinica', 1); // Usa la misma versión

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
//***************************** Función para agregar recetas ************************/
//***********************************************************************************/
function agregarReceta(numIdentificacion, sintomas, diagnostico, nombreMedicamento, docis, tratamiento) {
  const openDB = window.indexedDB.open('clinica', 1);

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
const formularioReceta = document.querySelector("#formularioReceta");
const btnGuardarReceta = document.getElementById("btnGuardarReceta");

btnGuardarReceta.addEventListener("click", (event) => {
  event.preventDefault();

  // Obtener los valores del formulario
  const numIdentificacion = document.getElementById("identificación").value;
  const sintomas = document.getElementById("sintomas").value;
  const diagnostico = document.getElementById("diagnostico").value;
  const nombreMedicamento = document.getElementById("nombreMedicamento").value;
  const docis = document.getElementById("docis").value;
  const tratamiento = document.getElementById("tratamiento").value;

  // Guardar la receta en IndexedDB
  agregarReceta(numIdentificacion, sintomas, diagnostico, nombreMedicamento, docis, tratamiento);
});

// Inicializar la base de datos

//***********************************************************************************/
//**************************** Mostar historia mecida *******************************/
//***********************************************************************************/


const btnGenerarHistoria = document.getElementById("btnGenerarHistoria");
const historialMedico = document.getElementById("historialMedico");

// Función para obtener los datos de la base de datos
function obtenerDatos() {

  const openDB = window.indexedDB.open('clinica', 1);

  openDB.onerror = () => console.error('Error abriendo la base de datos');

  openDB.onsuccess = () => {
    const numeroDeId = document.getElementById("numeroDeId").value;
    let datosPaciente;
    let datosReceta
    let db = openDB.result;
    const transaction = db.transaction(['pacientes','recetas'], 'readonly'); // Crear una transacción
    const storePaciente = transaction.objectStore('pacientes'); // Acceder al almacén de objetos
    const storeRecetas = transaction.objectStore('recetas'); // Acceder al almacén de objetos
    const requestPacientes = storePaciente.getAll(); // Obtener todos los registros
    const requestReceta = storeRecetas.getAll(); // Obtener todos los registros
    
   
    console.log(datosPaciente)
    requestPacientes.onsuccess = function (event) {
      let datos = event.target.result;
      for (const paciente of datos) {
        if(paciente.doc == numeroDeId){
          datosPaciente=paciente;
          break
        }
      }
      requestReceta.onsuccess = function (event) {
      let datos = event.target.result;
      for (const receta of datos) {
        if(receta.numeroDeIdentidficcion == numeroDeId){
          datosReceta=receta;
          break
        }
      }
      console.log("Datos obtenidos correctamente", datos);
      mostrarDatosEnTabla(datos); // Mostrar los datos en la tabla
    };
  
    requestPacientes.onerror = function (event) {
      console.error("Error al obtener los datos", event.target.errorCode);
    };
  }
}
}

// Función para mostrar los datos en la tabla
function mostrarDatosEnTabla(datos) {
  const tabla = document.querySelector('#historialMedico mi-historial .tabla table');
  let tbody = tabla.querySelector('tbody');

  // Si ya existe un tbody, lo limpiamos
  if (tbody) {
    tbody.innerHTML = '';
  } else {
    // Si no existe, lo creamos
    tbody = document.createElement('tbody');
    tabla.appendChild(tbody);
  }

  datos.forEach(paciente => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${paciente.sintomas}</td>
      <td>${paciente.diagnostico}</td>
      <td>${paciente.nombreMedicamento}</td>
      <td>${paciente.docis}</td>
      <td>${paciente.tratamiento}</td>
    `;
    tbody.appendChild(row);
  });
}

// Definir el componente personalizado para la tabla
class MiHistorial extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="tabla">
        <table>
          <thead>
            <tr>
              <th>Síntomas del paciente</th>
              <th>Diagnóstico del paciente</th>
              <th>Nombre del medicamento</th>
              <th>Dosis</th>
              <th>Tiempo de tratamiento</th>
            </tr>
          </thead>
        </table>
      </div>
    `;
  }
}

// Registrar el componente personalizado
customElements.define('mi-historial', MiHistorial);

// Evento para el botón "Generar Historia"
btnGenerarHistoria.addEventListener("click", (event) => {
  event.preventDefault();

  // Limpiar el contenido antes de insertar el componente
  historialMedico.innerHTML = '';
  historialMedico.innerHTML = `<mi-historial></mi-historial>`; // Mostrar la tabla

  obtenerDatos(); // Obtener los datos de la base de datos
});

initDB()  