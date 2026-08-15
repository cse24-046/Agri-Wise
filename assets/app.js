const APP = {
	get(key, fallback = null) {
		try {
			const value = localStorage.getItem("agriwise:" + key);
			return value === null ? fallback : JSON.parse(value);
		} catch {
			return fallback;
		}
	},
	set(key, value) {
		try {
			localStorage.setItem("agriwise:" + key, JSON.stringify(value));
		} catch {}
	},
	user() { return APP.get("user") },
	requireUser() { if (!APP.user()) { location.href = "auth.html"; return false } return true },
	logout() { localStorage.removeItem("agriwise:user"); location.href = "index.html" },
	init() {
		document.querySelectorAll("[data-year]").forEach(element => element.textContent = new Date().getFullYear());
		document.querySelectorAll("[data-logout]").forEach(button => button.addEventListener("click", APP.logout));
		const start = document.querySelector(".hero .actions a");
		if (start) { start.href = "auth.html"; start.innerHTML = 'GET STARTED <i class="fa fa-arrow-right"></i>' }

		// Ensure header brand shows the logo image when available
		document.querySelectorAll('a.brand').forEach(el => {
			if (!el.querySelector('img.brand-logo')) {
				const img = document.createElement('img');
				img.src = 'assets/AgriWise.jpg';
				img.alt = 'Agri-Wise';
				img.className = 'brand-logo';
				// keep accessible text as aria-label
				const text = el.textContent.trim();
				if (text) el.setAttribute('aria-label', text);
				el.innerHTML = '';
				el.appendChild(img);
			}
		});
	}
};

document.addEventListener("DOMContentLoaded", APP.init);
