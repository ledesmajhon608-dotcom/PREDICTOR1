const equipos = {
"Liga MX": ["America","Chivas","Tigres","Monterrey"],
"MLS": ["Inter Miami","LA Galaxy","Atlanta United","Seattle Sounders"]
};

const liga = document.getElementById("liga");
const local = document.getElementById("local");
const visitante = document.getElementById("visitante");

liga.onchange = function(){

local.innerHTML = "";
visitante.innerHTML = "";

const lista = equipos[liga.value];

if(!lista) return;

for(let i=0;i<lista.length;i++){

let option1 = document.createElement("option");
option1.text = lista[i];

let option2 = document.createElement("option");
option2.text = lista[i];

local.add(option1);
visitante.add(option2);

}

}

function calcular(){

const equipoLocal = local.value;
const equipoVisitante = visitante.value;

const probLocal = Math.floor(Math.random()*50)+30;
const probVisita = 100 - probLocal;

document.getElementById("resultado").innerHTML =

"<h2>"+equipoLocal+" vs "+equipoVisitante+"</h2>"+
"<p>Probabilidad Local: "+probLocal+"%</p>"+
"<p>Probabilidad Visita: "+probVisita+"%</p>";

}
