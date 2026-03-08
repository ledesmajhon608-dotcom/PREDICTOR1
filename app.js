document.addEventListener("DOMContentLoaded", function(){

const equipos = {
"Liga MX": ["America","Chivas","Tigres","Monterrey"],
"MLS": ["Inter Miami","LA Galaxy","Atlanta United","Seattle Sounders"]
};

const liga = document.getElementById("liga");
const local = document.getElementById("local");
const visitante = document.getElementById("visitante");
const btn = document.getElementById("btnCalcular");

liga.addEventListener("change", function(){

local.innerHTML = '<option value="">Equipo Local</option>';
visitante.innerHTML = '<option value="">Equipo Visitante</option>';

const lista = equipos[liga.value];
if(!lista) return;

lista.forEach(function(equipo){

let opt1 = document.createElement("option");
opt1.value = equipo;
opt1.textContent = equipo;

let opt2 = document.createElement("option");
opt2.value = equipo;
opt2.textContent = equipo;

local.appendChild(opt1);
visitante.appendChild(opt2);

});

});

btn.addEventListener("click", function(){

const equipoLocal = local.value;
const equipoVisitante = visitante.value;

if(!equipoLocal || !equipoVisitante){
alert("Selecciona ambos equipos");
return;
}

if(equipoLocal === equipoVisitante){
alert("Los equipos deben ser diferentes");
return;
}

const probLocal = Math.floor(Math.random()*50)+30;
const probVisita = 100 - probLocal;

document.getElementById("resultado").innerHTML =

"<h2>"+equipoLocal+" vs "+equipoVisitante+"</h2>"+
"<p>Probabilidad Local: "+probLocal+"%</p>"+
"<p>Probabilidad Visita: "+probVisita+"%</p>";

});

});
