const equipos = {

"Liga MX":[
"America",
"Chivas",
"Tigres",
"Monterrey"
],

"MLS":[
"Inter Miami",
"LA Galaxy",
"Atlanta United",
"Seattle Sounders"
]

};

const ligaSelect = document.getElementById("liga");
const localSelect = document.getElementById("local");
const visitanteSelect = document.getElementById("visitante");

ligaSelect.addEventListener("change", function(){

const liga = ligaSelect.value;

localSelect.innerHTML = '<option>Equipo Local</option>';
visitanteSelect.innerHTML = '<option>Equipo Visitante</option>';

if(!equipos[liga]) return;

equipos[liga].forEach(function(e){

localSelect.innerHTML += `<option value="${e}">${e}</option>`;
visitanteSelect.innerHTML += `<option value="${e}">${e}</option>`;

});

});

function calcular(){

const local = localSelect.value;
const visitante = visitanteSelect.value;

if(local === visitante){
alert("Selecciona equipos diferentes");
return;
}

const probLocal = Math.floor(Math.random()*50)+30;
const probVisita = 100 - probLocal;
const goles = (Math.random()*3).toFixed(1);
const ambos = Math.random() > 0.5 ? "SI" : "NO";
const corners = Math.floor(Math.random()*10)+5;

document.getElementById("resultado").innerHTML = `

<div class="card">

<h2>${local} vs ${visitante}</h2>

<p>🏆 Probabilidad Local: ${probLocal}%</p>
<p>✈️ Probabilidad Visita: ${probVisita}%</p>

<p>⚽ Goles esperados: ${goles}</p>
<p>🔥 Ambos marcan: ${ambos}</p>
<p>🚩 Corners estimados: ${corners}</p>

</div>

`;

}
