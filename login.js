/* =====================================================
                CONFIGURACIÓN ADMIN
===================================================== */

const ADMIN_USUARIO = "admincb";

const ADMIN_PASSWORD = "CBadmin2026!";


/* =====================================================
                ELEMENTOS
===================================================== */

const loginForm =
    document.getElementById("loginForm");

const usuarioInput =
    document.getElementById("usuario");

const passwordInput =
    document.getElementById("password");

const loginError =
    document.getElementById("loginError");

const mostrarPassword =
    document.getElementById("mostrarPassword");


/* =====================================================
                COMPROBAR SESIÓN
===================================================== */

if (
    sessionStorage.getItem("creamBerryAdmin") === "true"
) {

    window.location.href = "admin.html";

}


/* =====================================================
                INICIAR SESIÓN
===================================================== */

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const usuario =
            usuarioInput.value.trim();

        const password =
            passwordInput.value;


        if (
            usuario === ADMIN_USUARIO &&
            password === ADMIN_PASSWORD
        ) {

            sessionStorage.setItem(
                "creamBerryAdmin",
                "true"
            );


            window.location.href =
                "admin.html";

            return;

        }


        loginError.classList.add("show");

        passwordInput.value = "";

        passwordInput.focus();

    }
);


/* =====================================================
                MOSTRAR CONTRASEÑA
===================================================== */

mostrarPassword.addEventListener(
    "click",
    function () {

        const mostrando =
            passwordInput.type === "text";


        if (mostrando) {

            passwordInput.type = "password";

            mostrarPassword.innerHTML =
                '<i class="bi bi-eye"></i>';

        } else {

            passwordInput.type = "text";

            mostrarPassword.innerHTML =
                '<i class="bi bi-eye-slash"></i>';

        }

    }
);


/* =====================================================
                OCULTAR ERROR
===================================================== */

usuarioInput.addEventListener(
    "input",
    function () {

        loginError.classList.remove("show");

    }
);


passwordInput.addEventListener(
    "input",
    function () {

        loginError.classList.remove("show");

    }
);