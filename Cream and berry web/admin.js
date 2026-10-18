/* ADMIN ACCESS GUARD V10 */
if (sessionStorage.getItem("creamBerryAdmin") !== "true") {
    window.location.replace("login.html");
}

function cerrarSesionAdminPanel() {
    sessionStorage.removeItem("creamBerryAdmin");
    window.location.replace("login.html");
}

const PRODUCTOS = [
    {
        id: 1,
        nombre: "Presentación Clásica",
        precio: 1.25
    },
    {
        id: 2,
        nombre: "Presentación Especial",
        precio: 1.75
    },
    {
        id: 3,
        nombre: "Presentación Premium",
        precio: 2.25
    }
];

const COSTOS_DEFAULT = {
    1: 0,
    2: 0,
    3: 0
};

function obtenerPedidos() {
    return JSON.parse(
        localStorage.getItem("pedidosCreamBerry")
    ) || [];
}

function obtenerCostos() {
    return JSON.parse(
        localStorage.getItem("costosCreamBerry")
    ) || COSTOS_DEFAULT;
}

function guardarCostos(costos) {
    localStorage.setItem(
        "costosCreamBerry",
        JSON.stringify(costos)
    );
}

function dinero(valor) {
    return `$${Number(valor || 0).toFixed(2)}`;
}

function calcularDatos() {
    const pedidos = obtenerPedidos();

    let ingresos = 0;
    let productosVendidos = 0;
    const productos = {};
    const pagos = {};

    PRODUCTOS.forEach(producto => {
        productos[producto.id] = {
            nombre: producto.nombre,
            cantidad: 0
        };
    });

    pedidos.forEach(pedido => {
        ingresos += Number(pedido.total || 0);

        const metodo = pedido.pago || "No especificado";
        pagos[metodo] = (pagos[metodo] || 0) + 1;

        (pedido.productos || []).forEach(item => {
            productosVendidos += Number(item.cantidad || 0);

            if (!productos[item.id]) {
                productos[item.id] = {
                    nombre: item.nombre,
                    cantidad: 0
                };
            }

            productos[item.id].cantidad += Number(item.cantidad || 0);
        });
    });

    return {
        pedidos,
        ingresos,
        productosVendidos,
        productos,
        pagos
    };
}

function renderKPIs(datos) {
    document.getElementById("ventasTotales").textContent =
        dinero(datos.ingresos);

    document.getElementById("cantidadPedidos").textContent =
        datos.pedidos.length;

    document.getElementById("productosVendidos").textContent =
        datos.productosVendidos;

    const promedio = datos.pedidos.length
        ? datos.ingresos / datos.pedidos.length
        : 0;

    document.getElementById("ticketPromedio").textContent =
        dinero(promedio);
}

function renderProductos(datos) {
    const contenedor =
        document.getElementById("productosChart");

    const lista = Object.values(datos.productos)
        .sort((a, b) => b.cantidad - a.cantidad);

    const maximo = Math.max(
        ...lista.map(producto => producto.cantidad),
        1
    );

    contenedor.innerHTML = lista.map(producto => {
        const porcentaje =
            (producto.cantidad / maximo) * 100;

        return `
            <div class="product-row">
                <div class="product-name">
                    ${producto.nombre}
                </div>

                <div class="bar-track">
                    <div
                        class="bar-fill"
                        style="width: ${porcentaje}%"
                    ></div>
                </div>

                <div class="product-count">
                    ${producto.cantidad}
                </div>
            </div>
        `;
    }).join("");
}

function renderPagos(datos) {
    const contenedor =
        document.getElementById("pagosChart");

    const entradas = Object.entries(datos.pagos);

    if (!entradas.length) {
        contenedor.innerHTML = `
            <div class="empty-mini">
                Todavía no hay pagos registrados.
            </div>
        `;
        return;
    }

    entradas.sort((a, b) => b[1] - a[1]);

    contenedor.innerHTML = entradas.map(([metodo, cantidad]) => `
        <div class="payment-row">
            <span class="payment-name">
                ${metodo}
            </span>

            <span class="payment-value">
                ${cantidad} pedido${cantidad === 1 ? "" : "s"}
            </span>
        </div>
    `).join("");
}

function renderCostInputs(datos) {
    const contenedor =
        document.getElementById("costInputs");

    const costos = obtenerCostos();

    contenedor.innerHTML = PRODUCTOS.map(producto => `
        <div class="cost-card">
            <label>${producto.nombre}</label>

            <small>
                Precio de venta: ${dinero(producto.precio)}
            </small>

            <input
                class="cost-input"
                type="number"
                min="0"
                step="0.01"
                value="${Number(costos[producto.id] || 0).toFixed(2)}"
                data-product-id="${producto.id}"
                onchange="actualizarFinanzas()"
                aria-label="Costo unitario de ${producto.nombre}"
            >

            <small>
                Costo unitario
            </small>
        </div>
    `).join("");

    actualizarFinanzas();
}

function actualizarFinanzas() {
    const datos = calcularDatos();
    const inputs =
        document.querySelectorAll(".cost-input");

    const costos = {};

    inputs.forEach(input => {
        costos[input.dataset.productId] =
            Number(input.value) || 0;
    });

    guardarCostos(costos);

    let costoTotal = 0;

    Object.entries(datos.productos).forEach(([id, item]) => {
        costoTotal +=
            item.cantidad *
            Number(costos[id] || 0);
    });

    const ganancia =
        datos.ingresos - costoTotal;

    document.getElementById("financeRevenue").textContent =
        dinero(datos.ingresos);

    document.getElementById("financeCosts").textContent =
        dinero(costoTotal);

    document.getElementById("financeProfit").textContent =
        dinero(ganancia);
}

function renderPedidos(datos) {
    const tbody =
        document.getElementById("ordersTableBody");

    const empty =
        document.getElementById("emptyOrders");

    if (!datos.pedidos.length) {
        tbody.innerHTML = "";
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    const pedidosOrdenados =
        [...datos.pedidos].reverse();

    tbody.innerHTML = pedidosOrdenados.map(pedido => {

        const productos = (pedido.productos || [])
            .map(item =>
                `${item.cantidad}x ${item.nombre}`
            )
            .join("<br>");

        return `
            <tr>
                <td>
                    <span class="order-id">
                        ${pedido.numero || "Sin número"}
                    </span>
                </td>

                <td>
                    ${pedido.cliente?.nombre || "Sin nombre"}
                </td>

                <td>
                    ${pedido.entrega?.sucursal || "No indicada"}
                </td>

                <td>
                    <div class="product-list">
                        ${productos || "Sin productos"}
                    </div>
                </td>

                <td>
                    ${pedido.pago || "No indicado"}
                </td>

                <td>
                    <span class="order-total">
                        ${dinero(pedido.total)}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

function renderDashboard() {
    const datos = calcularDatos();

    renderKPIs(datos);
    renderProductos(datos);
    renderPagos(datos);
    renderCostInputs(datos);
    renderPedidos(datos);
}

function borrarPedidos() {
    const pedidos = obtenerPedidos();

    if (!pedidos.length) {
        alert("No hay pedidos para borrar.");
        return;
    }

    const confirmar = confirm(
        "¿Seguro que deseas borrar todos los pedidos? Esta acción no se puede deshacer."
    );

    if (!confirmar) {
        return;
    }

    localStorage.removeItem("pedidosCreamBerry");
    renderDashboard();

    alert("Los pedidos fueron eliminados.");
}

document.addEventListener(
    "DOMContentLoaded",
    renderDashboard
);
