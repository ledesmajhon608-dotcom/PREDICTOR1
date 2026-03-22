const API_KEY = "ea232d851cb4197391464e2c61df516b";
let baseDatos = {};

const altitudes = {
    "Pasto": 2527, "Independiente Santa Fe": 2600, "Millonarios": 2600, 
    "Boyacá Chicó": 2810, "Patriotas": 2810, "La Equidad": 2600, "Once Caldas": 2150
};

// Registro de Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(err => console.log(err)); });
}

document.getElementById("liga").onchange = async function() {
    const ligaId = this.value; if(!ligaId) return;
    try {
        const res = await fetch(`https://v3.football.api-sports.io/standings?league=${ligaId}&season=2025`, {
            headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }
        });
        const json = await res.json();
        
        // Verificación de seguridad si la API no responde datos
        if(!json.response || json.response.length === 0) return alert("No hay datos disponibles para esta temporada.");
        
        const data = json.response[0].league.standings[0];
        const loc = document.getElementById("local");
        const vis = document.getElementById("visitante");
        loc.innerHTML = vis.innerHTML = '<option value="">Selecciona equipo...</option>';
        
        data.forEach(t => {
            baseDatos[t.team.name] = {
                hAtk: (t.home.goals.for / (t.home.played || 1)) || 1.0,
                hDef: (t.home.goals.against / (t.home.played || 1)) || 1.0,
                aAtk: (t.away.goals.for / (t.away.played || 1)) || 1.0,
                aDef: (t.away.goals.against / (t.away.played || 1)) || 1.0,
                logo: t.team.logo
            };
            loc.add(new Option(t.team.name, t.team.name));
            vis.add(new Option(t.team.name, t.team.name));
        });
    } catch (e) { console.error("Error API:", e); }
};

function calcularTodo() {
    const lN = document.getElementById("local").value;
    const vN = document.getElementById("visitante").value;
    if(!lN || !vN || lN === vN) return alert("Selecciona dos equipos diferentes");

    const L = baseDatos[lN]; const V = baseDatos[vN];
    
    // Lógica de Altitud y Probabilidades
    let altL = altitudes[lN] || 500; let altV = altitudes[vN] || 500;
    let bonoAlt = (altL - altV > 1500) ? 1.15 : 1.0;

    let expL = L.hAtk * V.aDef * 1.10 * bonoAlt;
    let expV = V.aAtk * L.hDef * 0.90 / bonoAlt;

    // Fórmula de probabilidad (Poisson simplificada)
    let probHT = (1 - Math.exp(-(expL + expV) * 0.44)) * 100;
    let ambos = ((1 - Math.exp(-expL)) * (1 - Math.exp(-expV))) * 100;

    const resContainer = document.getElementById("resultado");
    resContainer.style.display = "block";
    resContainer.innerHTML = `
        <div class="res-card">
            <div style="display:flex; justify-content:space-around; align-items:center; margin-bottom:20px;">
                <img src="${L.logo}" width="50" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));"> 
                <b style="font-size:18px; color:var(--dim);">VS</b> 
                <img src="${V.logo}" width="50" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));">
            </div>
            <div style="text-align:center; margin-bottom:20px;">
                <span style="font-size:11px; color:var(--dim); font-weight:700; letter-spacing:1px;">GOL EN 1er TIEMPO</span>
                <div style="font-size:38px; font-weight:900; color:var(--accent);">${probHT.toFixed(0)}%</div>
                <div class="bar-bg"><div class="bar-fill" style="width:${probHT}%"></div></div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; text-align:center;">
                <div style="background:rgba(15, 23, 42, 0.5); padding:12px; border-radius:15px; border: 1px solid var(--border);">
                    <span style="font-size:10px; color:var(--dim); display:block; margin-bottom:4px;">AMBOS MARCAN</span>
                    <div style="font-size:18px; font-weight:bold; color:#3b82f6;">${ambos.toFixed(0)}%</div>
                </div>
                <div style="background:rgba(15, 23, 42, 0.5); padding:12px; border-radius:15px; border: 1px solid var(--border);">
                    <span style="font-size:10px; color:var(--dim); display:block; margin-bottom:4px;">PROMEDIO GOLES</span>
                    <div style="font-size:18px; font-weight:bold; color:#f59e0b;">${(expL + expV).toFixed(2)}</div>
                </div>
            </div>
        </div>
    `;
}
