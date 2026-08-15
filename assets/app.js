const APP={
get(key,fallback=null){try{const value=localStorage.getItem("aw:"+key);return value===null?fallback:JSON.parse(value)}catch{return fallback}},
set(key,value){try{localStorage.setItem("aw:"+key,JSON.stringify(value))}catch{}},
account(){return APP.get("account")},
toast(message){let toast=document.querySelector(".toast");if(!toast){toast=document.createElement("div");toast.className="toast";document.body.appendChild(toast)}toast.textContent=message;toast.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>toast.classList.remove("show"),3000)},
requireFarmer(){if(!APP.account()){location.href="signup.html";return false}return true},
signOut(event){event?.preventDefault();localStorage.removeItem("aw:account");location.href="index.html"},
init(){document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());const account=APP.account();document.querySelectorAll("[data-account]").forEach(el=>{el.textContent=account?"Sign out":"Sign up";el.href=account?"#":"signup.html";if(account)el.addEventListener("click",APP.signOut)});const toggle=document.querySelector(".mobile-toggle"),nav=document.querySelector(".nav");if(toggle&&nav)toggle.addEventListener("click",()=>nav.classList.toggle("open"))}
};
document.addEventListener("DOMContentLoaded",APP.init);
