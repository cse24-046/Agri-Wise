document.addEventListener("DOMContentLoaded",()=>{
	const signup=document.getElementById("signupForm"),login=document.getElementById("loginForm");
	const url = new URL(location.href);
	const plan = url.searchParams.get('plan');
	const billing = url.searchParams.get('billing');

	document.querySelectorAll("[data-auth]").forEach(button=>button.addEventListener("click",()=>{const isSignup=button.dataset.auth==="signup";signup.classList.toggle("hidden",!isSignup);login.classList.toggle("hidden",isSignup);document.querySelectorAll("[data-auth]").forEach(tab=>tab.classList.toggle("active",tab===button))}));

	function showPaymentForm(selectedPlan,billingPref){
		// inject a simple payment form into the right-hand form card
		const formCard = document.querySelector('.form-card');
		if(!formCard) return;
		// avoid duplicate
		if(document.getElementById('paymentForm')) return;
		const wrapper = document.createElement('div');
		wrapper.className = 'payment-card panel';
		wrapper.id = 'paymentForm';
		const amount = billingPref==='yearly' ? 'P500 / year' : 'P70 / month';
		wrapper.innerHTML = `
			<span class="eyebrow">PAYMENT</span>
			<h2>Complete subscription — ${selectedPlan ? selectedPlan.toUpperCase() : 'PREMIUM'}</h2>
			<p class="muted small">${amount} — Enter card details or choose PayPal to complete your subscription.</p>
			<div class="payment-methods" style="display:flex;gap:8px;margin:10px 0">
				<button type="button" class="pmethod active" data-method="card">Card (Visa, MasterCard, Amex)</button>
				<button type="button" class="pmethod" data-method="paypal">PayPal</button>
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
		formCard.appendChild(wrapper);

		// method toggle
		wrapper.querySelectorAll('.pmethod').forEach(btn=>btn.addEventListener('click',()=>{
			wrapper.querySelectorAll('.pmethod').forEach(b=>b.classList.remove('active'));
			btn.classList.add('active');
			const method = btn.dataset.method;
			wrapper.querySelector('.card-fields').style.display = method === 'card' ? 'block' : 'none';
		}));

		// helper: format card number as groups of 4
		function formatCardNumber(value){
			return value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim();
		}

		function luhnCheck(num){
			const digits = num.replace(/\D/g,'').split('').reverse().map(d=>parseInt(d,10));
			let sum=0; for(let i=0;i<digits.length;i++){let d=digits[i]; if(i%2===1){d*=2; if(d>9)d-=9;} sum+=d;} return sum%10===0;
		}

		function formatExpiry(v){
			v = v.replace(/\D/g,''); if(v.length>=3) v = v.slice(0,2) + '/' + v.slice(2,4); return v;
		}

		function validExpiry(v){
			if(!v || !v.includes('/')) return false; const [m,y]=v.split('/').map(s=>parseInt(s,10)); if(!m||!y) return false; if(m<1||m>12) return false; const now=new Date(); const year = 2000 + y; const exp = new Date(year,m,1); return exp > now;
		}

		function validateForm(){
			const name = document.getElementById('cardName').value.trim();
			const number = document.getElementById('cardNumber').value.replace(/\s/g,'');
			const expiry = document.getElementById('cardExpiry').value.trim();
			const cvc = document.getElementById('cardCvc').value.trim();
			const btn = document.getElementById('payBtn');
			const ok = name.length>2 && number.length>=12 && luhnCheck(number) && validExpiry(expiry) && (cvc.length===3||cvc.length===4);
			if(btn) btn.disabled = !ok;
			return ok;
		}

		// wire formatting/validation
		const cardNumberEl = wrapper.querySelector('#cardNumber');
		const cardExpiryEl = wrapper.querySelector('#cardExpiry');
		const cardNameEl = wrapper.querySelector('#cardName');
		const cardCvcEl = wrapper.querySelector('#cardCvc');
		if(cardNumberEl){
			cardNumberEl.addEventListener('input',e=>{e.target.value = formatCardNumber(e.target.value); validateForm();});
		}
		if(cardExpiryEl){
			cardExpiryEl.addEventListener('input',e=>{e.target.value = formatExpiry(e.target.value); validateForm();});
		}
		[cardNameEl,cardCvcEl].forEach(el=>{ if(el) el.addEventListener('input',()=>validateForm()); });

		// simulate card payment
		document.getElementById('checkout').addEventListener('submit',e=>{
			e.preventDefault();
			if(!validateForm()) return;
			const status = document.getElementById('payStatus');
			const payBtn = document.getElementById('payBtn');
			status.innerHTML = '<span class="spinner" aria-hidden="true"></span> Processing payment...';
			payBtn.disabled = true;
			setTimeout(()=>{
				// attach subscription to stored user
				const user = APP.user() || {};
				user.subscription = { plan: selectedPlan || 'premium', billing: billingPref || 'monthly', started: new Date().toISOString(), method: 'card' };
				APP.set('user', user);
				// show receipt modal
				showReceipt({id: 'TRX' + Math.floor(Math.random()*900000+100000), amount: billingPref==='yearly'?500:70, billing: billingPref || 'monthly', method: 'Card'});
			}, 1200 + Math.random()*800);
		});

		// PayPal button (simulated)
		document.getElementById('paypalBtn').addEventListener('click',()=>{
			const status = document.getElementById('payStatus');
			status.innerHTML = '<span class="spinner" aria-hidden="true"></span> Redirecting to PayPal...';
			setTimeout(()=>{
				const user = APP.user() || {};
				user.subscription = { plan: selectedPlan || 'premium', billing: billingPref || 'monthly', started: new Date().toISOString(), method: 'paypal' };
				APP.set('user', user);
				showReceipt({id: 'PP' + Math.floor(Math.random()*900000+100000), amount: billingPref==='yearly'?500:70, billing: billingPref || 'monthly', method: 'PayPal'});
			}, 1200 + Math.random()*700);
		});

		function showReceipt(details){
			const modal = document.createElement('div'); modal.className = 'modal';
			const card = document.createElement('div'); card.className = 'modal-card';
			card.innerHTML = `
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
			`;
			modal.appendChild(card); document.body.appendChild(modal);
			card.querySelector('.modal-close').addEventListener('click',()=>{document.body.removeChild(modal); location.href='farmer.html'});
			card.querySelector('#receiptDone').addEventListener('click',()=>{document.body.removeChild(modal); location.href='farmer.html'});
		}
	}

	signup.addEventListener("submit",event=>{event.preventDefault();APP.set("user",{name:document.getElementById("signupName").value.trim(),email:document.getElementById("signupEmail").value.trim().toLowerCase(),password:document.getElementById("signupPassword").value});
		if(plan==='premium'){
			// show payment form instead of redirect
			showPaymentForm(plan,billing);
		}else{
			location.href="farmer.html";
		}
	});

	login.addEventListener("submit",event=>{event.preventDefault();const user=APP.user(),email=document.getElementById("loginEmail").value.trim().toLowerCase(),password=document.getElementById("loginPassword").value,invalid=!user||user.email!==email||user.password!==password;document.getElementById("loginError").classList.toggle("hidden",!invalid);if(!invalid){
			if(plan==='premium') showPaymentForm(plan,billing); else location.href="farmer.html";
	}});

	// If arriving with ?plan=premium show payment prompt above forms
	if(plan==='premium'){
		// ensure signup tab is active
		const signupTab = document.querySelector('[data-auth="signup"]');
		if(signupTab) signupTab.click();
		// optionally pre-show payment (user must sign up first)
		const note = document.createElement('div');
		note.className = 'muted small';
		note.textContent = billing ? `You chose ${billing} billing — sign up to continue to payment.` : 'Sign up to continue to premium payment.';
		const formCard = document.querySelector('.form-card');
		if(formCard) formCard.insertBefore(note, formCard.firstChild);
	}

});
