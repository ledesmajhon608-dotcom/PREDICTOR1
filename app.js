const partidos = [

{
liga:"Liga MX",
local:"America",
visitante:"Chivas",
prob_local:55,
prob_empate:25,
prob_visita:20
},

{
liga:"MLS",
local:"Inter Miami",
visitante:"LA Galaxy",
prob_local:60,
prob_empate:20,
prob_visita:20
}

];

const contenedor = document.getElementById("partidos");

partidos.forEach(p => {

contenedor.innerHTML += `
<div class="card">

<h2>${p.local} vs ${p.visitante}</h2>

<p>${p.liga}</p>

<p>Local: ${p.prob_local}%</p>
<p>Empate: ${p.prob_empate}%</p>
<p>Visita: ${p.prob_visita}%</p>

</div>
`;

});
