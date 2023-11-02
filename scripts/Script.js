//constantes de post
const ADDUSER = document.getElementById("btnPost");
const ADDUSERNAME = document.getElementById("inputPostNombre");
const ADDUSERLASTNAME = document.getElementById("inputPostApellido");
//constantes de post
const inputId = document.getElementById("inputGet1Id");
const botonBuscar = document.getElementById("btnGet1");
const BUTTONDELETE = document.getElementById("btnDelete");
const Modificar = document.getElementById("btnPut");
const INPUTPUT = document.getElementById("inputPutId");

const URL = "https://6542be6201b5e279de1f826f.mockapi.io/users/";
let objetoUser = [];
let user = {};
function peticion(url, opts) {
	let result = {};
	return fetch(url, opts)
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw Error(response.statusText);
			}
		})
		.then(function (response) {
			result.status = "ok";
			result.data = response;

			return result;
		})
		.catch(function (error) {
			result.status = "error";
			result.data = error;

			return result;
		});
}

document.addEventListener("DOMContentLoaded", function () {
	peticion(URL).then(function (resultObj) {
		if (resultObj.status === "ok") {
			objetoUser = resultObj.data;
			console.log(objetoUser);
		}
	});
});
function mostrar() {
	for (let i of objetoUser) {
		document.getElementById("results").innerHTML += `<p>id: ${i.id}<br>name:${i.name}<br>lastname: ${i.lastname}</p>
		`;
	}
}
function mostrarUser() {
	document.getElementById(
		"results"
	).innerHTML = `<p>id: ${user.id}<br>name:${user.name}<br>lastname: ${user.lastname}</p>
		`;
}
//====================================[Metodo GET]==================================

function peticionGet() {
	if (inputId.value == "") {
		peticion(URL).then(function (resultObj) {
			if (resultObj.status === "ok") {
				objetoUser = resultObj.data;
				document.getElementById("alert-error").classList.remove("show");
				mostrar();
			}
		});
	}
}

function peticionGetId(id) {
	peticion(URL + id).then(function (resu) {
		if (resu.status === "ok") {
			user = resu.data;
			document.getElementById("alert-error").classList.remove("show");
			mostrarUser();
		} else {
			document.getElementById("alert-error").classList.add("show");
		}
	});
}
botonBuscar.addEventListener("click", function () {
	document.getElementById("results").innerHTML = "";
	if (inputId.value == "") {
		peticionGet();
	} else {
		peticionGetId(inputId.value);
	}
});
//====================================[FIN METODO GET]==================================

//====================================[Metodo POST]==================================

ADDUSERLASTNAME.addEventListener("input", () => {
	if (ADDUSERLASTNAME.value !== "" && ADDUSERNAME.value !== "") {
		ADDUSER.disabled = false;
	} else {
		ADDUSER.disabled = true;
	}
});
// Metodo Post
ADDUSER.addEventListener("click", () => {
	document.getElementById("results").innerHTML = "";
	let postedarray = objetoUser;
	const name = ADDUSERNAME.value;
	const lastname = ADDUSERLASTNAME.value;
	// Crea la nueva entrada de usuario
	const newUser = {
		name,
		lastname,
		id: postedarray.length + 1,
	};
	// Limpia los campos
	ADDUSERLASTNAME.textContent = "";
	ADDUSERNAME.textContent = "";
	// Opciones POST para el Fetch
	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json", // Puedes ajustar el encabezado según tus necesidades
		},
		body: JSON.stringify(newUser), // Convierte los datos a formato JSON
	};
	// Se realiza petición FETCH con Método POST y LUEGO HACEMOS OTRA PETICION GET QUE TRAERA A TODOS LOS USUARIOS
	peticion(URL, requestOptions).then(() => {
		peticionGet();
	});
});
//====================================[FIN METODO POST]==================================

//===========================[METODO PUT]=========================
// Traemos campos del modal
const NombrePUT = document.getElementById("inputPutNombre");
const ApellidoPUT = document.getElementById("inputPutApellido");
const Guardarbtn = document.getElementById("btnSendChanges");
// Habilitamos botón de Modificar
INPUTPUT.addEventListener("input", function () {
	if (INPUTPUT.value !== "") {
		Modificar.disabled = false;
	} else {
		Modificar.disabled = true;
	}
});
// Cuando habilitamos el botón, este hace aparecer el modal
Modificar.addEventListener("click", () => {
	document.getElementById("dataModal").style.opacity = "1";
	document.getElementById("dataModal").style.display = "block";
});

ApellidoPUT.addEventListener("input", () => {
	if (NombrePUT.value !== "" && ApellidoPUT.value !== "") {
		Guardarbtn.disabled = false;
	} else {
		Guardarbtn.disabled = true;
	}
});
Guardarbtn.addEventListener("click", () => {
	document.getElementById("results").innerHTML = "";
	let name = NombrePUT.value;
	let lastname = ApellidoPUT.value;
	let modifieduser;
	for (let i of objetoUser) {
		if (INPUTPUT.value == i.id) {
			modifieduser = {
				id: i.id,
				name: name,
				lastname: lastname,
			};
		}
	}
	const OptionsPUT = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json", // Puedes ajustar el encabezado según tus necesidades
		},
		body: JSON.stringify(modifieduser), // Convierte los datos a formato JSON
	};
	// Cierra el modal
	document.getElementById("dataModal").style.opacity = "0";
	document.getElementById("dataModal").style.display = "none";
	peticion(URL + INPUTPUT.value, OptionsPUT).then((resu) => {
		if(resu.status=="ok"){
			
		peticionGet();
	}else{
		document.getElementById("alert-error").classList.add("show");
	}
	});
});

//=========================[FIN METODO PUT]=============================

//====================================[Metodo DELETE]==================================
const inputdelete = document.getElementById("inputDelete");
inputdelete.addEventListener("input", () => {
	if (inputdelete.value !== "") {
		BUTTONDELETE.disabled = false;
	} else {
		BUTTONDELETE.disabled = true;
	}
});

BUTTONDELETE.addEventListener("click", () => {
	document.getElementById("results").innerHTML = "";

	let newarray = [];
	for (let i = 0; i < objetoUser.length; i++) {
		if (inputId.value == objetoUser[i].id) {
			objetoUser.splice(i, 1);
			newarray = objetoUser;
			console.log(newarray);
		}
	}
	// Opciones FETCH para DELETE
	const optsdelete = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json", // Puedes ajustar el encabezado según tus necesidades
		},
		body: JSON.stringify(newarray), // Convierte los datos a formato JSON
	};
	// Se modifica el Endpoint del Fetch, y se le agrega las opciones al Fetch
	peticion(URL + inputdelete.value, optsdelete).then(() => {
		peticionGet();
	});

	// Se muestran los valores en pantalla
});
//====================================[FIN METODO DELETE]==================================
