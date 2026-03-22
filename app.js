const API_KEY = "ea232d851cb4197391464e2c61df516b";
let baseDatos = {};

const altitudes = {
    "Pasto": 2527, "Independiente Santa Fe": 2600, "Millonarios": 2600, 
    "Boyacá Chicó": 2810, "Patriotas": 2810, "La Equidad": 2600, "Once Caldas": 2150
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js'); });
}

document.getElementById("liga").onchange = async function() {
    const ligaId = this.value; if(!ligaId) return;
    try {
        const res = await fetch(`https://v3.football.api-sports.io/standings?league=${ligaId}&season=2025`, {
            headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" }
        });
        const json = await res.json();
        const data = json.response[0].league.standings[0];
        
        const loc = document.getElementById("local");
        const vis = document.getElementById("visitante");
        loc.innerHTML = vis.innerHTML = '<option value="">Selecciona equipo...</option>';
        
        data.forEach(t => {
            baseDatos[t.team.name] = {
                hAtk: t.home.goals.for / (t.home.played || 1),
                hDef: t.home.goals.against / (t.home.played || 1),
                aAtk: t.away.goals.for / (t.away.played || 1),
                aDef: t.away.goals.against / (t.away.played || 1),
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
    if(!lN || !vN) return;

    const L = baseDatos[lN]; const V = baseDatos[vN];
    
    // Factor Altitud Colombia
    let altL = altitudes[lN] || 500; let altV = altitudes[vN] || 500;
    let bonoAlt = (altL - altV > 1500) ? 1.15 : 1.0;

    let expL = L.hAtk * V.aDef * 1.10 * bonoAlt;
    let expV = V.aAtk * L.hDef * 0.90 / bonoAlt;

    let probHT = (1 - Math.exp(-(expL + expV) * 0.44)) * 100;
    let ambos = ((1 - Math.exp(-expL)) * (1 - Math.exp(-expV))) * 100;

    const resContainer = document.getElementById("resultado");
    resContainer.style.display = "block";
    resContainer.innerHTML = `
        <div class="res-card">
            <div style="display:flex; justify-content:space-around; align-items:center; margin-bottom:20px;">
                <img src="${L.logo}" width="45"> <b style="font-size:18px;">VS</b> <img src="${V.logo}" width="45">
            </div>
            <div style="text-align:center; margin-bottom:20px;">
                <span style="font-size:11px; color:var(--dim); font-weight:700;">PROBABILIDAD GOL 1er TIEMPO</span>
                <div style="font-size:36px; font-weight:900; color:var(--accent);">${probHT.toFixed(0)}%</div>
                <div class="bar-bg"><div class="bar-fill" style="width:${probHT}%"></div></div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; text-align:center;">
                <div style="background:#0f172a; padding:10px; border-radius:12px;">
                    <span style="font-size:9px; color:var(--dim);">AMBOS MARCAN</span>
                    <div style="font-weight:bold; color:#3b82f6;">${ambos.toFixed(0)}%</div>
                </div>
                <div style="background:#0f172a; padding:10px; border-radius:12px;">
                    <span style="font-size:9px; color:var(--dim);">EXPECTATIVA GOLES</span>
                    <div style="font-weight:bold; color:#f59e0b;">${(expL + expV).toFixed(2)}</div>
                </div>
            </div>
        </div>
    `;
}
