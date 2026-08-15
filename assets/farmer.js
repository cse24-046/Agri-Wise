document.addEventListener("DOMContentLoaded",()=>{
	if(!APP.requireUser()) return;
	const user = APP.user(), season = HH.currentSeason(), next = HH.nextSeason(), crops = HH.seasonCrops();

	document.getElementById("welcomeMessage").textContent = `Welcome, ${user.name}.`;
	document.getElementById("seasonTag").textContent = season.name;
	document.getElementById("currentSeason").textContent = season.name;
	document.getElementById("seasonMonths").textContent = season.months;
	document.getElementById("seasonDemand").textContent = season.demand;
	document.getElementById("nextSeason").textContent = next.name;
	document.getElementById("nextSeasonIntro").textContent = `${next.months}: prepare for changing conditions, crop risks and demand.`;
	document.getElementById("nextSeasonTips").innerHTML = next.tips.map(tip=>`<li>${tip}</li>`).join("");

	const vegetableCount = crops.filter(crop=>crop.type === "Vegetable").length;
	const fruitCount = crops.filter(crop=>crop.type === "Fruit").length;
	const total = crops.length;
	const vegetableEnd = Math.round(vegetableCount/total*100);
	const pieGrad = `conic-gradient(#214d3b 0 ${vegetableEnd}%,#d7a84b ${vegetableEnd}% 100%)`;

	document.getElementById("demandChart").innerHTML = `<div class="pie" style="background:${pieGrad}"></div><div class="chart-legend"><span><i class="legend-high"></i>Vegetables: ${vegetableCount} of ${total}</span><span><i class="legend-mid"></i>Fruits: ${fruitCount} of ${total}</span><span>Total produce in season: ${total}</span></div>`;
	document.getElementById("priceChart").innerHTML = `<div class="bars">${crops.map((crop,index)=>`<div class="bar-row"><span>${crop.name}</span><div><i style="width:${[84,67,59,48][index%4]}%"></i></div><b>${crop.price}</b></div>`).join("")}</div>`;
	document.getElementById("trendChart").innerHTML = `<svg viewBox="0 0 340 160" aria-hidden="true"><path class="gridline" d="M30 20H325M30 75H325M30 130H325M30 20V130"/><path class="trend-line" d="M35 115 L110 82 L185 98 L260 45 L320 62"/><g class="trend-points"><circle cx="35" cy="115" r="4"/><circle cx="110" cy="82" r="4"/><circle cx="185" cy="98" r="4"/><circle cx="260" cy="45" r="4"/><circle cx="320" cy="62" r="4"/></g><text x="30" y="150">Now</text><text x="98" y="150">Week 2</text><text x="175" y="150">Week 3</text><text x="248" y="150">Week 4</text><text x="302" y="150">Outlook</text></svg><p class="small muted">Planning signal based on current seasonal demand patterns.</p>`;

	const suggestions = ["What crops are in demand this season?","What are the risks this season?","What actions should I take now?","Tell me about tomatoes","What is the price of mangoes?"];
	document.getElementById("chatSuggestions").innerHTML = suggestions.map(text=>`<button class="chip" type="button">${text}</button>`).join("");
	document.querySelectorAll(".chip").forEach(button=>button.addEventListener("click",()=>ask(button.textContent)));

	function list(items){return `<ul>${items.map(item=>`<li>${item}</li>`).join("")}</ul>`}
	function cropFrom(question){const lower = question.toLowerCase();return HH.crops.find(crop=>lower.includes(crop.name.toLowerCase())||lower.includes(crop.name.toLowerCase().replace(/es$/,"").replace(/s$/,"") ))}

	function ask(question){
		const log = document.getElementById("chatLog"), lower = question.toLowerCase(), crop = cropFrom(question);
		log.innerHTML += `<div class="chat user">${question}</div>`;

		// typing indicator
		const typingEl = document.createElement('div');
		typingEl.className = 'chat bot typing';
		typingEl.innerHTML = '<span class="typing-dots"><i></i><i></i><i></i></span>';
		log.appendChild(typingEl);
		log.scrollTop = log.scrollHeight;

		let answer;
		if(crop){
			const cropSeason = HH.seasons.find(item=>item.key===crop.season);
			answer = `<strong>${crop.name} (${crop.type})</strong><br>Demand: ${crop.demand}<br>Indicative price: <strong>${crop.price}</strong><br>Best fit: ${cropSeason.name}<br>Soil: ${crop.soil}<br><br><strong>Prepare for</strong>${list(cropSeason.risks.slice(0,2))}<strong>Actions</strong>${list(cropSeason.actions.slice(0,2))}`;
		}else if(lower.includes("risk")||lower.includes("prepare")){
			answer = `<strong>${season.name}: risks to prepare for</strong>${list(season.risks)}<strong>Actions to take</strong>${list(season.actions)}`;
		}else if(lower.includes("price")||lower.includes("demand")||lower.includes("season")||lower.includes("action")||lower.includes("plant")){
			answer = `<strong>${season.name}: crop opportunity briefing</strong><br>${season.demand}<br><br><strong>Indicative prices</strong>${list(crops.map(crop=>`${crop.name}: ${crop.price}`))}<strong>Actions to take</strong>${list(season.actions)}`;
		}else answer = "Ask about a listed fruit or vegetable, or use terms like demand, price, risks, actions or season to receive a seasonal briefing.";

		// simulate processing delay then show answer
		setTimeout(()=>{
			typingEl.remove();
			log.innerHTML += `<div class="chat bot">${answer}</div>`;
			log.scrollTop = log.scrollHeight;
		}, 800 + Math.random()*700);
	}

	document.getElementById("chatForm").addEventListener("submit", event=>{
		event.preventDefault();
		const input = document.getElementById("chatInput"), question = input.value.trim();
		if(question){ ask(question); input.value = "" }
	});
});
