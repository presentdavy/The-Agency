
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("en-BE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Math.round(n));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36).slice(-4);
const initials=n=>n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();
const scoreClass=v=>v<35?"low":v<70?"mid":"high";

const NAMES=["Noah Vermeulen","Mila De Smet","Aya Jacobs","Lena Peeters","Oscar Dubois","Finn Martens","Sofia Willems","Lucas Leroy","Emma Claes","Victor Maes","Nora Leroy","Arthur Peeters","Zoë Janssens","Liam Dubois","Elise Martens","Mason Jacobs"];
const SECTORS=["Football","Cycling","Tennis","Pop Music","Influencer","Film","Television"];
const STAFF_ROLES=[
 {role:"Agent",salary:[900,1800],bonus:"client capacity"},
 {role:"PR Manager",salary:[1000,2100],bonus:"crisis handling"},
 {role:"Lawyer",salary:[1500,3000],bonus:"legal risk"},
 {role:"Scout",salary:[850,1700],bonus:"scouting quality"},
 {role:"Lifestyle Manager",salary:[850,1650],bonus:"family & private life"},
 {role:"Commercial Manager",salary:[1100,2300],bonus:"sponsor deals"}
];
const CRISIS_TEMPLATES=[
 {title:"Blackmail attempt",type:"Private",text:"Someone claims to possess compromising photos from a one-night stand and demands money before approaching the press.",severity:88,
  options:[
   {label:"Bring in legal counsel",cost:4500,time:2,risk:12,rep:[2,6],loy:[1,4],desc:"Professional response. Expensive, but reduces legal and press risk."},
   {label:"Deploy crisis PR team",cost:7000,time:3,risk:18,rep:[1,5],loy:[0,3],desc:"Control the narrative before publication. Strong but costly."},
   {label:"Risk a cover-up",cost:2500,time:1,risk:72,rep:[-10,2],loy:[-2,5],desc:"Fast and cheap. A future leak can become much worse."}
  ]},
 {title:"Doping allegation",type:"Sport",text:"A journalist says a confidential source has linked the client to a prohibited substance. Nothing is proven yet.",severity:94,
  options:[
   {label:"Cooperate and seek specialist legal advice",cost:6500,time:3,risk:18,rep:[3,8],loy:[0,3],desc:"Expensive, credible and defensible."},
   {label:"Challenge the allegation publicly",cost:2500,time:2,risk:38,rep:[-3,5],loy:[0,4],desc:"Can rally support, but raises the stakes."},
   {label:"Try to bury the story",cost:5000,time:1,risk:78,rep:[-12,2],loy:[-2,6],desc:"May buy time. Creates a serious confidential risk."}
  ]},
 {title:"Paternity claim",type:"Family",text:"An ex-partner privately claims the client is the parent of her child and requests discretion and a DNA test.",severity:76,
  options:[
   {label:"Handle privately through lawyers",cost:4200,time:2,risk:14,rep:[1,5],loy:[1,5],desc:"Private and structured. Keeps family exposure limited."},
   {label:"Prepare a controlled public statement",cost:2800,time:2,risk:34,rep:[0,6],loy:[-1,3],desc:"Transparent, but exposes private life."},
   {label:"Ignore the claim",cost:0,time:0.5,risk:80,rep:[-10,0],loy:[-6,0],desc:"Cheap today. Potentially disastrous later."}
  ]},
 {title:"Tour exhaustion",type:"Music",text:"The artist says they cannot continue three more sold-out shows without a break. Production and promoter penalties are substantial.",severity:71,
  options:[
   {label:"Protect the artist and postpone",cost:18000,time:2,risk:16,rep:[2,5],loy:[5,10],desc:"Major direct cost, strong long-term trust."},
   {label:"Add medical/support team and continue",cost:8500,time:2,risk:32,rep:[0,3],loy:[1,5],desc:"Middle ground. Stress remains a factor."},
   {label:"Force the schedule",cost:0,time:1,risk:68,rep:[-6,1],loy:[-10,-3],desc:"Protects short-term revenue, risks burnout and relationship damage."}
  ]},
 {title:"Influencer backlash",type:"Media",text:"An old offensive post has gone viral again. Two sponsors have asked for an urgent response.",severity:83,
  options:[
   {label:"Issue a sincere statement",cost:2200,time:1,risk:22,rep:[2,7],loy:[0,2],desc:"Low cost and credible if the client cooperates."},
   {label:"Pause all content for 72 hours",cost:5000,time:1,risk:30,rep:[0,5],loy:[-1,2],desc:"Reduces heat but costs commercial momentum."},
   {label:"Attack the critics",cost:0,time:0.5,risk:74,rep:[-12,2],loy:[0,5],desc:"Can energize fans, but brands may walk."}
  ]},
 {title:"Marriage crisis",type:"Family",text:"The client's partner says the relationship is at breaking point due to travel, missed family commitments and media attention.",severity:64,
  options:[
   {label:"Clear schedule and arrange private time",cost:3500,time:4,risk:12,rep:[0,2],loy:[4,9],desc:"Costs time and missed opportunities but stabilizes home life."},
   {label:"Assign lifestyle manager",cost:1800,time:1,risk:24,rep:[0,2],loy:[2,5],desc:"Delegated support. Less personal, but efficient."},
   {label:"Focus only on career",cost:0,time:0.5,risk:65,rep:[-3,1],loy:[-5,1],desc:"No direct cost. Family consequences may surface later."}
  ]}
];

function seed(){
 return {
  version:3, season:1, week:1, day:1, weekday:0, hour:8.5,
  cash:35000, reputation:52, influence:14, agencyLevel:1, confidentialRisk:2,
  notifications:[],
  clients:[
   {id:"c1",name:"Noah Vermeulen",sector:"Football",age:21,fame:34,potential:80,loyalty:61,stress:27,reputation:67,value:1800000,income:620000,commission:8,contract:"Royal Antwerp · 2y 4m",partner:"Julie",children:0,family:70,entourage:55,secrets:1,career:"First-team regular",country:"Belgium"},
   {id:"c2",name:"Mila De Smet",sector:"Pop Music",age:24,fame:57,potential:84,loyalty:73,stress:48,reputation:72,value:4200000,income:940000,commission:12,contract:"Indie label · 11m",partner:"Single",children:0,family:63,entourage:61,secrets:0,career:"European club tour",country:"Belgium"},
   {id:"c3",name:"Aya Jacobs",sector:"Influencer",age:27,fame:66,potential:72,loyalty:46,stress:62,reputation:54,value:2600000,income:780000,commission:15,contract:"Agency exclusive · 1y 7m",partner:"Tom",children:1,family:58,entourage:42,secrets:2,career:"Lifestyle creator",country:"Belgium"}
  ],
  staff:[
   {id:"s1",name:"Emma Claes",role:"Junior Agent",skill:48,salary:850,capacity:2,assigned:1,loyalty:72},
   {id:"s2",name:"Victor Maes",role:"PR Manager",skill:67,salary:1250,capacity:3,assigned:1,loyalty:68}
  ],
  messages:[
   {id:"m1",from:"Noah Vermeulen",clientId:"c1",unread:true,preview:"Can you call me? It's about Madrid.",resolved:false,lines:[
     {who:"them",text:"Morning. Can you call me?"},{who:"them",text:"Madrid contacted the club last night."},{who:"them",text:"Julie really doesn't want to move, but this could be my chance."}
   ],choices:["personal","delegate","hard"]},
   {id:"m2",from:"Victor · PR",clientId:"c3",unread:true,preview:"We may have a press problem with Aya.",resolved:false,lines:[
     {who:"them",text:"I need your attention."},{who:"them",text:"A journalist is asking about an old video involving Aya."},{who:"them",text:"They publish at 16:00 unless we respond."}
   ],choices:["pr","legal","wait"]},
   {id:"m3",from:"Mila De Smet",clientId:"c2",unread:true,preview:"I can't do three more shows like this.",resolved:false,lines:[
     {who:"them",text:"I'm exhausted."},{who:"them",text:"The label keeps adding promo."},{who:"them",text:"I can't do three more shows like this. I need you to fix it."}
   ],choices:["rest","support","push"]}
  ],
  mails:[
   {id:"e1",from:"Madrid FC · Sporting",subject:"Confidential interest — N. Vermeulen",body:"Indicative proposal: 5 years · €3.8m gross/year · €600k signing bonus. Club-to-club talks are not yet agreed.",unread:true,dealId:"d1"},
   {id:"e2",from:"NorthStar Sportswear",subject:"Aya Jacobs — Campaign Offer",body:"€180,000 campaign fee. Agency commission 15%. 12-month morality clause. Response requested within 72 hours.",unread:true,dealId:"d2"},
   {id:"e3",from:"Mila Tour Production",subject:"Tour cost overrun",body:"Production is €42,000 over budget. We need approval or cuts before Thursday.",unread:false}
  ],
  calendar:[
   {id:"a1",day:1,hour:9.5,title:"Call Noah — Madrid interest",kind:"Client",done:false},
   {id:"a2",day:1,hour:11,title:"Contract review · NorthStar",kind:"Sponsor",done:false},
   {id:"a3",day:1,hour:14,title:"Mila tour production call",kind:"Music",done:false},
   {id:"a4",day:1,hour:15.5,title:"PR decision deadline · Aya",kind:"Urgent",done:false}
  ],
  deals:[
   {id:"d1",clientId:"c1",party:"Madrid FC",kind:"Player contract",value:3800000,years:5,bonus:600000,agencyFee:304000,status:"Opening offer",interest:82,leverage:58,round:1,deadlineDay:4,clauses:["Image rights 50/50","Champions League bonus"]},
   {id:"d2",clientId:"c3",party:"NorthStar Sportswear",kind:"Brand campaign",value:180000,years:1,bonus:0,agencyFee:27000,status:"Offer received",interest:69,leverage:45,round:1,deadlineDay:3,clauses:["12-month morality clause","2 campaign shoots"]}
  ],
  crises:[
   {id:"x1",clientId:"c3",template:4,deadlineDay:1,deadlineHour:16,status:"Open"},
  ],
  media:[
   {day:1,headline:"Madrid scouts attended Noah Vermeulen's last match.",tone:"neutral"},
   {day:1,headline:"Mila De Smet's latest single climbs to #18.",tone:"positive"},
   {day:1,headline:"A rival agency signs a 17-year-old cycling prospect.",tone:"neutral"}
  ],
  rivals:[
   {id:"r1",name:"Crown Sports & Media",reputation:74,influence:79,clients:31,cash:2200000,aggression:76},
   {id:"r2",name:"Northline Talent",reputation:62,influence:58,clients:18,cash:980000,aggression:43},
   {id:"r3",name:"Eleven Artists",reputation:69,influence:54,clients:24,cash:1200000,aggression:51}
  ],
  ledger:[
   {day:1,type:"Opening balance",amount:35000}
  ],
  scoutMarket:[],
  settings:{scoutSector:"All"}
 };
}
let S;
try{S=JSON.parse(localStorage.getItem("theAgencyComplete"))||seed()}catch(e){S=seed()}
if(!S.version || S.version<3) S=seed();

const weekdays=["MON","TUE","WED","THU","FRI","SAT","SUN"];
const appDefs=[
 ["messages","●","Messages"],["mail","✉","Mail"],["calendar","▣","Calendar"],["crises","!","Crises"],
 ["clients","★","Clients"],["deals","⇄","Deals"],["finance","€","Finance"],["scout","⌕","Scout"],
 ["staff","♟","Staff"],["media","▤","Media"],["rivals","◈","Rivals"],["agency","▦","Agency"]
];

function save(){localStorage.setItem("theAgencyComplete",JSON.stringify(S))}
function nowLabel(){let h=Math.floor(S.hour),m=Math.round((S.hour-h)*60); if(m===60){h++;m=0} return `${weekdays[S.weekday]} ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`}
function client(id){return S.clients.find(x=>x.id===id)}
function show(screen){
 document.querySelectorAll(".screen").forEach(x=>x.classList.toggle("active",x.id==="screen-"+screen));
 document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.toggle("on",x.dataset.go===screen));
 window.scrollTo({top:0,behavior:"smooth"}); render();
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-go]"); if(b) show(b.dataset.go);
});
function addLedger(type,amount){S.cash+=amount;S.ledger.unshift({day:S.day,type,amount});S.ledger=S.ledger.slice(0,80)}
function addMedia(headline,tone="neutral"){S.media.unshift({day:S.day,headline,tone});S.media=S.media.slice(0,60)}
function notify(text){S.notifications.unshift({id:uid(),text,day:S.day});S.notifications=S.notifications.slice(0,20)}

function renderApps(){
 const counts={
  messages:S.messages.filter(x=>x.unread).length,
  mail:S.mails.filter(x=>x.unread).length,
  crises:S.crises.filter(x=>x.status==="Open").length
 };
 $("appGrid").innerHTML=appDefs.map(([id,ic,n])=>`<button class="app-icon" data-go="${id}"><div class="ico">${ic}${counts[id]?`<span class="badge">${counts[id]}</span>`:""}</div>${n}</button>`).join("");
}

function nextDeadline(){
 const items=[];
 S.calendar.filter(x=>!x.done && (x.day>S.day || (x.day===S.day && x.hour>=S.hour))).forEach(x=>items.push({day:x.day,hour:x.hour,title:x.title,kind:x.kind}));
 S.crises.filter(x=>x.status==="Open").forEach(x=>items.push({day:x.deadlineDay,hour:x.deadlineHour,title:(CRISIS_TEMPLATES[x.template]?.title||"Crisis")+" deadline",kind:"Crisis"}));
 S.deals.filter(x=>!["Signed","Withdrawn","Lost"].includes(x.status)).forEach(x=>items.push({day:x.deadlineDay,hour:18,title:x.party+" deal deadline",kind:"Deal"}));
 items.sort((a,b)=>(a.day*24+a.hour)-(b.day*24+b.hour)); return items[0];
}
function renderHome(){
 $("clock").textContent=nowLabel(); $("seasonLabel").textContent=`Week ${S.week} · Season ${S.season}`;
 $("homeCash").textContent=money(S.cash); $("homeRep").textContent=S.reputation; $("homeInf").textContent=S.influence;
 $("homeRepBar").style.width=S.reputation+"%"; $("homeInfBar").style.width=S.influence+"%";
 $("homeLevel").textContent=S.agencyLevel; $("homeClients").textContent=`${S.clients.length} clients`;
 const urgent=S.crises.filter(x=>x.status==="Open").length;
 $("homeHeadline").textContent=urgent?`${urgent} active crisis${urgent>1?"es":""} need attention.`:"Your phone is under control.";
 $("homeSub").textContent=`${S.messages.filter(x=>x.unread).length} unread messages · ${S.mails.filter(x=>x.unread).length} unread mails · ${S.deals.filter(x=>!["Signed","Withdrawn","Lost"].includes(x.status)).length} active deals`;
 const n=nextDeadline();
 $("nextDeadlineTime").textContent=n?`Day ${n.day} · ${String(Math.floor(n.hour)).padStart(2,"0")}:${n.hour%1?".30":".00"}`:"Clear";
 $("nextDeadline").innerHTML=n?`<div class="item"><b>${n.title}</b><div class="muted tiny">${n.kind} · missing deadlines can create consequences</div></div>`:`<div class="item muted">No immediate deadlines.</div>`;
 $("worldFeed").innerHTML=S.media.slice(0,5).map((m,i)=>`<div class="item news ${m.tone==="negative"?"urgent":""}"><b>${m.headline}</b><div class="muted tiny">Day ${m.day}</div></div>`).join("");
}

function renderMessages(){
 $("threadList").innerHTML=S.messages.map(t=>`<div class="card client-card" data-thread="${t.id}"><div class="row"><div class="avatar">${initials(t.from)}</div><div class="grow"><b>${t.from}</b><div class="muted tiny">${t.preview}</div></div>${t.unread?'<span class="badge" style="position:static">1</span>':""}</div></div>`).join("");
 document.querySelectorAll("[data-thread]").forEach(el=>el.onclick=()=>openThread(el.dataset.thread));
}
function threadChoices(t){
 const c=client(t.clientId);
 const map={
  personal:[
   ["Call personally","30 min · no direct cost",0,.5,8,4,-4,"You take the call personally and work through the options."],
   ["Delegate to junior agent","€900 · saves your time",900,.25,28,1,-1,"You delegate the first response."],
   ["Push for the transfer now","No cost · relationship risk",0,.25,48,-4,6,"You tell the client to prioritize the career opportunity."]
  ],
  pr:[
   ["Deploy PR manager","€2,800 · response within 2h",2800,1,18,2,-3,"Your PR manager prepares a response and contacts the journalist."],
   ["Get lawyer involved","€4,500 · stronger protection",4500,2,14,3,-1,"Legal counsel takes control of the exposure."],
   ["Wait for publication","No cost · high escalation risk",0,.25,72,-5,4,"You decide not to react yet."]
  ],
  rest:[
   ["Clear two days of schedule","Estimated €12k lost income",12000,2,12,7,-8,"You protect the artist and cancel obligations."],
   ["Add support team","€6,500 · keeps tour running",6500,1,28,3,-4,"Extra support is added around the tour."],
   ["Tell her to finish the run","No cost · burnout risk",0,.25,67,-8,9,"You tell the client the commitments must be completed."]
  ]
 };
 return map[t.choices[0]]||map.personal;
}
function openThread(id){
 const t=S.messages.find(x=>x.id===id); if(!t)return; t.unread=false; save();
 $("threadTitle").textContent=t.from;
 $("chatBox").innerHTML=t.lines.map(x=>`<div class="bubble ${x.who==="me"?"me":"them"}">${x.text}</div>`).join("");
 if(t.resolved){$("chatChoices").innerHTML='<div class="section-card muted">This conversation is handled. Follow-up can still appear later.</div>';show("thread");return}
 const opts=threadChoices(t);
 $("chatChoices").innerHTML=opts.map((o,i)=>`<button class="choice" data-reply="${i}"><b>${o[0]}</b><small>${o[1]}</small><div class="expected"><span class="${o[2]?"bad":""}">${o[2]?money(o[2]):"€0"}</span><span>Time ${o[3]}h</span><span class="${o[4]>40?"bad":o[4]<20?"good":"gold"}">Risk ${o[4]}%</span><span class="${o[5]>=0?"good":"bad"}">Loyalty ${o[5]>=0?"+":""}${o[5]}</span><span class="${o[6]<=0?"good":"bad"}">Stress ${o[6]>=0?"+":""}${o[6]}</span></div></button>`).join("");
 document.querySelectorAll("[data-reply]").forEach(b=>b.onclick=()=>resolveThread(t,+b.dataset.reply));
 show("thread");
}
function resolveThread(t,i){
 const o=threadChoices(t)[i], c=client(t.clientId);
 if(S.cash<o[2]) return alert("Not enough agency cash.");
 if(o[2]) addLedger("Conversation response", -o[2]); S.hour+=o[3];
 c.loyalty=clamp(c.loyalty+o[5],0,100); c.stress=clamp(c.stress+o[6],0,100);
 t.lines.push({who:"me",text:o[7]}); t.resolved=true;
 if(Math.random()*100<o[4]){c.reputation=clamp(c.reputation-5,0,100);S.reputation=clamp(S.reputation-2,0,100);addMedia(`${c.name}'s situation escalates despite agency intervention.`,"negative")}
 else {S.reputation=clamp(S.reputation+1,0,100)}
 save();openThread(t.id);
}

function renderMail(){
 $("mailList").innerHTML=S.mails.map(m=>`<div class="card"><div class="row-between"><b>${m.from}</b>${m.unread?'<span class="chip gold">NEW</span>':""}</div><h3>${m.subject}</h3><p class="muted tiny">${m.body}</p><div class="toolbar"><button class="soft" data-mail="${m.id}">${m.unread?"Mark read":"Reviewed"}</button>${m.dealId?`<button class="primary" data-maildeal="${m.dealId}">Open deal</button>`:""}</div></div>`).join("");
 document.querySelectorAll("[data-mail]").forEach(b=>b.onclick=()=>{let m=S.mails.find(x=>x.id===b.dataset.mail);m.unread=false;save();render()});
 document.querySelectorAll("[data-maildeal]").forEach(b=>b.onclick=()=>openDeal(b.dataset.maildeal));
}

function renderCalendar(){
 const events=S.calendar.filter(x=>x.day>=S.day-1).sort((a,b)=>(a.day*24+a.hour)-(b.day*24+b.hour));
 $("calendarList").innerHTML=events.map(e=>`<div class="card"><div class="row-between"><div><span class="eyebrow">DAY ${e.day} · ${String(Math.floor(e.hour)).padStart(2,"0")}:${e.hour%1?"30":"00"} · ${e.kind}</span><h3>${e.title}</h3></div>${e.done?'<span class="chip good">DONE</span>':`<button class="soft" data-appt="${e.id}">Handle</button>`}</div></div>`).join("");
 document.querySelectorAll("[data-appt]").forEach(b=>b.onclick=()=>handleAppointment(b.dataset.appt));
}
function handleAppointment(id){
 const e=S.calendar.find(x=>x.id===id); if(!e||e.done)return;
 if(e.day>S.day){S.day=e.day;S.hour=e.hour}else S.hour=Math.max(S.hour,e.hour);
 e.done=true; S.reputation=clamp(S.reputation+1,0,100); notify("Completed: "+e.title); advanceTime(.5); save();render();
}

function clientCard(c){
 return `<div class="card client-card" data-client="${c.id}"><div class="row"><div class="avatar">${initials(c.name)}</div><div class="grow"><span class="eyebrow">${c.sector} · AGE ${c.age}</span><h3>${c.name}</h3><div class="muted tiny">${c.career}</div></div><span class="chip">${money(c.value)}</span></div>
 <div class="grid3" style="margin-top:10px"><div class="mini-stat"><span>LOYALTY</span><b class="score ${scoreClass(c.loyalty)}">${c.loyalty}</b></div><div class="mini-stat"><span>STRESS</span><b class="score ${scoreClass(100-c.stress)}">${c.stress}</b></div><div class="mini-stat"><span>FAME</span><b>${c.fame}</b></div></div></div>`;
}
function renderClients(){
 $("clientCount").textContent=`${S.clients.length} represented`;
 $("clientList").innerHTML=S.clients.map(clientCard).join("");
 document.querySelectorAll("[data-client]").forEach(x=>x.onclick=()=>openClient(x.dataset.client));
}
function openClient(id){
 const c=client(id); if(!c)return;
 $("clientDetail").innerHTML=`<div class="card"><div class="row"><div class="avatar">${initials(c.name)}</div><div><span class="eyebrow">${c.sector} · ${c.country}</span><h2>${c.name}</h2><div class="muted tiny">${c.career}</div></div></div>
 <div class="grid3" style="margin-top:12px"><div class="mini-stat"><span>FAME</span><b>${c.fame}</b></div><div class="mini-stat"><span>POTENTIAL</span><b>${c.potential}</b></div><div class="mini-stat"><span>LOYALTY</span><b class="score ${scoreClass(c.loyalty)}">${c.loyalty}</b></div></div></div>
 <div class="card"><div class="eyebrow">CAREER & MONEY</div>
 <div class="statline"><span>Current contract</span><b>${c.contract}</b></div><div class="statline"><span>Annual income</span><b>${money(c.income)}</b></div><div class="statline"><span>Agency commission</span><b>${c.commission}%</b></div><div class="statline"><span>Approx. agency revenue</span><b class="gold">${money(c.income*c.commission/100)}/yr</b></div><div class="statline"><span>Estimated value</span><b>${money(c.value)}</b></div></div>
 <div class="card"><div class="eyebrow">PRIVATE LIFE</div><div class="statline"><span>Partner</span><b>${c.partner}</b></div><div class="statline"><span>Children</span><b>${c.children}</b></div><div class="statline"><span>Family stability</span><b class="score ${scoreClass(c.family)}">${c.family}</b></div><div class="statline"><span>Entourage quality</span><b class="score ${scoreClass(c.entourage)}">${c.entourage}</b></div><div class="statline"><span>Known confidential risks</span><b class="${c.secrets?"bad":"good"}">${c.secrets}</b></div></div>
 <div class="card"><div class="eyebrow">WELLBEING</div><div class="statline"><span>Stress</span><b class="score ${scoreClass(100-c.stress)}">${c.stress}</b></div><div class="statline"><span>Public reputation</span><b>${c.reputation}</b></div></div>`;
 show("client");
}

function renderDeals(){
 $("dealList").innerHTML=S.deals.map(d=>{const c=client(d.clientId);return `<div class="card deal-card" data-deal="${d.id}"><div class="row-between"><div><span class="eyebrow">${d.kind} · ${d.status}</span><h3>${c?c.name:"Unknown"} → ${d.party}</h3></div><span class="chip">Day ${d.deadlineDay}</span></div><div class="grid2"><div class="mini-stat"><span>DEAL VALUE</span><b>${money(d.value)}</b></div><div class="mini-stat"><span>YOUR FEE</span><b class="gold">${money(d.agencyFee)}</b></div></div></div>`}).join("");
 document.querySelectorAll("[data-deal]").forEach(x=>x.onclick=()=>openDeal(x.dataset.deal));
}
function openDeal(id){
 const d=S.deals.find(x=>x.id===id),c=client(d.clientId); if(!d)return;
 const closed=["Signed","Withdrawn","Lost"].includes(d.status);
 $("dealDetail").innerHTML=`<div class="card"><span class="eyebrow">${d.kind.toUpperCase()}</span><h2>${c.name} × ${d.party}</h2>
 <div class="statline"><span>Current value</span><b>${money(d.value)}/yr</b></div><div class="statline"><span>Term</span><b>${d.years} years</b></div><div class="statline"><span>Signing bonus</span><b>${money(d.bonus)}</b></div><div class="statline"><span>Agency fee</span><b class="gold">${money(d.agencyFee)}</b></div><div class="statline"><span>Client interest</span><b>${d.interest}%</b></div><div class="statline"><span>Your leverage</span><b>${d.leverage}%</b></div><div class="statline"><span>Deadline</span><b>Day ${d.deadlineDay}</b></div><div class="statline"><span>Clauses</span><b>${d.clauses.join(" · ")}</b></div></div>
 ${closed?`<div class="section-card"><b>Status: ${d.status}</b></div>`:`<div class="choice-list">
 <button class="choice" data-neg="accept"><b>Accept current offer</b><small>Locks terms now.</small><div class="expected"><span class="good">Agency +${money(d.agencyFee)}</span><span class="good">Loyalty +3</span><span>1h</span></div></button>
 <button class="choice" data-neg="value"><b>Counter: +15% deal value</b><small>Uses leverage to improve client economics.</small><div class="expected"><span>Acceptance ~${clamp(Math.round(d.leverage*.85),25,78)}%</span><span class="good">Value +15%</span><span class="bad">Failure lowers leverage</span></div></button>
 <button class="choice" data-neg="fee"><b>Push agency fee +25%</b><small>Better for your agency, but the client may dislike it.</small><div class="expected"><span class="good">Fee +25%</span><span class="bad">Loyalty -3</span><span>Risk 35%</span></div></button>
 <button class="choice" data-neg="clauses"><b>Renegotiate restrictive clauses</b><small>Lower commercial/legal risk for the client.</small><div class="expected"><span>Cost €1,200 legal</span><span class="good">Loyalty +2</span><span>2h</span></div></button>
 <button class="choice" data-neg="walk"><b>Walk away</b><small>Ends the negotiation.</small><div class="expected"><span class="bad">Loyalty -5</span><span>€0</span></div></button>
 </div>`}`;
 document.querySelectorAll("[data-neg]").forEach(b=>b.onclick=()=>negotiate(d,c,b.dataset.neg)); show("deal");
}
function negotiate(d,c,action){
 if(action==="accept"){addLedger("Agency fee · "+d.party,d.agencyFee);c.income=d.value;c.loyalty=clamp(c.loyalty+3,0,100);d.status="Signed";addMedia(`${c.name} signs a new agreement with ${d.party}.`,"positive");S.influence=clamp(S.influence+3,0,100)}
 if(action==="value"){let chance=clamp(d.leverage*.85,25,78);if(Math.random()*100<chance){d.value=Math.round(d.value*1.15);d.agencyFee=Math.round(d.agencyFee*1.15);d.status="Improved offer";d.leverage=clamp(d.leverage+3,0,100);notify("Counter accepted: "+d.party)}else{d.leverage=clamp(d.leverage-12,0,100);d.status="Counter rejected";c.stress=clamp(c.stress+4,0,100)}}
 if(action==="fee"){d.agencyFee=Math.round(d.agencyFee*1.25);c.loyalty=clamp(c.loyalty-3,0,100);d.status="Fee under discussion";d.leverage=clamp(d.leverage-4,0,100)}
 if(action==="clauses"){if(S.cash<1200)return alert("Not enough cash.");addLedger("Legal review",-1200);d.clauses=d.clauses.map(x=>"Revised "+x);c.loyalty=clamp(c.loyalty+2,0,100);S.hour+=2;d.status="Clauses revised"}
 if(action==="walk"){d.status="Withdrawn";c.loyalty=clamp(c.loyalty-5,0,100)}
 advanceTime(action==="clauses"?0:1);save();openDeal(d.id);
}

function renderCrises(){
 const open=S.crises.filter(x=>x.status==="Open");$("crisisCount").textContent=`${open.length} open`;
 $("crisisList").innerHTML=(open.length?open.map(x=>{let t=CRISIS_TEMPLATES[x.template],c=client(x.clientId);return `<div class="card crisis-card" data-crisis="${x.id}"><div class="row-between"><div><span class="eyebrow">${t.type} · SEVERITY ${t.severity}</span><h3>${t.title}</h3><div class="muted tiny">${c.name}</div></div><span class="chip danger-chip">Day ${x.deadlineDay} · ${Math.floor(x.deadlineHour)}:00</span></div><p class="muted tiny">${t.text}</p></div>`}).join(""):'<div class="section-card muted">No active crises.</div>');
 document.querySelectorAll("[data-crisis]").forEach(x=>x.onclick=()=>openCrisis(x.dataset.crisis));
}
function openCrisis(id){
 const x=S.crises.find(v=>v.id===id),t=CRISIS_TEMPLATES[x.template],c=client(x.clientId); if(!x)return;
 $("crisisDetail").innerHTML=`<div class="card"><span class="eyebrow">${t.type} · SEVERITY ${t.severity}</span><h2>${t.title}</h2><p>${t.text}</p><div class="statline"><span>Client</span><b>${c.name}</b></div><div class="statline"><span>Deadline</span><b>Day ${x.deadlineDay} · ${Math.floor(x.deadlineHour)}:00</b></div><div class="statline"><span>Client stress</span><b>${c.stress}</b></div><div class="statline"><span>Known private risks</span><b>${c.secrets}</b></div></div>
 <div class="choice-list">${t.options.map((o,i)=>`<button class="choice" data-crisisopt="${i}"><b>${o.label}</b><small>${o.desc}</small><div class="expected"><span class="${o.cost?"bad":""}">${o.cost?money(o.cost):"€0"}</span><span>Time ${o.time}h</span><span class="${o.risk>50?"bad":o.risk<20?"good":"gold"}">Escalation ${o.risk}%</span><span>Rep ${o.rep[0]}…+${o.rep[1]}</span><span>Loyalty ${o.loy[0]}…+${o.loy[1]}</span></div></button>`).join("")}</div>`;
 document.querySelectorAll("[data-crisisopt]").forEach(b=>b.onclick=()=>resolveCrisis(x,t,c,+b.dataset.crisisopt));show("crisis");
}
function resolveCrisis(x,t,c,i){
 const o=t.options[i]; if(S.cash<o.cost)return alert("Not enough agency cash.");
 if(o.cost)addLedger("Crisis response · "+t.title,-o.cost);advanceTime(o.time);
 const rep=Math.round(o.rep[0]+Math.random()*(o.rep[1]-o.rep[0])); const loy=Math.round(o.loy[0]+Math.random()*(o.loy[1]-o.loy[0]));
 S.reputation=clamp(S.reputation+rep,0,100);c.loyalty=clamp(c.loyalty+loy,0,100);c.stress=clamp(c.stress-4,0,100);
 if(Math.random()*100<o.risk){c.reputation=clamp(c.reputation-8,0,100);c.stress=clamp(c.stress+10,0,100);c.secrets+=i===2?1:0;S.confidentialRisk+=i===2?1:0;addMedia(`${t.title} involving ${c.name} escalates publicly.`,"negative")}
 else addMedia(`${c.name}'s ${t.title.toLowerCase()} is brought under control.`,"positive");
 x.status="Resolved";save();show("crises");
}

function generateScouts(){
 const arr=[];for(let i=0;i<10;i++){let sector=pick(SECTORS);arr.push({id:uid(),name:pick(NAMES),sector,age:17+Math.floor(Math.random()*18),fame:8+Math.floor(Math.random()*53),potential:45+Math.floor(Math.random()*51),loyalty:45+Math.floor(Math.random()*35),stress:15+Math.floor(Math.random()*40),fee:1000+Math.floor(Math.random()*6500),commission:7+Math.floor(Math.random()*10),income:40000+Math.floor(Math.random()*650000),secrets:Math.random()<.25?1:0})}S.scoutMarket=arr;
}
function renderScout(){
 if(!S.scoutMarket.length)generateScouts();
 const filters=["All",...SECTORS];$("scoutFilters").innerHTML=filters.map(f=>`<button class="filter ${S.settings.scoutSector===f?"on":""}" data-filter="${f}">${f}</button>`).join("");
 document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{S.settings.scoutSector=b.dataset.filter;save();renderScout()});
 const list=S.scoutMarket.filter(x=>S.settings.scoutSector==="All"||x.sector===S.settings.scoutSector);
 $("scoutList").innerHTML=list.map(s=>`<div class="card"><div class="row-between"><div><span class="eyebrow">${s.sector} · AGE ${s.age}</span><h3>${s.name}</h3></div><span class="chip">${money(s.fee)}</span></div><div class="grid3"><div class="mini-stat"><span>FAME</span><b>${s.fame}</b></div><div class="mini-stat"><span>POTENTIAL</span><b>${s.potential}</b></div><div class="mini-stat"><span>ASKED COMM.</span><b>${s.commission}%</b></div></div><div class="statline"><span>Known risk</span><b class="${s.secrets?"bad":"good"}">${s.secrets?"Flagged":"None found"}</b></div><button class="primary" style="width:100%;margin-top:10px" data-sign="${s.id}">Approach talent · ${money(s.fee)}</button></div>`).join("")||'<div class="section-card muted">No prospects in this category.</div>';
 document.querySelectorAll("[data-sign]").forEach(b=>b.onclick=()=>signProspect(b.dataset.sign));
}
function signProspect(id){
 const p=S.scoutMarket.find(x=>x.id===id); if(!p)return;if(S.cash<p.fee)return alert("Not enough agency cash.");
 const capacity=agencyCapacity();if(S.clients.length>=capacity)return alert("Agency capacity is full. Hire staff or upgrade the agency.");
 addLedger("Talent acquisition · "+p.name,-p.fee);
 S.clients.push({id:"c"+uid(),name:p.name,sector:p.sector,age:p.age,fame:p.fame,potential:p.potential,loyalty:p.loyalty,stress:p.stress,reputation:55,value:p.fame*65000,income:p.income,commission:p.commission,contract:"New representation agreement · 2y",partner:"Unknown",children:0,family:60,entourage:50,secrets:p.secrets,career:"Developing talent",country:"Belgium"});
 S.scoutMarket=S.scoutMarket.filter(x=>x.id!==id);S.influence=clamp(S.influence+1,0,100);addMedia(`${p.name} signs with Present Talent Group.`,"positive");save();renderScout();
}

function agencyCapacity(){return 3+S.agencyLevel*3+S.staff.filter(x=>x.role.includes("Agent")).reduce((a,x)=>a+Math.max(1,Math.floor(x.skill/25)),0)}
function renderStaff(){
 $("staffList").innerHTML=S.staff.map(s=>`<div class="card staff-card"><div class="row-between"><div><span class="eyebrow">${s.role}</span><h3>${s.name}</h3></div><span class="chip">${money(s.salary)}/wk</span></div><div class="grid3"><div class="mini-stat"><span>SKILL</span><b>${s.skill}</b></div><div class="mini-stat"><span>LOYALTY</span><b>${s.loyalty}</b></div><div class="mini-stat"><span>ASSIGNED</span><b>${s.assigned||0}/${s.capacity||2}</b></div></div></div>`).join("");
 $("capacityChip").textContent=`${S.clients.length}/${agencyCapacity()} clients`;
 $("capacityBody").innerHTML=`<div class="statline"><span>Current client load</span><b>${S.clients.length}</b></div><div class="statline"><span>Maximum capacity</span><b>${agencyCapacity()}</b></div><div class="statline"><span>Weekly payroll</span><b>${money(S.staff.reduce((a,s)=>a+s.salary,0))}</b></div>`;
}
function openHireModal(){
 $("modalTitle").textContent="Recruit staff";
 $("modalBody").innerHTML=STAFF_ROLES.map(r=>{let skill=45+Math.floor(Math.random()*35);let salary=Math.round(r.salary[0]+Math.random()*(r.salary[1]-r.salary[0]));let name=pick(NAMES);return `<div class="card"><div class="row-between"><div><span class="eyebrow">${r.role}</span><h3>${name}</h3><div class="muted tiny">${r.bonus} · skill ${skill}</div></div><span class="chip">${money(salary)}/wk</span></div><button class="primary" style="width:100%;margin-top:9px" data-hire='${JSON.stringify({name,role:r.role,skill,salary}).replace(/'/g,"&#39;")}'>Hire</button></div>`}).join("");
 document.querySelectorAll("[data-hire]").forEach(b=>b.onclick=()=>{let d=JSON.parse(b.dataset.hire);S.staff.push({id:"s"+uid(),...d,capacity:2+Math.floor(d.skill/30),assigned:0,loyalty:65});addLedger("Recruitment fee",-Math.round(d.salary*1.5));save();closeModal();renderStaff()});
 $("modal").classList.remove("hidden");
}
function closeModal(){$("modal").classList.add("hidden")}

function renderFinance(){
 const weeklyComm=S.clients.reduce((a,c)=>a+c.income*c.commission/100/52,0);
 const payroll=S.staff.reduce((a,s)=>a+s.salary,0);const office=600+S.agencyLevel*450;const net=weeklyComm-payroll-office;
 $("financeCash").textContent=money(S.cash);
 $("financeBody").innerHTML=`<div class="grid2"><div class="card"><span class="eyebrow">CASH</span><h2>${money(S.cash)}</h2></div><div class="card"><span class="eyebrow">EST. WEEKLY NET</span><h2 class="${net>=0?"good":"bad"}">${money(net)}</h2></div></div>
 <div class="card"><div class="eyebrow">WEEKLY ECONOMICS</div><div class="statline"><span>Client commissions</span><b class="good">${money(weeklyComm)}</b></div><div class="statline"><span>Staff payroll</span><b class="bad">-${money(payroll)}</b></div><div class="statline"><span>Office & systems</span><b class="bad">-${money(office)}</b></div></div>
 <div class="card"><div class="eyebrow">CLIENT REVENUE</div>${S.clients.map(c=>`<div class="statline"><span>${c.name}<div class="muted tiny">${c.commission}% commission</div></span><b>${money(c.income*c.commission/100/52)}/wk</b></div>`).join("")}</div>
 <div class="card"><div class="eyebrow">RECENT LEDGER</div>${S.ledger.slice(0,12).map(l=>`<div class="statline"><span>Day ${l.day} · ${l.type}</span><b class="${l.amount>=0?"good":"bad"}">${l.amount>=0?"+":""}${money(l.amount)}</b></div>`).join("")}</div>`;
}

function renderMedia(){
 $("mediaList").innerHTML=S.media.map(m=>`<div class="card news ${m.tone==="negative"?"urgent":""}"><span class="eyebrow">${m.tone==="negative"?"BREAKING":m.tone==="positive"?"POSITIVE":"INDUSTRY"}</span><h3>${m.headline}</h3><div class="muted tiny">Day ${m.day}</div></div>`).join("");
}
function renderRivals(){
 $("rivalList").innerHTML=S.rivals.map(r=>`<div class="card rival-card"><div class="row-between"><div><span class="eyebrow">RIVAL AGENCY</span><h3>${r.name}</h3></div><span class="chip">${r.clients} clients</span></div><div class="grid3"><div class="mini-stat"><span>REP</span><b>${r.reputation}</b></div><div class="mini-stat"><span>INFLUENCE</span><b>${r.influence}</b></div><div class="mini-stat"><span>AGGRESSION</span><b>${r.aggression}</b></div></div><div class="muted tiny" style="margin-top:8px">Estimated cash ${money(r.cash)}</div></div>`).join("");
}
function renderAgency(){
 $("agencyLevelChip").textContent=`Level ${S.agencyLevel}`;
 const cost=S.agencyLevel*25000;
 $("agencyBody").innerHTML=`<div class="card"><span class="eyebrow">PRESENT TALENT GROUP</span><h2>Agency Level ${S.agencyLevel}</h2><p class="muted">Client capacity, reputation and specialist staff determine how much business you can handle without losing control.</p>
 <div class="statline"><span>Client capacity</span><b>${S.clients.length}/${agencyCapacity()}</b></div><div class="statline"><span>Confidential risk files</span><b class="${S.confidentialRisk>3?"bad":"gold"}">${S.confidentialRisk}</b></div><div class="statline"><span>Reputation</span><b>${S.reputation}</b></div><div class="statline"><span>Influence</span><b>${S.influence}</b></div></div>
 <div class="card"><span class="eyebrow">UPGRADE</span><h3>Expand headquarters</h3><p class="muted tiny">Adds base client capacity and strengthens your market position.</p><button id="upgradeAgency" class="primary" style="width:100%">Upgrade · ${money(cost)}</button></div>
 <div class="card"><span class="eyebrow">CAREER CONTROL</span><div class="toolbar"><button id="manualSave" class="soft">Save career</button><button id="newCareer" class="danger-btn">New career</button></div></div>`;
 $("upgradeAgency").onclick=()=>{if(S.cash<cost)return alert("Not enough cash.");addLedger("Agency HQ upgrade",-cost);S.agencyLevel++;S.influence=clamp(S.influence+4,0,100);save();renderAgency()};
 $("manualSave").onclick=()=>{save();alert("Career saved on this device.")};
 $("newCareer").onclick=()=>{if(confirm("Start a completely new career?")){S=seed();save();render();show("home")}};
}

function weeklyAccounting(){
 const income=S.clients.reduce((a,c)=>a+c.income*c.commission/100/52,0);
 const payroll=S.staff.reduce((a,s)=>a+s.salary,0),office=600+S.agencyLevel*450;
 addLedger("Weekly client commissions",income);addLedger("Staff payroll",-payroll);addLedger("Office & systems",-office);
}
function maybeWorldEvent(){
 const c=pick(S.clients),roll=Math.random();
 if(roll<.18){c.fame=clamp(c.fame+3,0,100);c.value=Math.round(c.value*1.05);addMedia(`${c.name} has a strong career week and gains visibility.`,"positive")}
 else if(roll<.32){c.stress=clamp(c.stress+6,0,100);addMedia(`${c.name} faces increased schedule pressure.`,"neutral")}
 else if(roll<.42){c.family=clamp(c.family-6,0,100);addMedia(`${c.name}'s private schedule creates family tension.`,"neutral")}
 else if(roll<.52){let r=pick(S.rivals);r.clients++;r.influence=clamp(r.influence+1,0,100);addMedia(`${r.name} signs another emerging talent.`,"neutral")}
 if(Math.random()<.18 && S.crises.filter(x=>x.status==="Open").length<4){
   const idx=Math.floor(Math.random()*CRISIS_TEMPLATES.length);S.crises.push({id:"x"+uid(),clientId:c.id,template:idx,deadlineDay:S.day+1,deadlineHour:16,status:"Open"});notify("New crisis: "+CRISIS_TEMPLATES[idx].title)
 }
 if(Math.random()<.16){
   const d={id:"d"+uid(),clientId:c.id,party:pick(["Atlas Sportswear","StreamHouse","Redline Studios","United FC","Global Records","Prime Mobile"]),kind:pick(["Brand campaign","Contract renewal","Commercial appearance"]),value:80000+Math.floor(Math.random()*850000),years:1+Math.floor(Math.random()*3),bonus:Math.floor(Math.random()*150000),agencyFee:15000+Math.floor(Math.random()*90000),status:"Offer received",interest:50+Math.floor(Math.random()*40),leverage:35+Math.floor(Math.random()*40),round:1,deadlineDay:S.day+3,clauses:["Standard conduct clause"]};S.deals.push(d);S.mails.unshift({id:"e"+uid(),from:d.party,subject:`Offer — ${c.name}`,body:`New ${d.kind.toLowerCase()} proposal worth approximately ${money(d.value)}.`,unread:true,dealId:d.id});notify("New deal offer for "+c.name)
 }
}
function checkDeadlines(){
 S.crises.filter(x=>x.status==="Open").forEach(x=>{if(S.day>x.deadlineDay || (S.day===x.deadlineDay&&S.hour>x.deadlineHour)){let t=CRISIS_TEMPLATES[x.template],c=client(x.clientId);x.status="Missed";S.reputation=clamp(S.reputation-8,0,100);c.reputation=clamp(c.reputation-10,0,100);c.stress=clamp(c.stress+12,0,100);addMedia(`${t.title} involving ${c.name} explodes after the agency misses the response window.`,"negative")}});
 S.deals.forEach(d=>{if(!["Signed","Withdrawn","Lost"].includes(d.status)&&S.day>d.deadlineDay){d.status="Lost";let c=client(d.clientId);c.loyalty=clamp(c.loyalty-4,0,100);addMedia(`${d.party} withdraws its offer for ${c.name}.`,"negative")}})
 S.calendar.filter(x=>!x.done && x.day<S.day).forEach(x=>{x.done=true;S.reputation=clamp(S.reputation-1,0,100);notify("Missed appointment: "+x.title)})
}
function advanceTime(hours){
 S.hour+=hours;
 while(S.hour>=18){S.hour=8.5;S.day++;S.weekday=(S.weekday+1)%7;if(S.weekday===0){S.week++;weeklyAccounting();if(S.week>52){S.week=1;S.season++}}
   S.clients.forEach(c=>{c.stress=clamp(c.stress-2+Math.floor(Math.random()*5),0,100);c.loyalty=clamp(c.loyalty+(Math.random()<.5?1:-1),0,100);if(c.stress>80)c.loyalty=clamp(c.loyalty-2,0,100)});
   maybeWorldEvent();
 }
 checkDeadlines();save();
}
$("advanceHour").onclick=()=>{advanceTime(1);render()};
$("advanceDay").onclick=()=>{S.hour=18;advanceTime(.1);render()};
$("refreshScout").onclick=()=>{if(S.cash<1500)return alert("Not enough cash.");addLedger("Scouting campaign",-1500);generateScouts();save();renderScout()};
$("openHire").onclick=openHireModal;$("closeModal").onclick=closeModal;

function render(){
 renderApps();renderHome();renderMessages();renderMail();renderCalendar();renderClients();renderDeals();renderCrises();renderScout();renderStaff();renderFinance();renderMedia();renderRivals();renderAgency();
}
render();
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
})();
