/* =====================================================
                    PRODUCTOS
===================================================== */

const productos = [

    {
        id: 1,
        nombre: "Presentación Clásica",
        precio: 1.25,
        tamaño: "7 oz",
        imagen: "img/clasica-cutout.png"
    },

    {
        id: 2,
        nombre: "Presentación Especial",
        precio: 1.75,
        tamaño: "9 oz",
        imagen: "img/especial-cutout.png"
    },

    {
        id: 3,
        nombre: "Presentación Premium",
        precio: 2.25,
        tamaño: "12 oz",
        imagen: "img/premium-cutout.png"
    }

];


/* =====================================================
                    CARRITO
===================================================== */

let carrito = JSON.parse(
    localStorage.getItem("carritoCreamBerry")
) || [];


/* =====================================================
                PRODUCTO ACTUAL
===================================================== */

let productoSeleccionadoToppings = null;


/* =====================================================
                GUARDAR CARRITO
===================================================== */

function guardarCarrito() {

    localStorage.setItem(
        "carritoCreamBerry",
        JSON.stringify(carrito)
    );

}


/* =====================================================
            ABRIR SELECTOR DE TOPPINGS
===================================================== */

function abrirSelectorToppings(id) {

    const producto = productos.find(
        producto => producto.id === id
    );

    if (!producto) return;

    productoSeleccionadoToppings = id;


    const nombre =
        document.getElementById(
            "productoToppingNombre"
        );

    if (nombre) {

        nombre.textContent =
            producto.nombre;

    }


    const opciones =
        document.querySelectorAll(
            '#toppingsModal input[name="topping"]'
        );

    opciones.forEach(input => {

        input.checked = false;

    });


    const modalElement =
        document.getElementById(
            "toppingsModal"
        );

    if (!modalElement) return;


    const modal =
        new bootstrap.Modal(
            modalElement
        );

    modal.show();

}


/* =====================================================
            CONFIRMAR TOPPINGS
===================================================== */

function confirmarToppings() {

    if (!productoSeleccionadoToppings) {

        return;

    }


    const producto =
        productos.find(
            producto =>
                producto.id === productoSeleccionadoToppings
        );


    if (!producto) return;


    const opcionesSeleccionadas =
        document.querySelectorAll(
            '#toppingsModal input[name="topping"]:checked'
        );


    let toppings = [];


    opcionesSeleccionadas.forEach(
        opcion => {

            toppings.push(
                opcion.value
            );

        }
    );


    /*
        Si el cliente selecciona "Sin topping",
        eliminamos los demás toppings.
    */

    if (toppings.includes("Sin topping")) {

        toppings = ["Sin topping"];

    }


    /*
        Si no seleccionó ninguno,
        se coloca automáticamente "Sin topping".
    */

    if (toppings.length === 0) {

        toppings = ["Sin topping"];

    }


    agregarProductoConToppings(
        producto,
        toppings
    );


    const modalElement =
        document.getElementById(
            "toppingsModal"
        );


    const modal =
        bootstrap.Modal.getInstance(
            modalElement
        );


    if (modal) {

        modal.hide();

    }


    productoSeleccionadoToppings = null;

}


/* =====================================================
        AGREGAR PRODUCTO CON TOPPINGS
===================================================== */

function agregarProductoConToppings(
    producto,
    toppings
) {

    /*
        Creamos una identificación única
        para el producto + toppings.
    */

    const toppingsOrdenados =
        [...toppings].sort();


    const claveToppings =
        toppingsOrdenados.join("|");


    const productoExistente =
        carrito.find(item =>

            item.id === producto.id &&
            item.claveToppings === claveToppings

        );


    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({

            id: producto.id,

            nombre: producto.nombre,

            precio: producto.precio,

            tamaño: producto.tamaño,

            imagen: producto.imagen,

            toppings: toppingsOrdenados,

            claveToppings: claveToppings,

            cantidad: 1

        });

    }


    guardarCarrito();

    actualizarCarrito();


    mostrarMensaje(
        `${producto.nombre} agregado al carrito 🍓`
    );

}


/* =====================================================
                AUMENTAR CANTIDAD
===================================================== */

function aumentarCantidad(
    id,
    claveToppings
) {

    const producto =
        carrito.find(item =>

            item.id === id &&
            item.claveToppings === claveToppings

        );


    if (producto) {

        producto.cantidad++;

    }


    guardarCarrito();

    actualizarCarrito();

}


/* =====================================================
                DISMINUIR CANTIDAD
===================================================== */

function disminuirCantidad(
    id,
    claveToppings
) {

    const producto =
        carrito.find(item =>

            item.id === id &&
            item.claveToppings === claveToppings

        );


    if (!producto) return;


    if (producto.cantidad > 1) {

        producto.cantidad--;

    } else {

        carrito = carrito.filter(item =>

            !(
                item.id === id &&
                item.claveToppings === claveToppings
            )

        );

    }


    guardarCarrito();

    actualizarCarrito();

}


/* =====================================================
                ELIMINAR PRODUCTO
===================================================== */

function eliminarProducto(
    id,
    claveToppings
) {

    carrito = carrito.filter(item =>

        !(
            item.id === id &&
            item.claveToppings === claveToppings
        )

    );


    guardarCarrito();

    actualizarCarrito();

}


/* =====================================================
                VACIAR CARRITO
===================================================== */

function vaciarCarrito() {

    if (carrito.length === 0) return;


    const confirmar =
        confirm(
            "¿Seguro que deseas vaciar tu carrito?"
        );


    if (!confirmar) return;


    carrito = [];


    guardarCarrito();

    actualizarCarrito();

}


/* =====================================================
                CALCULAR TOTAL
===================================================== */

function calcularTotal() {

    let total = 0;


    carrito.forEach(item => {

        total +=
            item.precio *
            item.cantidad;

    });


    return total;

}


/* =====================================================
            CALCULAR CANTIDAD TOTAL
===================================================== */

function calcularCantidadTotal() {

    let cantidad = 0;


    carrito.forEach(item => {

        cantidad +=
            item.cantidad;

    });


    return cantidad;

}


/* =====================================================
                ACTUALIZAR CARRITO
===================================================== */

function actualizarCarrito() {

    const contenido =
        document.getElementById(
            "carritoContenido"
        );


    const total =
        document.getElementById(
            "totalCarrito"
        );


    const contador =
        document.getElementById(
            "contadorCarrito"
        );


    if (!contenido) return;


    if (contador) {

        contador.textContent =
            calcularCantidadTotal();

    }


    if (carrito.length === 0) {

        contenido.innerHTML = `

            <div class="carrito-vacio">

                <i class="bi bi-cart-x"></i>

                <h4>
                    Tu carrito está vacío
                </h4>

                <p>
                    ¡Agrega unas deliciosas fresas con crema! 🍓
                </p>

            </div>

        `;


        if (total) {

            total.textContent =
                "$0.00";

        }


        return;

    }


    contenido.innerHTML = "";


    carrito.forEach(item => {

        const subtotal =
            item.precio *
            item.cantidad;


        const elemento =
            document.createElement("div");


        elemento.classList.add(
            "carrito-item"
        );


        /*
            Mostrar toppings
        */

        let toppingsTexto =
            "Sin topping";


        if (
            item.toppings &&
            item.toppings.length > 0
        ) {

            if (
                item.toppings.length === 1 &&
                item.toppings[0] === "Sin topping"
            ) {

                toppingsTexto =
                    "Sin topping";

            } else {

                toppingsTexto =
                    item.toppings.join(", ");

            }

        }


        elemento.innerHTML = `

            <div class="carrito-icon">
                <img src="${item.imagen || obtenerImagenProducto(item.id)}" alt="${item.nombre}">
            </div>


            <div class="carrito-info">

                <h5>
                    ${item.nombre}
                </h5>


                <small>
                    ${item.tamaño} ·
                    $${item.precio.toFixed(2)}
                </small>


                <div class="carrito-toppings">

                    <strong>
                        Toppings:
                    </strong>

                    ${toppingsTexto}

                </div>

            </div>


            <div class="cantidad-control">

                <button
                    onclick="disminuirCantidad(
                        ${item.id},
                        '${item.claveToppings}'
                    )"
                >
                    −
                </button>


                <span>
                    ${item.cantidad}
                </span>


                <button
                    onclick="aumentarCantidad(
                        ${item.id},
                        '${item.claveToppings}'
                    )"
                >
                    +
                </button>

            </div>


            <div class="carrito-precio">

                $${subtotal.toFixed(2)}

            </div>


            <button
                class="eliminar-item"
                onclick="eliminarProducto(
                    ${item.id},
                    '${item.claveToppings}'
                )"
            >

                <i class="bi bi-trash3"></i>

            </button>

        `;


        contenido.appendChild(
            elemento
        );

    });


    if (total) {

        total.textContent =
            `$${calcularTotal().toFixed(2)}`;

    }

}


/* =====================================================
                ABRIR CARRITO
===================================================== */

function abrirCarrito() {

    actualizarCarrito();


    const modalElement =
        document.getElementById(
            "carritoModal"
        );


    if (!modalElement) return;


    const modal =
        new bootstrap.Modal(
            modalElement
        );


    modal.show();

}


/* =====================================================
            ABRIR FORMULARIO DE COMPRA
===================================================== */

function abrirFormularioCompra() {

    if (carrito.length === 0) {

        alert(
            "Tu carrito está vacío 🍓"
        );

        return;

    }


    const carritoModal =
        bootstrap.Modal.getInstance(
            document.getElementById(
                "carritoModal"
            )
        );


    if (carritoModal) {

        carritoModal.hide();

    }


    mostrarResumenCompra();


    setTimeout(() => {

        const modalElement =
            document.getElementById(
                "compraModal"
            );


        if (!modalElement) return;


        const modal =
            new bootstrap.Modal(
                modalElement
            );


        modal.show();

    }, 300);

}


/* =====================================================
            MOSTRAR RESUMEN DE COMPRA
===================================================== */

function mostrarResumenCompra() {

    const resumen =
        document.getElementById(
            "resumenCompra"
        );


    const total =
        document.getElementById(
            "totalFormulario"
        );


    if (!resumen || !total) return;


    resumen.innerHTML = "";


    carrito.forEach(item => {

        const subtotal =
            item.precio *
            item.cantidad;


        let toppingsTexto =
            "Sin topping";


        if (
            item.toppings &&
            item.toppings.length > 0 &&
            !(
                item.toppings.length === 1 &&
                item.toppings[0] === "Sin topping"
            )
        ) {

            toppingsTexto =
                item.toppings.join(", ");

        }


        const elemento =
            document.createElement("div");


        elemento.classList.add(
            "summary-item"
        );


        elemento.innerHTML = `

            <div>

                <span>

                    ${item.cantidad}x
                    ${item.nombre}

                </span>


                <small>

                    Toppings:
                    ${toppingsTexto}

                </small>

            </div>


            <strong>

                $${subtotal.toFixed(2)}

            </strong>

        `;


        resumen.appendChild(
            elemento
        );

    });


    total.textContent =
        `$${calcularTotal().toFixed(2)}`;

}


/* =====================================================
                FECHA MÍNIMA
===================================================== */

function configurarFecha() {

    const fecha =
        document.getElementById(
            "fechaCliente"
        );


    if (!fecha) return;


    const hoy =
        new Date();


    const año =
        hoy.getFullYear();


    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoy.getDate()
        ).padStart(2, "0");


    fecha.min =
        `${año}-${mes}-${dia}`;

}


/* =====================================================
            GENERAR NÚMERO DE PEDIDO
===================================================== */

function generarNumeroPedido() {

    let numero =
        localStorage.getItem(
            "numeroPedidoCreamBerry"
        );


    if (!numero) {

        numero = 1;

    } else {

        numero =
            parseInt(numero) + 1;

    }


    localStorage.setItem(
        "numeroPedidoCreamBerry",
        numero
    );


    return `CB-${String(numero).padStart(4, "0")}`;

}


/* =====================================================
                CONFIRMAR PEDIDO
===================================================== */

function confirmarPedido(event) {

    event.preventDefault();


    if (carrito.length === 0) {

        alert(
            "No hay productos en el carrito."
        );

        return;

    }


    const nombre =
        document.getElementById(
            "nombreCliente"
        ).value.trim();


    const telefono =
        document.getElementById(
            "telefonoCliente"
        ).value.trim();


    const correo =
        document.getElementById(
            "correoCliente"
        ).value.trim();


    const sucursal =
        document.getElementById(
            "sucursalCliente"
        ).value;


    const fecha =
        document.getElementById(
            "fechaCliente"
        ).value;


    const hora =
        document.getElementById(
            "horaCliente"
        ).value;


    const metodoPago =
        document.getElementById(
            "metodoPago"
        ).value;


    const comentarios =
        document.getElementById(
            "comentariosCliente"
        ).value.trim();


    if (
        !nombre ||
        !telefono ||
        !sucursal ||
        !fecha ||
        !hora ||
        !metodoPago
    ) {

        alert(
            "Por favor completa todos los campos obligatorios."
        );

        return;

    }


    const numeroPedido =
        generarNumeroPedido();


    const pedido = {

        numero: numeroPedido,


        cliente: {

            nombre,
            telefono,
            correo

        },


        entrega: {

            sucursal,
            fecha,
            hora

        },


        pago: metodoPago,


        comentarios,


        productos:
            JSON.parse(
                JSON.stringify(carrito)
            ),


        total:
            calcularTotal(),


        fechaRegistro:
            new Date().toISOString()

    };


    let pedidos =
        JSON.parse(
            localStorage.getItem(
                "pedidosCreamBerry"
            )
        ) || [];


    pedidos.push(
        pedido
    );


    localStorage.setItem(
        "pedidosCreamBerry",
        JSON.stringify(pedidos)
    );


    document.getElementById(
        "numeroPedido"
    ).textContent =
        numeroPedido;


    carrito = [];


    guardarCarrito();

    actualizarCarrito();


    document.getElementById(
        "formularioCompra"
    ).reset();


    const compraModal =
        bootstrap.Modal.getInstance(
            document.getElementById(
                "compraModal"
            )
        );


    if (compraModal) {

        compraModal.hide();

    }


    setTimeout(() => {

        const exitosoModal =
            new bootstrap.Modal(
                document.getElementById(
                    "pedidoExitosoModal"
                )
            );


        exitosoModal.show();

    }, 400);

}


/* =====================================================
                MENSAJE
===================================================== */

function mostrarMensaje(texto) {

    const alerta =
        document.createElement(
            "div"
        );


    alerta.className =
        "mensaje-carrito";


    alerta.textContent =
        texto;


    document.body.appendChild(
        alerta
    );


    setTimeout(() => {

        alerta.classList.add(
            "mensaje-visible"
        );

    }, 10);


    setTimeout(() => {

        alerta.classList.remove(
            "mensaje-visible"
        );


        setTimeout(() => {

            alerta.remove();

        }, 300);

    }, 2500);

}


/* =====================================================
                LOGIN ADMINISTRADOR
===================================================== */

function iniciarSesionAdmin() {

    const usuarioInput =
        document.getElementById(
            "adminUsuario"
        );


    const contraseñaInput =
        document.getElementById(
            "adminPassword"
        );


    const error =
        document.getElementById(
            "loginError"
        );


    if (
        !usuarioInput ||
        !contraseñaInput
    ) {

        return;

    }


    const usuario =
        usuarioInput.value.trim();


    const contraseña =
        contraseñaInput.value;


    /*
        DATOS DEL ADMINISTRADOR
    */

    const usuarioCorrecto =
        "admincb";


    const contraseñaCorrecta =
        "CBadmin2026!";


    if (
        usuario === usuarioCorrecto &&
        contraseña === contraseñaCorrecta
    ) {

        sessionStorage.setItem(
            "creamBerryAdmin",
            "true"
        );


        if (error) {

            error.style.display =
                "none";

        }


        window.location.href =
            "admin.html";


        return;

    }


    if (error) {

        error.innerHTML =
            '<i class="bi bi-exclamation-circle"></i> Usuario o contraseña incorrectos.';


        error.style.display =
            "block";

    }

}


/* =====================================================
                CERRAR LOGIN
===================================================== */

function cerrarLoginAdmin() {

    const usuario =
        document.getElementById(
            "adminUsuario"
        );


    const contraseña =
        document.getElementById(
            "adminPassword"
        );


    const error =
        document.getElementById(
            "loginError"
        );


    if (usuario) {

        usuario.value = "";

    }


    if (contraseña) {

        contraseña.value = "";

    }


    if (error) {

        error.style.display =
            "none";

    }

}


/* =====================================================
            MOSTRAR / OCULTAR CONTRASEÑA
===================================================== */

function mostrarPasswordAdmin() {

    const password =
        document.getElementById(
            "adminPassword"
        );


    const icono =
        document.getElementById(
            "passwordIcon"
        );


    if (!password) return;


    if (
        password.type === "password"
    ) {

        password.type = "text";


        if (icono) {

            icono.className =
                "bi bi-eye-slash";

        }

    } else {

        password.type =
            "password";


        if (icono) {

            icono.className =
                "bi bi-eye";

        }

    }

}


/* =====================================================
                ENTER EN LOGIN
===================================================== */

function configurarLogin() {

    const password =
        document.getElementById(
            "adminPassword"
        );


    if (!password) return;


    password.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                iniciarSesionAdmin();

            }

        }
    );

}


/* =====================================================
                PROTEGER ADMIN.HTML
===================================================== */

function protegerPanelAdmin() {

    const pagina =
        window.location.pathname
        .toLowerCase();


    if (
        pagina.includes(
            "admin.html"
        )
    ) {

        const acceso =
            sessionStorage.getItem(
                "creamBerryAdmin"
            );


        if (
            acceso !== "true"
        ) {

            window.location.href =
                "login.html";

        }

    }

}


/* =====================================================
                CERRAR SESIÓN ADMIN
===================================================== */

function cerrarSesionAdmin() {

    sessionStorage.removeItem(
        "creamBerryAdmin"
    );


    window.location.href =
        "index.html";

}


/* =====================================================
                INICIAR PÁGINA
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        actualizarCarrito();

        configurarFecha();

        configurarLogin();

        protegerPanelAdmin();


        const formulario =
            document.getElementById(
                "formularioCompra"
            );


        if (formulario) {

            formulario.addEventListener(
                "submit",
                confirmarPedido
            );

        }

    }
);

/* Animaciones suaves al desplazarse */
function configurarAnimacionesElegantes() {
    const elementos = document.querySelectorAll(
        ".reveal-on-scroll, .product-card, .promotion-card, .location-card, .values-grid article, .team-list article"
    );

    if (!elementos.length || !("IntersectionObserver" in window)) {
        elementos.forEach(elemento => elemento.classList.add("is-visible"));
        return;
    }

    document.documentElement.classList.add("motion-ready");
    elementos.forEach(elemento => elemento.classList.add("reveal-on-scroll"));

    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("is-visible");
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    elementos.forEach(elemento => observador.observe(elemento));
}

document.addEventListener("DOMContentLoaded", configurarAnimacionesElegantes);


/* EDITORIAL HOME HERO V8 */
function configurarHeroEditorial() {
    const hero = document.querySelector("[data-editorial-hero]");
    if (!hero) return;

    const slides = [
        { id: 1, tag: "LA FAVORITA", name: "Presentación Clásica", description: "La combinación que siempre se antoja: fresas frescas con nuestra suave crema artesanal.", price: "$1.25", size: "7 oz", detail: "producto-clasica.html", theme: "hero-theme-classic" },
        { id: 2, tag: "UN TOQUE DE CHOCOLATE", name: "Presentación Especial", description: "Nuestra receta tradicional acompañada con una deliciosa lluvia de chispas de chocolate.", price: "$1.75", size: "9 oz", detail: "producto-especial.html", theme: "hero-theme-special" },
        { id: 3, tag: "PARA CONSENTIRTE", name: "Presentación Premium", description: "Una porción más grande, cremosa y especial para disfrutar el antojo completo.", price: "$2.25", size: "12 oz", detail: "producto-premium.html", theme: "hero-theme-premium" }
    ];
    const productSlides = [...hero.querySelectorAll("[data-hero-slide]")];
    const tabs = [...hero.querySelectorAll("[data-hero-index]")];
    const current = hero.querySelector("[data-hero-current]");
    const tag = hero.querySelector("[data-hero-tag]");
    const name = hero.querySelector("[data-hero-name]");
    const description = hero.querySelector("[data-hero-description]");
    const price = hero.querySelector("[data-hero-price]");
    const size = hero.querySelector("[data-hero-size]");
    const detail = hero.querySelector("[data-hero-detail]");
    const add = hero.querySelector("[data-hero-add]");
    let active = 0;
    let timer;

    function mostrar(index) {
        active = (index + slides.length) % slides.length;
        const selected = slides[active];
        productSlides.forEach((slide, i) => slide.classList.toggle("is-active", i === active));
        tabs.forEach((tab, i) => {
            tab.classList.toggle("is-active", i === active);
            tab.setAttribute("aria-selected", String(i === active));
        });
        hero.classList.remove("hero-theme-classic", "hero-theme-special", "hero-theme-premium");
        hero.classList.add(selected.theme);
        current.textContent = String(active + 1).padStart(2, "0");
        tag.textContent = selected.tag;
        name.textContent = selected.name;
        description.textContent = selected.description;
        price.textContent = selected.price;
        size.textContent = selected.size;
        detail.href = selected.detail;
        add.onclick = () => abrirSelectorToppings(selected.id);
    }

    function reiniciar() {
        window.clearInterval(timer);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            timer = window.setInterval(() => mostrar(active + 1), 5500);
        }
    }

    tabs.forEach(tab => tab.addEventListener("click", () => { mostrar(Number(tab.dataset.heroIndex)); reiniciar(); }));
    hero.querySelector("[data-hero-prev]").addEventListener("click", () => { mostrar(active - 1); reiniciar(); });
    hero.querySelector("[data-hero-next]").addEventListener("click", () => { mostrar(active + 1); reiniciar(); });
    hero.addEventListener("mouseenter", () => window.clearInterval(timer));
    hero.addEventListener("mouseleave", reiniciar);
    hero.addEventListener("focusin", () => window.clearInterval(timer));
    hero.addEventListener("focusout", reiniciar);
    mostrar(0);
    reiniciar();
}

document.addEventListener("DOMContentLoaded", configurarHeroEditorial);


/* SPINNING PRODUCTS CAROUSEL V9 */
function configurarCarruselProductos() {
    const menu = document.querySelector("[data-spin-menu]");
    if (!menu) return;

    const items = [
        { id: 1, tag: "LA FAVORITA", name: "Presentación<br>Clásica", description: "Fresas frescas picadas cubiertas con nuestra deliciosa crema dulce artesanal.", size: "7 oz", price: "$1.25", detail: "producto-clasica.html", theme: "spin-menu-classic" },
        { id: 2, tag: "MÁS POPULAR", name: "Presentación<br>Especial", description: "Nuestra receta tradicional acompañada con una deliciosa lluvia de chispas de chocolate.", size: "9 oz", price: "$1.75", detail: "producto-especial.html", theme: "spin-menu-special" },
        { id: 3, tag: "PARA CONSENTIRTE", name: "Presentación<br>Premium", description: "Más fresas y crema en una porción grande, decorada para convertir tu antojo en algo especial.", size: "12 oz", price: "$2.25", detail: "producto-premium.html", theme: "spin-menu-premium" }
    ];
    const slides = [...menu.querySelectorAll("[data-spin-slide]")];
    const tabs = [...menu.querySelectorAll("[data-spin-index]")];
    const current = menu.querySelector("[data-spin-current]");
    const tag = menu.querySelector("[data-spin-tag]");
    const name = menu.querySelector("[data-spin-name]");
    const description = menu.querySelector("[data-spin-description]");
    const size = menu.querySelector("[data-spin-size]");
    const price = menu.querySelector("[data-spin-price]");
    const detail = menu.querySelector("[data-spin-detail]");
    const add = menu.querySelector("[data-spin-add]");
    const orbit = menu.querySelector(".spin-product-orbit");
    let active = 0;
    let startX = null;
    let timer;

    function show(index) {
        active = (index + items.length) % items.length;
        const previous = (active - 1 + items.length) % items.length;
        const next = (active + 1) % items.length;
        slides.forEach((slide, i) => {
            slide.classList.toggle("is-active", i === active);
            slide.classList.toggle("is-prev", i === previous);
            slide.classList.toggle("is-next", i === next);
        });
        tabs.forEach((tab, i) => {
            tab.classList.toggle("is-active", i === active);
            tab.setAttribute("aria-selected", String(i === active));
        });
        const selected = items[active];
        menu.classList.remove("spin-menu-classic", "spin-menu-special", "spin-menu-premium");
        menu.classList.add(selected.theme);
        current.textContent = String(active + 1).padStart(2, "0");
        tag.textContent = selected.tag;
        name.innerHTML = selected.name;
        description.textContent = selected.description;
        size.textContent = selected.size;
        price.textContent = selected.price;
        detail.href = selected.detail;
        add.onclick = () => abrirSelectorToppings(selected.id);
    }

    function restart() {
        window.clearInterval(timer);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = window.setInterval(() => show(active + 1), 6000);
    }

    tabs.forEach(tab => tab.addEventListener("click", () => { show(Number(tab.dataset.spinIndex)); restart(); }));
    menu.querySelector("[data-spin-prev]").addEventListener("click", () => { show(active - 1); restart(); });
    menu.querySelector("[data-spin-next]").addEventListener("click", () => { show(active + 1); restart(); });
    orbit.addEventListener("pointerdown", event => { startX = event.clientX; window.clearInterval(timer); });
    orbit.addEventListener("pointerup", event => {
        if (startX === null) return;
        const distance = event.clientX - startX;
        if (Math.abs(distance) > 45) show(active + (distance < 0 ? 1 : -1));
        startX = null;
        restart();
    });
    orbit.addEventListener("pointercancel", () => { startX = null; restart(); });
    menu.addEventListener("mouseenter", () => window.clearInterval(timer));
    menu.addEventListener("mouseleave", restart);
    show(0);
    restart();
}

document.addEventListener("DOMContentLoaded", configurarCarruselProductos);


/* CUSTOMER SESSION V10 */
function obtenerClienteActual(){
    try{return JSON.parse(sessionStorage.getItem("creamBerryCliente")||"null");}catch(error){return null;}
}
function cerrarSesionCliente(){
    sessionStorage.removeItem("creamBerryCliente");
    window.location.replace("acceso.html");
}
function configurarClienteActual(){
    const cliente=obtenerClienteActual();
    if(!cliente)return;
    document.querySelectorAll("[data-customer-name]").forEach(element=>element.textContent=cliente.name.split(" ")[0]);
    const iniciales=cliente.name.split(/\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase();
    document.querySelectorAll("[data-customer-initial]").forEach(element=>element.textContent=iniciales||"CB");
    const nameInput=document.getElementById("nombreCliente");
    const phoneInput=document.getElementById("telefonoCliente");
    const emailInput=document.getElementById("correoCliente");
    if(nameInput&&!nameInput.value)nameInput.value=cliente.name||"";
    if(phoneInput&&!phoneInput.value)phoneInput.value=cliente.phone||"";
    if(emailInput&&!emailInput.value)emailInput.value=cliente.email||"";
}
document.addEventListener("DOMContentLoaded",configurarClienteActual);


/* INTERACTIVE STRAWBERRY MASCOT V11 */
function configurarMascotaFresita(){
    if(document.querySelector(".berry-helper"))return;
    const page=(window.location.pathname.split("/").pop()||"index.html").toLowerCase();
    const cliente=typeof obtenerClienteActual==="function"?obtenerClienteActual():null;
    const primerNombre=cliente?.name?.split(" ")[0]||"";
    const mensajes={
        "index.html":[
            primerNombre?`¡Holaa, ${primerNombre}! 🍓 Qué gusto tenerte por aquí.`:"¡Holaa! 🍓 Qué gusto tenerte por aquí.",
            "¿Te ayudo a elegir? La Clásica es perfecta para comenzar.",
            "Todos nuestros vasitos pueden personalizarse con tus toppings favoritos ✨",
            "Desliza un poquito más y conoce cómo preparamos tu pedido."
        ],
        "productos.html":[
            "¡Mira esos vasitos! Desliza para conocer las tres presentaciones 👀",
            "La Especial es una de las favoritas: fresas, crema y mucho chocolate.",
            "¿Mucho antojo? La Premium de 12 oz puede ser para ti 🍓",
            "Toca “Elegir toppings” y hazla completamente a tu gusto."
        ],
        "promociones.html":[
            "¡Aquí viven los antojitos para compartir! ✨",
            "Revisa bien cada promoción antes de elegir; puede haber una perfecta para ti.",
            "Una promo sabe mejor cuando se comparte... aunque no es obligatorio JAJAJA 🍓"
        ],
        "nosotros.html":[
            "¡Mucho gusto! Yo soy la fresita de Cream & Berry 🍓",
            "Aquí puedes conocer al equipo que hace posible cada vasito.",
            "Nuestro ingrediente favorito, además de las fresas, es preparar todo con cariño."
        ],
        "sucursales.html":[
            "¿Cuál ubicación te queda más cerca? 📍",
            "Puedes encontrarnos en Ilopango, Alta Vista y Soyapango.",
            "Antes de salir, revisa la información de tu sucursal favorita 🍓"
        ],
        "producto-clasica.html":["La Clásica es sencilla, fresca y deliciosa 🍓","7 oz de puro antojo. ¡No olvides elegir tus toppings!"],
        "producto-especial.html":["Esta es una de mis favoritas 👀","La Especial combina fresas, crema y un toque de chocolate."],
        "producto-premium.html":["¡Aquí sí venías con antojo! JAJAJA 🍓","La Premium tiene 12 oz para disfrutar sin prisas."]
    };
    const lista=mensajes[page]||mensajes["index.html"];
    const helper=document.createElement("aside");
    helper.className="berry-helper";
    helper.setAttribute("aria-label","Mensajes de la mascota de Cream & Berry");
    helper.innerHTML=`<div class="berry-helper-bubble" role="status" aria-live="polite"><span class="berry-helper-label">FRESITA DICE</span><span class="berry-helper-text"></span><button type="button" class="berry-helper-close" aria-label="Minimizar mensajes"><i class="bi bi-x-lg"></i></button></div><button type="button" class="berry-helper-button" aria-label="Abrir mensajes de Fresita"><img src="img/mascota-fresita.png" alt="Fresita, mascota de Cream & Berry"><span class="berry-helper-dot" aria-hidden="true"></span></button>`;
    document.body.appendChild(helper);
    const texto=helper.querySelector(".berry-helper-text");
    const cerrar=helper.querySelector(".berry-helper-close");
    const mascota=helper.querySelector(".berry-helper-button");
    let indice=0;
    let intervalo;
    function mostrarMensaje(){texto.textContent=lista[indice];helper.classList.remove("is-minimized");helper.classList.add("is-speaking");sessionStorage.removeItem("berryMascotMinimized");}
    function siguiente(){indice=(indice+1)%lista.length;texto.animate([{opacity:0,transform:"translateY(5px)"},{opacity:1,transform:"none"}],{duration:350});texto.textContent=lista[indice];}
    function iniciar(){window.clearInterval(intervalo);intervalo=window.setInterval(siguiente,6500);}
    function minimizar(){helper.classList.remove("is-speaking");helper.classList.add("is-minimized");sessionStorage.setItem("berryMascotMinimized","true");window.clearInterval(intervalo);}
    cerrar.addEventListener("click",minimizar);
    mascota.addEventListener("click",()=>{if(helper.classList.contains("is-minimized")||!helper.classList.contains("is-speaking")){mostrarMensaje();iniciar();}else{siguiente();iniciar();}});
    if(sessionStorage.getItem("berryMascotMinimized")==="true"){helper.classList.add("is-minimized");}else{window.setTimeout(()=>{mostrarMensaje();iniciar();},900);}
}
document.addEventListener("DOMContentLoaded",configurarMascotaFresita);


/* CART PRODUCT IMAGES AND TOPPING RULES V12 */
function obtenerImagenProducto(id){
    return productos.find(producto=>producto.id===Number(id))?.imagen||"img/clasica-cutout.png";
}

function normalizarCarritoGuardado(){
    let cambio=false;
    carrito=carrito.filter(item=>item&&productos.some(producto=>producto.id===Number(item.id))).map(item=>{
        const producto=productos.find(producto=>producto.id===Number(item.id));
        const cantidad=Math.max(1,Number.parseInt(item.cantidad,10)||1);
        const toppings=Array.isArray(item.toppings)&&item.toppings.length?item.toppings:["Sin topping"];
        const normalizado={...item,id:producto.id,nombre:producto.nombre,precio:producto.precio,tamaño:producto.tamaño,imagen:producto.imagen,cantidad,toppings,claveToppings:[...toppings].sort().join("|")};
        if(item.emoji||item.imagen!==producto.imagen||item.cantidad!==cantidad)cambio=true;
        delete normalizado.emoji;
        return normalizado;
    });
    if(cambio)guardarCarrito();
}

function configurarOpcionesToppings(){
    const opciones=[...document.querySelectorAll('#toppingsModal input[name="topping"]')];
    opciones.forEach(opcion=>opcion.addEventListener("change",()=>{
        if(!opcion.checked)return;
        if(opcion.value==="Sin topping")opciones.forEach(otra=>{if(otra!==opcion)otra.checked=false;});
        else{const sin=opciones.find(otra=>otra.value==="Sin topping");if(sin)sin.checked=false;}
    }));
}

document.addEventListener("DOMContentLoaded",()=>{
    normalizarCarritoGuardado();
    configurarOpcionesToppings();
    actualizarCarrito();
});
