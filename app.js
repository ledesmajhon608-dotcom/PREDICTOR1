document.addEventListener("DOMContentLoaded", function(){

const equipos = {

"Liga MX":[
{name:"America",ataque:1.8,defensa:0.9,corners:6},
{name:"Chivas",ataque:1.4,defensa:1.2,corners:5},
{name:"Tigres",ataque:1.7,defensa:1.0,corners:6},
{name:"Monterrey",ataque:1.6,defensa:1.1,corners:5}
],

"MLS":[
{name:"Inter Miami",ataque:1.9,defensa:1.3,corners:6},
{name:"LA Galaxy",ataque:1.5,defensa:1.4,corners:5},
{name:"Atlanta United",ataque:1.6,defensa:1.5,corners:6},
{name:"Seattle Sounders",ataque:1.4,defensa:1.2,corners:5}
]

};

const liga = document.getElementById("liga");
const local = document.getElementById("local");
const visitante = document.getElementById("visitante");
const btn = document.getElementById("btnCalcular");

liga.addEventListener("change", function(){

local.innerHTML = '<option value="">Equipo Local</option>';
visitante.innerHTML = '<option value="">Equipo Visitante</option>';

equipos[liga.value].forEach(e=>{

let o1 = document.createElement("option");
o1.value = e.name;
o1.textContent = e.name;

let o2 = document.createElement("option");
o2.value = e.name;
o2.textContent = e.name;

local.appendChild(o1);
visitante.appendChild(o2);

});

});

btn.addEventListener("click", function(){

const ligaSel = liga.value;

const eqLocal = equipos[ligaSel].find(e=>e.name===local.value);
const eqVisit = equipos[ligaSel].find(e=>e.name===visitante.value);

if(!eqLocal || !eqVisit){
alert("Selecciona equipos");
return;
}

const golesLocal = (eqLocal.ataque * eqVisit.defensa).toFixed(2);
const golesVisit = (eqVisit.ataque * eqLocal.defensa).toFixed(2);

const probLocal = Math.round((golesLocal/(golesLocal*1+golesVisit))*100);
const probVisita = 100-probLocal;

const ambos = (golesLocal>1 && golesVisit>1) ? "SI" : "NO";

const corners = eqLocal.corners + eqVisit.corners;

document.getElementById("resultado").innerHTML = `

<div style="background:#1e1e1e;padding:20px;margin:20px;border-radius:10px">

<h2>${eqLocal.name} vs ${eqVisit.name}</h2>

<p>🏆 Probabilidad Local: ${probLocal}%</p>
<p>✈️ Probabilidad Visita: ${probVisita}%</p>

<p>⚽ Goles esperados Local: ${golesLocal}</p>
<p>⚽ Goles esperados Visitante: ${golesVisit}</p>

<p>🔥 Ambos marcan: ${ambos}</p>

<p>🚩 Corners estimados: ${corners}</p>

</div>

`;

});

});
