
//***********************************************************************************/
//************************** Creacion de usuario admin ******************************/
//***********************************************************************************/

const nombreUsuario = document.getElementById("nombreAdmin")
const claveUsuario = document.getElementById("claveAdmin")
const btnIngresar = document.getElementById("btnIngresar")

const admin = {
  nombreAdmin: "admin",
  claveAdmin: "123"
}

btnIngresar.addEventListener("click", (event)=>{
 event.preventDefault()
 if(nombreUsuario.value === admin.nombreAdmin && claveUsuario.value === admin.claveAdmin){
    window.location.href = "bienvenida.html";
  }else{
    mensajeError.style.display = "block";
  }
})