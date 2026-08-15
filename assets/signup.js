document.addEventListener("DOMContentLoaded",()=>{
const loc=document.getElementById("location");loc.innerHTML=HH.locations.map(x=>`<option>${x}</option>`).join("");
const params=new URLSearchParams(location.search);const requested=params.get("role");
if(requested==="consumer")selectRole("consumer");
document.querySelectorAll("[data-role-choice]").forEach(b=>b.addEventListener("click",()=>selectRole(b.dataset.roleChoice)));
function selectRole(role){document.getElementById("role").value=role;document.querySelectorAll("[data-role-choice]").forEach(b=>b.classList.toggle("active",b.dataset.roleChoice===role))}
document.getElementById("signupForm").addEventListener("submit",e=>{
e.preventDefault();
const account={name:document.getElementById("name").value,email:document.getElementById("email").value,phone:document.getElementById("phone").value,location:loc.value,role:document.getElementById("role").value};
APP.set("account",account);APP.toast("Account created");
setTimeout(()=>location.href=account.role==="farmer"?"farmer.html":"market.html",350);
});
});