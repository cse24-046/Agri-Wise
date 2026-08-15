window.HH = (() => {
const locations=["Gaborone","Mogoditshane","Tlokweng","Molepolole","Kanye","Lobatse","Francistown","Serowe","Palapye","Maun","Kasane","Ghanzi","Selebi-Phikwe","Tonota"];
const seasons=[
 {key:"hot-wet",name:"Hot Wet Season",months:"November – March",note:"Rain-fed planting window. Heat-tolerant crops and fast leafy greens do best; watch for pests after heavy rain."},
 {key:"post-rain",name:"Post-Rain Harvest",months:"April – May",note:"Soil moisture is still high and days are mild — a strong harvest window before winter."},
 {key:"cool-dry",name:"Cool Dry Season",months:"June – August",note:"Frost risk is higher inland. Brassicas, roots and hardy greens thrive with irrigation."},
 {key:"hot-dry",name:"Hot Dry Season",months:"September – October",note:"Water costs are highest. Shade netting and drip irrigation help short-cycle crops."}
];
const produce=[
["Tomatoes","kg",18.5,"hot-wet","up"],["Morogo","bunch",8,"hot-wet","up"],["Green Maize","cob",6,"hot-wet","steady"],["Watermelon","each",35,"hot-wet","down"],["Green Beans","kg",26,"hot-wet","up"],
["Butternut","kg",12,"post-rain","steady"],["Cabbage","head",22,"post-rain","up"],["Spinach","bunch",10,"post-rain","steady"],["Groundnuts","kg",38,"post-rain","up"],
["Cabbage","head",22,"cool-dry","up"],["Beetroot","kg",16,"cool-dry","up"],["Carrots","kg",15,"cool-dry","steady"],["Onions","kg",14,"cool-dry","up"],["Rape","bunch",9,"cool-dry","steady"],
["Spinach","bunch",10,"hot-dry","steady"],["Green Pepper","kg",28,"hot-dry","up"],["Chillies","kg",42,"hot-dry","up"],["Sweet Potato","kg",17,"hot-dry","steady"]
].map((p,i)=>({id:i,name:p[0],unit:p[1],price:p[2],season:p[3],trend:p[4]}));
const stalls=[
{id:"s1",name:"Mmapula Fresh Produce",owner:"Mmapula Kgosi",location:"Gaborone",area:"Block 8, near Riverwalk",items:["Tomatoes","Morogo","Green Maize","Spinach"],rating:4.8,delivery:"Free delivery within 10 km",blurb:"Family plot in Notwane growing fresh vegetables every morning.",wallets:{orange:"76 214 889",smega:"71 903 447",myzaka:""},bank:"ABSA Botswana",account:"1042 887 331"},
{id:"s2",name:"Tlokweng Green Gardens",owner:"Kabelo Seretse",location:"Tlokweng",area:"Plot 4412, Tlokweng Road",items:["Cabbage","Rape","Beetroot","Chillies"],rating:4.6,delivery:"Gaborone drop-off Fridays",blurb:"Drip-irrigated market garden with seasonal vegetables.",wallets:{orange:"77 552 130",smega:"",myzaka:"74 118 902"},bank:"FNB Botswana",account:"6255 019 447"},
{id:"s3",name:"Serowe Root Co-op",owner:"Neo Baitshepi",location:"Serowe",area:"Main Kgotla road",items:["Butternut","Sweet Potato","Carrots","Onions"],rating:4.9,delivery:"Bulk crates to Palapye & Gaborone",blurb:"Eight-farmer cooperative supplying roots and vegetables in bulk.",wallets:{orange:"",smega:"72 447 018",myzaka:"75 220 664"},bank:"FNB Botswana",account:"6299 774 100"},
{id:"s4",name:"Maun Riverside Veg",owner:"Onalenna Dintwe",location:"Maun",area:"Boseja ward, riverside plots",items:["Green Beans","Green Pepper","Spinach","Tomatoes"],rating:4.7,delivery:"Lodge deliveries Tue & Sat",blurb:"River plots supplying salad greens, peppers and beans.",wallets:{orange:"76 880 145",smega:"71 336 209",myzaka:"74 002 771"},bank:"Stanbic Bank",account:"9033 118 205"},
{id:"s5",name:"Kanye Hillside Farm",owner:"Tebogo Molefe",location:"Kanye",area:"Ntsweng, off the A2",items:["Cabbage","Groundnuts","Watermelon","Carrots"],rating:4.4,delivery:"Collection only",blurb:"Winter brassicas and groundnuts plus watermelon over the rains.",wallets:{orange:"76 771 553",smega:"",myzaka:""},bank:"ABSA Botswana",account:"1078 442 916"},
{id:"s6",name:"Francistown Urban Greens",owner:"Lesego Phiri",location:"Francistown",area:"Tati River industrial edge",items:["Spinach","Rape","Green Pepper","Onions"],rating:4.5,delivery:"Same-day delivery in Francistown",blurb:"Shade-net tunnels producing leafy greens year round.",wallets:{orange:"",smega:"71 664 200",myzaka:"74 559 813"},bank:"Standard Chartered",account:"2011 663 084"}
];
function seasonForMonth(m){if(m>=10||m<=2)return seasons[0];if(m<=4)return seasons[1];if(m<=7)return seasons[2];return seasons[3]}
function currentSeason(){return seasonForMonth(new Date().getMonth())}
function nextSeason(){const cur=currentSeason();const idx=seasons.findIndex(s=>s.key===cur.key);return seasons[(idx+1)%seasons.length]}
function seasonalProduce(){return produce.filter(p=>p.season===currentSeason().key)}
return {locations,seasons,produce,stalls,currentSeason,nextSeason,seasonalProduce};
})();