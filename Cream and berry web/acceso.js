const tabs = [...document.querySelectorAll("[data-access-tab]")];
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("customerLoginForm");
const title = document.getElementById("accessTitle");
const description = document.getElementById("accessDescription");

if (sessionStorage.getItem("creamBerryCliente")) window.location.replace("index.html");

function encodePassword(value){return btoa(unescape(encodeURIComponent(value)));}
function getCustomers(){return JSON.parse(localStorage.getItem("clientesCreamBerry") || "[]");}
function saveSession(customer){sessionStorage.setItem("creamBerryCliente",JSON.stringify({name:customer.name,phone:customer.phone,email:customer.email}));window.location.replace("index.html");}
function showError(element,message){element.textContent=message;element.classList.add("show");}

tabs.forEach(tab=>tab.addEventListener("click",()=>{
    const registering=tab.dataset.accessTab==="register";
    tabs.forEach(item=>item.classList.toggle("is-active",item===tab));
    registerForm.hidden=!registering;loginForm.hidden=registering;
    title.textContent=registering?"Crea tu cuenta":"Qué gusto verte";
    description.textContent=registering?"Solo te tomará un momento. Tus datos se guardan localmente en este navegador.":"Ingresa con la cuenta que registraste en este dispositivo.";
}));

registerForm.addEventListener("submit",event=>{
    event.preventDefault();
    const error=document.getElementById("registerError");error.classList.remove("show");
    const customer={name:document.getElementById("registerName").value.trim(),phone:document.getElementById("registerPhone").value.trim(),email:document.getElementById("registerEmail").value.trim().toLowerCase(),password:encodePassword(document.getElementById("registerPassword").value)};
    const customers=getCustomers();
    if(customers.some(item=>item.email===customer.email)){showError(error,"Ese correo ya está registrado. Usa la opción ‘Ya tengo cuenta’.");return;}
    customers.push(customer);localStorage.setItem("clientesCreamBerry",JSON.stringify(customers));saveSession(customer);
});

loginForm.addEventListener("submit",event=>{
    event.preventDefault();
    const error=document.getElementById("loginCustomerError");error.classList.remove("show");
    const email=document.getElementById("customerEmail").value.trim().toLowerCase();
    const password=encodePassword(document.getElementById("customerPassword").value);
    const customer=getCustomers().find(item=>item.email===email&&item.password===password);
    if(!customer){showError(error,"Correo o contraseña incorrectos en este dispositivo.");return;}
    saveSession(customer);
});
