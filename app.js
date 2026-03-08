document.addEventListener("DOMContentLoaded", function(){

const equipos = {

"Liga MX":[
{name:"America",ataque:1.4,defensa:0.9,corners:6},
{name:"Chivas",ataque:1.1,defensa:1.1,corners:5},
{name:"Tigres",ataque:1.3,defensa:1.0,corners:6},
{name:"Monterrey",ataque:1.2,defensa:1.0,corners:5}
],

"MLS":[
{name:"Inter Miami",ataque:1.5,defensa:1.3,corners:6},
{name:"LA Galaxy",ataque:1.2,defensa:1.4,corners:5},
{name:"Atlanta United",ataque:1.3,defensa:1.5,corners:6},
{name:"Seattle Sounders",ataque:1.1,defensa:1.2,corners:5}
]

};

const promedioLiga = 1.35;

const liga = document.getElementById("liga");
const local = document.getElementById("local");
const visitante = document.getElementById("visitante");
const btn = document.getElementById("btnCalcular");

liga.addEventListener("change", function(){

local.innerHTML='<option>Equipo Local</option>';
visitante.innerHTML='<option>Equipo Visitante</option>';

equipos[liga.value].forEach(e=>{

let o1=document.createElement("option");
o1.value=e.name;
o1.textContent=e.name;

let o2=document.createElement("option");
o2.value=e.name;
o2.textContent=e.name;

local.appendChild(o1);
visitante.appendChild(o2);

});

});

function poisson(lambda,k){

let p=Math.pow(lambda,k)*Math.exp(-lambda)/factorial(k);
return p;

}

function factorial(n){

if(n==0) return 1;

let r=1;
for(let i=1;i<=n;i++) r*=i;

return r;

}

btn.addEventListener("click", function(){

const ligaSel=liga.value;

const eqLocal=equipos[ligaSel].find(e=>e.name===local.value);
const eqVisit=equipos[ligaSel].find(e=>e.name===visitante.value);

if(!eqLocal||!eqVisit){

alert("Selecciona equipos");
return;

}

const xgLocal=eqLocal.ataque*eqVisit.defensa*promedioLiga;
const xgVisit=eqVisit.ataque*eqLocal.defensa*promedioLiga;

let probLocal=0;
let probEmpate=0;
let probVisit=0;

for(let i=0;i<6;i++){

for(let j=0;j<6;j++){

let p=poisson(xgLocal,i)*poisson(xgVisit,j);

if(i>j) probLocal+=p;
else if(i==j) probEmpate+=p;
else probVisit+=p;

}

}

const ambos=(xgLocal>1 && xgVisit>1)?"SI":"NO";

const corners=eqLocal.corners+eqVisit.corners;

document.getElementById("resultado").innerHTML=

`
<div style="background:#1e1e1e;padding:20px;margin:20px;border-radius:10px">

<h2>${eqLocal.name} vs ${eqVisit.name}</h2>

<p>🏆 Local: ${(probLocal*100).toFixed(1)}%</p>
<p>🤝 Empate: ${(probEmpate*100).toFixed(1)}%</p>
<p>✈️ Visita: ${(probVisit*100).toFixed(1)}%</p>

<p>⚽ xG Local: ${xgLocal.toFixed(2)}</p>
<p>⚽ xG Visitante: ${xgVisit.toFixed(2)}</p>

<p>🔥 Ambos marcan: ${ambos}</p>

<p>🚩 Corners estimados: ${corners}</p>

</div>
`;

});

});
