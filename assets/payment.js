document.addEventListener('DOMContentLoaded',()=>{
  const url = new URL(location.href);
  const plan = url.searchParams.get('plan') || 'premium';
  const billing = url.searchParams.get('billing') || 'monthly';
  const root = document.getElementById('paymentRoot');
  const area = document.getElementById('paymentArea');
  const title = document.getElementById('planTitle');
  const summary = document.getElementById('planSummary');

  const amount = billing==='yearly' ? 'P500 / year' : 'P70 / month';
  title.textContent = `Agri-Wise Premium — ${billing==='yearly' ? 'Yearly' : 'Monthly'}`;
  summary.textContent = `${amount} — ${billing==='yearly' ? 'Billed annually. Save vs monthly.' : 'Billed monthly. Cancel anytime.'}`;

  // if user not signed in, prompt to sign in or sign up first
  if(!APP.user()){
    const note = document.createElement('div'); note.className='muted small';
    note.innerHTML = `Please sign in or create an account to complete purchase.`;
    const btnRow = document.createElement('div'); btnRow.style.marginTop='12px';
    const loginBtn = document.createElement('a'); loginBtn.className='btn btn-primary'; loginBtn.href = `auth.html?return=${encodeURIComponent(location.pathname + location.search)}`; loginBtn.textContent='Sign in / Sign up';
    btnRow.appendChild(loginBtn); root.insertBefore(note, area); root.insertBefore(btnRow, area);
    return;
  }

  // build payment form (similar to auth.js implementation)
  area.innerHTML = `
    <div class="payment-card panel">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <strong>${plan.toUpperCase()} — ${billing}</strong>
          <div class="muted small">${amount}</div>
        </div>
        <div class="muted small">Signed in as <strong>${APP.user().email || APP.user().name}</strong></div>
      </div>
      <div style="margin-top:12px" id="checkoutWrap"></div>
    </div>
  `;

  const wrap = document.getElementById('checkoutWrap');
  wrap.innerHTML = `
    <div class="payment-methods" style="display:flex;gap:8px;margin:10px 0">
      <button type="button" class="pmethod active" data-method="card"><span class="pm-icon">Card</span><span class="accepted-cards"><i class="fa-brands fa-cc-visa"></i><i class="fa-brands fa-cc-mastercard"></i><i class="fa-brands fa-cc-amex"></i></span></button>
      <button type="button" class="pmethod" data-method="paypal"><i class="fa-brands fa-cc-paypal"></i> PayPal</button>
    </div>
    <form id="checkout" style="margin-top:8px">
      <div class="card-fields">
        <label>Cardholder name<input id="cardName" required placeholder="Name on card"></label>
        <label>Card number<input id="cardNumber" inputmode="numeric" pattern="[0-9 ]{12,19}" maxlength="19" placeholder="4111 1111 1111 1111"></label>
        <div style="display:flex;gap:8px">
          <label style="flex:1">Expiry<input id="cardExpiry" placeholder="MM/YY"></label>
          <label style="width:120px">CVC<input id="cardCvc" inputmode="numeric" maxlength="4" placeholder="123"></label>
        </div>
      </div>
      <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
        <button class="btn btn-primary" id="payBtn" disabled>Pay & Activate</button>
        <button type="button" class="btn btn-outline" id="paypalBtn">Pay with PayPal</button>
        <span class="muted small" id="payStatus" style="margin-left:8px"></span>
      </div>
    </form>
  `;

  const wrapper = area.querySelector('.payment-card');
  wrapper.querySelectorAll('.pmethod').forEach(btn=>btn.addEventListener('click',()=>{
    wrapper.querySelectorAll('.pmethod').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const method = btn.dataset.method;
    wrapper.querySelector('.card-fields').style.display = method === 'card' ? 'block' : 'none';
  }));

  // formatting and validation helpers
  function formatCardNumber(value){ return value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim(); }
  function luhnCheck(num){ const digits = num.replace(/\D/g,'').split('').reverse().map(d=>parseInt(d,10)); let sum=0; for(let i=0;i<digits.length;i++){let d=digits[i]; if(i%2===1){d*=2; if(d>9)d-=9;} sum+=d;} return sum%10===0; }
  function formatExpiry(v){ v = v.replace(/\D/g,''); if(v.length>=3) v = v.slice(0,2) + '/' + v.slice(2,4); return v; }
  function validExpiry(v){ if(!v||!v.includes('/')) return false; const [m,y]=v.split('/').map(s=>parseInt(s,10)); if(!m||!y) return false; if(m<1||m>12) return false; const now=new Date(); const year = 2000 + y; const exp = new Date(year,m,1); return exp > now; }
  function validateForm(){ const name = document.getElementById('cardName').value.trim(); const number = document.getElementById('cardNumber').value.replace(/\s/g,''); const expiry = document.getElementById('cardExpiry').value.trim(); const cvc = document.getElementById('cardCvc').value.trim(); const btn = document.getElementById('payBtn'); const ok = name.length>2 && number.length>=12 && luhnCheck(number) && validExpiry(expiry) && (cvc.length===3||cvc.length===4); if(btn) btn.disabled = !ok; return ok; }

  const cardNumberEl = document.getElementById('cardNumber'); const cardExpiryEl = document.getElementById('cardExpiry'); const cardNameEl = document.getElementById('cardName'); const cardCvcEl = document.getElementById('cardCvc');
  if(cardNumberEl){ cardNumberEl.addEventListener('input',e=>{ e.target.value = formatCardNumber(e.target.value); validateForm(); }); }
  if(cardExpiryEl){ cardExpiryEl.addEventListener('input',e=>{ e.target.value = formatExpiry(e.target.value); validateForm(); }); }
  [cardNameEl,cardCvcEl].forEach(el=>{ if(el) el.addEventListener('input',()=>validateForm()); });

  document.getElementById('checkout').addEventListener('submit',e=>{
    e.preventDefault(); if(!validateForm()) return; const status = document.getElementById('payStatus'); const payBtn = document.getElementById('payBtn'); status.innerHTML = '<span class="spinner" aria-hidden="true"></span> Processing payment...'; payBtn.disabled = true;
    setTimeout(()=>{
      const user = APP.user() || {};
      user.subscription = { plan, billing, started: new Date().toISOString(), method: 'card' };
      APP.set('user', user);
      showReceipt({id: 'TRX' + Math.floor(Math.random()*900000+100000), amount: billing==='yearly'?500:70, billing, method: 'Card'});
    }, 1200 + Math.random()*800);
  });

  document.getElementById('paypalBtn').addEventListener('click',()=>{
    const status = document.getElementById('payStatus'); status.innerHTML = '<span class="spinner" aria-hidden="true"></span> Redirecting to PayPal...'; setTimeout(()=>{
      const user = APP.user() || {};
      user.subscription = { plan, billing, started: new Date().toISOString(), method: 'paypal' };
      APP.set('user', user);
      showReceipt({id: 'PP' + Math.floor(Math.random()*900000+100000), amount: billing==='yearly'?500:70, billing, method: 'PayPal'});
    }, 1200 + Math.random()*700);
  });

  function showReceipt(details){ const modal = document.createElement('div'); modal.className='modal'; const card = document.createElement('div'); card.className='modal-card'; card.innerHTML = `
    <button class="modal-close" aria-label="Close">×</button>
    <h3>Subscription activated</h3>
    <p class="muted small">Thank you — your subscription is active.</p>
    <div class="receipt">
      <strong>Transaction:</strong> ${details.id}<br>
      <strong>Plan:</strong> ${details.billing} — P${details.amount}<br>
      <strong>Method:</strong> ${details.method}<br>
      <strong>Date:</strong> ${new Date().toLocaleString()}
    </div>
    <div style="margin-top:12px;text-align:right"><button class="btn btn-primary" id="receiptDone">Continue</button></div>
  `; modal.appendChild(card); document.body.appendChild(modal); card.querySelector('.modal-close').addEventListener('click',()=>{document.body.removeChild(modal); location.href='farmer.html'}); card.querySelector('#receiptDone').addEventListener('click',()=>{document.body.removeChild(modal); location.href='farmer.html'}); }

});
