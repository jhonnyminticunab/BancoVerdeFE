const url = "http://localhost:9001/transaccion/";
const url1 = "http://localhost:9001/transaccion/list";
const urlCta = "http://localhost:9001/cuenta/list";

const contenedor = document.querySelector("tbody");
const select = document.getElementById("idCuenta");

let resultados = "";
let result = "";
let idC = 0;

const modalTransaccion = new bootstrap.Modal(
  document.getElementById("modalTransaccion")
);
const formCuentas = document.querySelector("form");
const idTransaccion = document.getElementById("idTransaccion");
const fechaApertura = document.getElementById("fechaApertura");
const saldoCuenta = document.getElementById("saldoCuenta");
const idCuenta = document.getElementById("idCuenta");

let opcion = "";

btnCrear.addEventListener("click", () => {
  valorTransaccion.value = "";
  tipoTransaccion.value = "0";
  modalTransaccion.show();
  opcion = "crear";
});

const mostrar = (Cuentas) => {
  Cuentas.forEach((Cuenta) => {
    let tc = "Ingreso";
    if (Cuenta.tipo_transaccion === "R") {
      tc = "Retiro";
    }
    resultados += `<tr>              
    <td class="hide">${Cuenta.id_transaccion}</td>
    <td >${Cuenta.fecha_transaccion}</td>
    <td >${Cuenta.valor_transaccion}</td>
    <td >${tc}</td>
    <td >${Cuenta.cuenta.id_cuenta}</td>
    <td class="text-center" width="20%"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
    </tr>`;
  });
  contenedor.innerHTML = resultados;
  idTransaccion.value = parseInt(Cuentas.pop().id_transaccion) + 1;
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

const cuenta = (Cuenta) => {
  Cuenta.forEach((Cuenta) => {
    result += `<option value="${Cuenta.id_cuenta}">${Cuenta.id_cuenta}</option>`;
  });
  select.innerHTML = `<option value="0"> -- seleccione -- </option>` + result;
};
fetch(urlCta)
  .then((response) => response.json())
  .then((data) => cuenta(data))
  .catch((error) => console.log(error));

on(document, "click", ".btnBorrar", (e) => {
  const fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
  console.log(id);

  alertify.confirm(
    "Desea eliminar el Registro ",
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
  const valor = fila.children[2].innerHTML;
  const type = fila.children[3].innerHTML;
  const cta = fila.children[4].innerHTML;

  let tc = "D";
  if (type === "Retiro") {
    tc = "R";
  }

  idTransaccion.value = idForm;
  fechaTransaccion.value = fecha;
  fechaTransaccion.disabled = true;
  valorTransaccion.value = valor;
  tipoTransaccion.value = tc;
  idCuenta.value = cta;
  idCuenta.disabled = true;

  opcion = "editar";
  modalTransaccion.show();
});

on(document, "click", ".close", (e) => {
  modalTransaccion.hide();
});

formCuentas.addEventListener("submit", (e) => {
  e.preventDefault();

  if (opcion == "crear") {
    var f = new Date();
    f.getDate() + "-" + f.getMonth() + "-" + f.getFullYear();
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_transaccion: idTransaccion.value,
        fecha_transaccion: formatDate(f),
        valor_transaccion: valorTransaccion.value,
        tipo_transaccion: tipoTransaccion.value,
        cuenta: {
          id_cuenta: idCuenta.value,
        },
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
        id_transaccion: idTransaccion.value,
        fecha_transaccion: fechaTransaccion.value,
        valor_transaccion: valorTransaccion.value,
        tipo_transaccion: tipoTransaccion.value,
        cuenta: {
          id_cuenta: idCuenta.value,
        },
      }),
    }).then((response) => location.reload());
  }
  modalTransaccion.hide();
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
