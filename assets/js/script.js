let graphMonedas = undefined;
function mensajeError(x) {
    const seccionError = document.getElementById("seccionError");
    seccionError.innerHTML = x;
}
async function buscadorMonedas(x) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${x}`);
        const data = await res.json();
        return data;
    } catch (e) {
        mensajeError(e.message);
    }
}
async function calcular(indicador, clp) {
    const resultado = (clp / indicador.serie[0].valor);
    return resultado.toFixed(2);
}
function refreshResultado(x) {
    const seccionResultado = document.getElementById("seccionResultado");
    seccionResultado.innerHTML = `Resultado: $${x}`;
}
function getMoneda() {
    const tipoMoneda = document.getElementById("tipoMoneda").value;
    return tipoMoneda;
}
function myGraphData(x) {
    const dias = x.serie.slice(0, 10);
    const labels = dias.map((serie) => {
        return serie.fecha;
    });
    const data = dias.map((serie) => {
        const valor = serie.valor;
        return Number(valor);
    });
    const datasets = [
        {
            label: getMoneda(),
            borderColor: "rgb(255, 0, 0)",
            data
        }
    ];
    return { labels, datasets };
}
function loadGraph(x) {
    const data = myGraphData(x);
    const config = {
        type: "line",
        data
    };
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    if (graphMonedas != undefined) {
        graphMonedas.destroy();
    }
    graphMonedas = new Chart(myChart, config);
}
async function buscar() {
    const inputCLP = parseInt(document.getElementById("inputCLP").value);
    const tipoMoneda = document.getElementById("tipoMoneda").value;
    const monedaSeleccionada = await buscadorMonedas(tipoMoneda);
    const calculo = await calcular(monedaSeleccionada, inputCLP);
    refreshResultado(calculo);
    loadGraph(monedaSeleccionada);
}
function onClickBuscar() {
    const buttonBuscar = document.getElementById("buttonBuscar");
    buttonBuscar.addEventListener("click", function () {
        buscar();
    });
}
function limpiar() {
    const x = document.getElementById("inputCLP");
    x.value = "";
}
function cargaInicial() {
    onClickBuscar();
    limpiar();
}
cargaInicial();