document.addEventListener("DOMContentLoaded",()=>{
if(!APP.requireRole("consumer"))return;
let stalls=[...HH.stalls];const mine=APP.get("myStall");if(mine)stalls.unshift(mine);
const loc=document.getElementById("filterLocation"),prod=document.getElementById("filterProduce");loc.innerHTML='<option value="">All locations</option>'+HH.locations.map(x=>`<option>${x}</option>`).join("");const names=[...new Set(HH.produce.map(p=>p.name).concat(stalls.flatMap(s=>s.items)))].sort();prod.innerHTML='<option value="">All produce</option>'+names.map(x=>`<option>${x}</option>`).join("");
const profile=APP.get("profile",{});document.getElementById("profileName").value=profile.name||"";document.getElementById("profileOrange").value=profile.orange||"";document.getElementById("profileSmega").value=profile.smega||"";document.getElementById("profileMyzaka").value=profile.myzaka||"";
document.getElementById("profileLocation").innerHTML=HH.locations.map(x=>`<option>${x}</option>`).join("");document.getElementById("profileLocation").value=profile.location||HH.locations[0];
document.getElementById("profilePaymentType").value=profile.paymentType||"wallet";
document.getElementById("profileBank").value=profile.bank||"FNB Botswana";
document.getElementById("profileWallet").value=profile.wallet||"Orange Money";
document.getElementById("profilePaymentDetails").value=profile.paymentDetails||"";
toggleProfilePayment();
const s=HH.currentSeason();document.getElementById("marketSeason").textContent=s.name;
let selectedStall=null;
function render(){const q=document.getElementById("filterSearch").value.toLowerCase(),l=loc.value,p=prod.value;const list=stalls.filter(x=>(!l||x.location===l)&&(!p||x.items.includes(p))&&(!q||x.name.toLowerCase().includes(q)||x.owner.toLowerCase().includes(q)||x.items.join(" ").toLowerCase().includes(q)));document.getElementById("resultCount").textContent=`${list.length} stall${list.length===1?"":"s"} found`;document.getElementById("emptyMarket").classList.toggle("hidden",list.length>0);document.getElementById("stallGrid").innerHTML=list.map(stallCard).join("");document.querySelectorAll("[data-buy]").forEach(b=>b.addEventListener("click",()=>openCheckout(b.dataset.buy)))}
function stallCard(id){const s=stalls.find(x=>x.id===id);return `<article class="stall-card"><div class="stall-image"><span>${s.items[0]?.[0]||"P"}</span><small>${s.location}</small></div><div class="stall-body"><div class="rating"><i class="fa fa-star"></i> ${s.rating}</div><h3>${s.name}</h3><p class="muted small">${s.owner} · ${s.area}</p><p>${s.blurb}</p><div class="item-tags">${s.items.map(i=>`<span>${i}</span>`).join("")}</div><div class="stall-meta"><span><i class="fa fa-truck"></i> ${s.delivery}</span></div><button class="btn btn-primary btn-block" data-buy="${s.id}">Buy from this stall</button></div></article>`}
[loc,prod,document.getElementById("filterSearch")].forEach(x=>x.addEventListener("input",render));document.getElementById("resetFilters").addEventListener("click",()=>{loc.value="";prod.value="";document.getElementById("filterSearch").value="";render()});
document.getElementById("profileLocation").addEventListener("change",()=>{});
document.getElementById("profileForm").addEventListener("submit",e=>{e.preventDefault();APP.set("profile",{name:document.getElementById("profileName").value,location:document.getElementById("profileLocation").value,orange:document.getElementById("profileOrange").value,smega:document.getElementById("profileSmega").value,myzaka:document.getElementById("profileMyzaka").value,paymentType:document.getElementById("profilePaymentType").value,bank:document.getElementById("profileBank").value,wallet:document.getElementById("profileWallet").value,paymentDetails:document.getElementById("profilePaymentDetails").value});APP.toast("Payment details saved")});
function openCheckout(id){selectedStall=stalls.find(x=>x.id===id);document.getElementById("checkoutTitle").textContent=`Order from ${selectedStall.name}`;document.getElementById("checkoutFarmer").textContent=`${selectedStall.owner} · ${selectedStall.location}`;document.getElementById("checkoutProduce").innerHTML=selectedStall.items.map(i=>{const p=HH.produce.find(x=>x.name===i)||{price:20,unit:"unit"};return `<option value="${i}" data-price="${p.price}" data-unit="${p.unit}">${i} — ${APP.money(p.price)}/${p.unit}</option>`}).join("");document.getElementById("checkoutModal").classList.remove("hidden");updateTotal()}
function updateTotal(){const o=document.getElementById("checkoutProduce").selectedOptions[0],qty=Number(document.getElementById("checkoutQty").value)||1;document.getElementById("checkoutTotal").textContent=APP.money(Number(o?.dataset.price||0)*qty)}
function providerLogo(provider){return provider==="Orange Money"?"assets/orange-money.png":provider==="MyZaka"?"assets/myzaka.png":provider==="Smega"?"assets/smega.png":""}
function renderProviderPreview(){
  const type=document.getElementById("checkoutPaymentType").value;
  const provider=type==="bank"?document.getElementById("checkoutBank").value:document.getElementById("checkoutWallet").value;
  const preview=document.getElementById("paymentProviderPreview");
  const logo=providerLogo(provider);
  preview.innerHTML=logo
    ? `<img src="${logo}" alt="${provider} logo"><div><strong>${provider}</strong><small>${type==="bank"?"Bank account":"Mobile wallet"} selected</small></div>`
    : `<div><strong>${provider}</strong><small>Bank account selected</small></div>`;
}
function toggleCheckoutPayment(){
  const bank=document.getElementById("checkoutPaymentType").value==="bank";
  document.getElementById("checkoutBankWrap").classList.toggle("hidden",!bank);
  document.getElementById("checkoutWalletWrap").classList.toggle("hidden",bank);
  document.getElementById("checkoutPaymentDetails").placeholder=bank?"Enter bank account number":"Enter mobile wallet number";
  renderProviderPreview();
}
function toggleProfilePayment(){
  const bank=document.getElementById("profilePaymentType").value==="bank";
  document.getElementById("profileBankWrap").classList.toggle("hidden",!bank);
  document.getElementById("profileWalletWrap").classList.toggle("hidden",bank);
}
document.getElementById("checkoutProduce").addEventListener("change",updateTotal);
document.getElementById("checkoutQty").addEventListener("input",updateTotal);
document.getElementById("checkoutPaymentType").addEventListener("change",toggleCheckoutPayment);
document.getElementById("checkoutBank").addEventListener("change",renderProviderPreview);
document.getElementById("checkoutWallet").addEventListener("change",renderProviderPreview);
document.getElementById("profilePaymentType").addEventListener("change",toggleProfilePayment);
document.getElementById("closeModal").addEventListener("click",()=>document.getElementById("checkoutModal").classList.add("hidden"));
document.getElementById("checkoutModal").addEventListener("click",e=>{if(e.target.id==="checkoutModal")e.currentTarget.classList.add("hidden")});
document.getElementById("confirmCheckout").addEventListener("click",()=>{
  const type=document.getElementById("checkoutPaymentType").value;
  const provider=type==="bank"?document.getElementById("checkoutBank").value:document.getElementById("checkoutWallet").value;
  const details=document.getElementById("checkoutPaymentDetails").value.trim();
  if(!details){APP.toast(`Enter your ${type==="bank"?"bank account number":"mobile wallet number"}`);document.getElementById("checkoutPaymentDetails").focus();return}
  APP.set("lastPayment",{type,provider,details,amount:document.getElementById("checkoutTotal").textContent});
  APP.toast(`Payment completed via ${provider} in simulation`);
  document.getElementById("checkoutModal").classList.add("hidden");
});
toggleCheckoutPayment();
render();
});