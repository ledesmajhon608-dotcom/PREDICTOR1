const API_KEY = "ea232d851cb4197391464e2c61df516b";
let baseDatos = {};

// 1. Cargar equipos desde la API
document.getElementById("liga").onchange = async function() {
    const ligaId = this.value;
    const res = await fetch(`https://v3.football.api-sports.io/standings?league=${ligaId}&season=2024`, {
        headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }
    });
    const json = await res.json();
    procesarData(json.response[0].league.standings[0]);
};

function procesarData(data) {
    const loc = document.getElementById("local");
    const vis = document.getElementById("visitante");
    loc.innerHTML = vis.innerHTML = "";
    data.forEach(t => {
        baseDatos[t.team.name] = {
            hAtk: t.home.goals.for / t.home.played,
            hDef: t.home.goals.against / t.home.played,
            aAtk: t.away.goals.for / t.away.played,
            aDef: t.away.goals.against / t.away.played,
            logo: t.team.logo
        };
        loc.add(new Option(t.team.name, t.team.name));
        vis.add(new Option(t.team.name, t.team.name));
    });
}

// 2. Lógica de Predicción
function poisson(lambda, k) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / (k <= 1 ? 1 : Array.from({length: k}, (_, i) => i + 1).reduce((a, b) => a * b));
}

function calcularTodo() {
    const lN = document.getElementById("local").value;
    const vN = document.getElementById("visitante").value;
    const L = baseDatos[lN]; const V = baseDatos[vN];

    const expL = L.hAtk * V.aDef * 1.10;
    const expV = V.aAtk * L.hDef * 0.90;

    // Probabilidad Gol 1er Tiempo (44% de expectativa total)
    const probHT = (1 - Math.exp(-(expL + expV) * 0.44)) * 100;

    document.getElementById("resultado").style.display = "block";
    document.getElementById("resultado").innerHTML = `
        <div class="res-card">
            <h3 style="text-align:center">${lN} vs ${vN}</h3>
            <p>Probabilidad Gol 1er Tiempo: <b>${probHT.toFixed(0)}%</b></p>
            <div class="bar-outer"><div class="bar-inner" style="width:${probHT}%"></div></div>
        </div>
    `;
}

// 3. REGISTRO PARA ACTUALIZACIÓN AUTOMÁTICA (PWA)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => console.log("App lista."));
}
