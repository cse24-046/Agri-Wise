const APP={
get(key,fallback=null){try{const v=localStorage.getItem("hh:"+key);return v===null?fallback:JSON.parse(v)}catch{return fallback}},
set(key,value){try{localStorage.setItem("hh:"+key,JSON.stringify(value))}catch{}},
money(n){return "P"+Number(n||0).toLocaleString("en-BW",{minimumFractionDigits:2,maximumFractionDigits:2})},
account(){return APP.get("account",null)},
toast(message){let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=message;t.classList.add("show");clearTimeout(t.timer);t.timer=setTimeout(()=>t.classList.remove("show"),3000)},
requireRole(role){const a=APP.account();if(!a){location.href="signup.html?role="+role;return false}if(a.role!==role){location.href=a.role==="farmer"?"farmer.html":"market.html";return false}return true},
signOut(e){if(e)e.preventDefault();localStorage.removeItem("hh:account");location.href="index.html"},
init(){
document.querySelectorAll("[data-year]").forEach(x=>x.textContent=new Date().getFullYear());
const a=APP.account();
document.querySelectorAll("[data-role]").forEach(x=>{if(a&&x.dataset.role!==a.role)x.style.display="none"});
document.querySelectorAll("[data-account]").forEach(x=>{x.textContent=a?"Sign out ("+(a.name||a.role)+")":"Sign in";if(a)x.addEventListener("click",APP.signOut)});
const toggle=document.querySelector(".mobile-toggle"),nav=document.querySelector(".nav");if(toggle&&nav)toggle.addEventListener("click",()=>nav.classList.toggle("open"));
}
};
document.addEventListener("DOMContentLoaded",APP.init);