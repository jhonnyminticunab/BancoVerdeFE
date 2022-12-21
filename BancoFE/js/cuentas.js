const url = "http://localhost:9001/cuenta/";
const url1 = "http://localhost:9001/cuenta/list";
const urlCustomer = "http://localhost:9001/cliente/list";

const contenedor = document.querySelector("tbody");
const select = document.querySelector("select");

let resultados = "";
let result = "";

const modalCuentas = new bootstrap.Modal(
  document.getElementById("modalCuentas")
);
const formCuentas = document.querySelector("form");
const idCuenta = document.getElementById("idCuenta");
const fechaApertura = document.getElementById("fechaApertura");
const saldoCuenta = document.getElementById("saldoCuenta");
const idCliente = document.getElementById("idCliente");

let opcion = "";

btnCrear.addEventListener("click", () => {
  idCuenta.value = "";
  fechaApertura.value = "";
  saldoCuenta.value = "";
  selCliente.value = "0";
  modalCuentas.show();
  opcion = "crear";
});

const mostrar = (Cuentas) => {
  Cuentas.forEach((Cuenta) => {
    resultados += `<tr>
                        <td >${Cuenta.id_cuenta}</td>
                        <td >${formatDate(Cuenta.fecha_apertura)}</td>
                        <td >${Cuenta.saldo_cuenta}</td>
                        <td >${Cuenta.cliente.nombre_cliente}</td>
                        <td class="hide">${Cuenta.cliente.id_cliente}</td>
                        <td class="text-center" width="20%"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                    </tr>`;
  });
  contenedor.innerHTML = resultados;
};

fetch(url1)
  .then((response) => response.json())
  .then((data) => mostrar(data))
  .catch((error) => console.log(error));

const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) handler(e);
  });
};

const customers = (Customer) => {
  Customer.forEach((Customer) => {
    result += `<option value="${Customer.id_cliente}">${Customer.nombre_cliente}</option>`;
  });
  select.innerHTML = `<option value="0"> -- seleccione -- </option>` + result;
};
fetch(urlCustomer)
  .then((response) => response.json())
  .then((data) => customers(data))
  .catch((error) => console.log(error));

on(document, "click", ".btnBorrar", (e) => {
  const fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
  console.log(id);

  alertify.confirm(
    "Desea eliminar la cuenta " + id,
    function () {
      fetch(url + id, {
        method: "DELETE",
      }).then(() => location.reload());
    },
    function () {
      alertify.error("Cancel");
    }
  );
});

let idForm = 0;
on(document, "click", ".btnEditar", (e) => {
  const fila = e.target.parentNode.parentNode;

  idForm = fila.children[0].innerHTML;
  const fecha = fila.children[1].innerHTML;
  const saldo = fila.children[2].innerHTML;
  const cust = fila.children[4].innerHTML;


  idCuenta.value = idForm;
  idCuenta.disabled = true;
  fechaApertura.value = fecha;
  fechaApertura.disabled = true;
  saldoCuenta.value = saldo;
  selCliente.value = cust;
  selCliente.disabled = true;

  opcion = "editar";
  modalCuentas.show();
});

on(document, "click", ".close", (e) => {
  modalCuentas.hide();
});

formCuentas.addEventListener("submit", (e) => {
  e.preventDefault();

  if (opcion == "crear") {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_cuenta: idCuenta.value,
        fecha_apertura: fechaApertura.value,
        saldo_cuenta: saldoCuenta.value,
        cliente: {
          id_cliente: selCliente.value,
        }
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const nuevoCuenta = [];
        nuevoCuenta.push(data);
        mostrar(nuevoCuenta);
      });
  }
  if (opcion == "editar") {
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_cuenta: idCuenta.value,
        fecha_apertura: fechaApertura.value,
        saldo_cuenta: saldoCuenta.value,
        cliente: {
          id_cliente: selCliente.value,
        }
      }),
    }).then((response) => location.reload());
  }
  modalCuentas.hide();
});

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
