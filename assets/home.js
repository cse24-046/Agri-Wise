document.addEventListener("DOMContentLoaded",()=>{
const s=HH.currentSeason();
document.getElementById("heroSeason").textContent=s.name;
document.getElementById("heroMonths").textContent=s.months;
document.getElementById("seasonName").textContent=s.name;
document.getElementById("seasonMonths").textContent=s.months;
document.getElementById("seasonNote").textContent=s.note;
const grid=document.getElementById("seasonGrid");
grid.innerHTML=HH.seasonalProduce().map(p=>`<article class="produce-card"><div class="produce-icon">${p.name[0]}</div><h4>${p.name}</h4><strong>${APP.money(p.price)}</strong><span> / ${p.unit}</span><small class="trend ${p.trend}">${p.trend==="up"?"Rising":p.trend==="down"?"Easing":"Steady"}</small></article>`).join("");
});