Acme Hospital - Sistema de Gestión Médica
Este repositorio contiene el código fuente de un sistema de gestión médica para el "Acme Hospital". El sistema está desarrollado utilizando HTML, CSS y JavaScript, y utiliza IndexedDB para almacenar datos en el navegador. El sistema permite la gestión de usuarios, pacientes, recetas médicas y la visualización del historial médico de los pacientes.

Características Principales
Inicio de Sesión de Administrador:

Validación de credenciales para acceder al sistema.

Redirección a la página de bienvenida si las credenciales son correctas.

Registro de Personal Médico:

Formulario para registrar nuevos médicos o personal administrativo.

Almacenamiento de datos en IndexedDB.

Registro de Pacientes:

Formulario para registrar nuevos pacientes.

Almacenamiento de datos en IndexedDB, incluyendo información personal y una imagen.

Gestión de Recetas Médicas:

Formulario para crear y almacenar recetas médicas.

Almacenamiento de datos en IndexedDB, incluyendo síntomas, diagnóstico, medicamentos, dosis y tiempo de tratamiento.

Historial Médico:

Búsqueda y visualización del historial médico de un paciente.

Muestra de datos en una tabla dinámica.

IndexedDB:

Uso de IndexedDB para almacenar datos de manera persistente en el navegador.

Creación de tablas (usuarios, pacientes, recetas) con índices para búsquedas eficientes.

Estructura del Proyecto
index.html: Página principal de inicio de sesión.

bienvenida.html: Página de bienvenida después del inicio de sesión.

style.css: Archivo CSS para estilos generales.

main.js: Lógica de inicio de sesión y creación de la base de datos.

sub-main.js: Lógica para el registro de personal, pacientes, recetas y generación de historial médico.

Instalación y Uso
Clonar el Repositorio:

bash
Copy
git clone https://github.com/tu-usuario/acme-hospital.git
cd acme-hospital
Abrir el Proyecto:

Abre el archivo index.html en tu navegador para acceder al sistema.

Iniciar Sesión:

Usa las credenciales predefinidas:

Usuario: admin

Contraseña: 123

Registrar Personal Médico:

Completa el formulario de registro de personal médico y haz clic en "Guardar".

Registrar Pacientes:

Completa el formulario de registro de pacientes y haz clic en "Guardar".

Crear Recetas Médicas:

Completa el formulario de recetas médicas y haz clic en "Guardar Receta".

Generar Historial Médico:

Ingresa el número de identificación del paciente y haz clic en "Generar Historia Médica" para ver su historial.

Código Destacado
Inicio de Sesión
javascript
Copy
const nombreUsuario = document.getElementById("nombreAdmin");
const claveUsuario = document.getElementById("claveAdmin");
const btnIngresar = document.getElementById("btnIngresar");

const admin = {
  nombreAdmin: "admin",
  claveAdmin: "123"
};

btnIngresar.addEventListener("click", (event)=>{
 event.preventDefault();
 if(nombreUsuario.value === admin.nombreAdmin && claveUsuario.value === admin.claveAdmin){
    window.location.href = "bienvenida.html";
  }else{
    mensajeError.style.display = "block";
  }
});
Creación de la Base de Datos
javascript
Copy
function initDB() {
  const openDB = window.indexedDB.open('clinica', 1);

  openDB.onupgradeneeded = (event) => {
    let clinicaDB = event.target.result;

    clinicaDB.onerror = () => {
      console.error('Error cargando la base de datos.');
    };

    let table = clinicaDB.createObjectStore('usuarios', { keyPath: 'cc' });
    table.createIndex('apellido', 'apellido', { unique: false });

    if (!clinicaDB.objectStoreNames.contains('pacientes')) {
      let table = clinicaDB.createObjectStore('pacientes', { keyPath: 'doc' });
      table.createIndex('doc', 'doc', { unique: false });
    }

    if (!clinicaDB.objectStoreNames.contains('recetas')) {
      let table = clinicaDB.createObjectStore('recetas', { keyPath: 'numIdentificacion' });
      table.createIndex('sintomas', 'sintomas', { unique: false });
      table.createIndex('diagnostico', 'diagnostico', { unique: false });
      table.createIndex('nombreMedicamento', 'nombreMedicamento', { unique: false });
    }
  };

  openDB.onerror = () => console.error('Error abriendo la base de datos');
  openDB.onsuccess = () => console.log('Base de datos abierta!');
}
Registro de Pacientes
javascript
Copy
function agregarPaciente(doc, nombrePaciente, apellidoPaciente, genero, fecha, imagen) {
  const openDB = window.indexedDB.open('clinica', 1);

  openDB.onerror = () => console.error('Error abriendo la base de datos');

  openDB.onsuccess = () => {
    let registroPacientes = openDB.result;
    const transaction = registroPacientes.transaction(["pacientes"], "readwrite");
    const pacientesStore = transaction.objectStore("pacientes");

    const nuevoPaciente = { doc, nombrePaciente, apellidoPaciente, genero, fecha, imagen };
    const agregarRequest = pacientesStore.add(nuevoPaciente);

    agregarRequest.onsuccess = () => console.log("Paciente creado correctamente");
    agregarRequest.onerror = (error) => console.log("Error:", error.target.error.name);
  };
}
Contribuciones
Si deseas contribuir a este proyecto, por favor sigue estos pasos:

Haz un fork del repositorio.

Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).

Realiza tus cambios y haz commit (git commit -am 'Añade nueva funcionalidad').

Haz push a la rama (git push origin feature/nueva-funcionalidad).

Abre un Pull Request.

Licencia
Este proyecto está bajo la licencia MIT. Para más detalles, consulta el archivo LICENSE.

Contacto
Si tienes alguna pregunta o sugerencia, no dudes en contactarme:

Nombre: Esteban Briceño

Email: brice_esteban28@hotmail.com

GitHub: Est3eb4n


https://www.figma.com/community/file/1470939661761553980
