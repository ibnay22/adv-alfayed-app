import { useState, useEffect, useRef } from "react";

// ── FONTS ──
const fl = document.createElement("link");
fl.href = "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
fl.rel = "stylesheet"; document.head.appendChild(fl);

// ── THEME ──
const T = {
  black:"#09090F", dark:"#0F0F18", card:"#16161F", card2:"#1C1C28",
  border:"#24243A", crimson:"#B5202B", crimsonL:"#DC2626", crimsonD:"#450A0A",
  gold:"#C9961A", goldL:"#F0B429", goldD:"#2D1F00",
  white:"#EDE8DC", gray:"#6B6B80", grayL:"#2A2A3E",
  green:"#16A34A", greenD:"#052E16", blue:"#1D4ED8", blueD:"#0D1B3E",
  purple:"#7C3AED", purpleD:"#1E0A4A", orange:"#C2410C", orangeD:"#2C0E00",
  teal:"#0F766E", tealD:"#012220",
};

// ── STORAGE — uses localStorage, works on all phones and browsers ──
async function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
async function load(k,fb=null){try{const r=localStorage.getItem(k);return r?JSON.parse(r):fb;}catch(e){return fb;}}
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2);
const today=()=>new Date().toISOString().split("T")[0];
const fmtD=(d)=>{if(!d)return"—";return new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});};
const fmtM=(d)=>{if(!d)return"—";return new Date(d).toLocaleDateString("en-IN",{month:"long",year:"numeric"});};
const dLeft=(d)=>{if(!d)return null;return Math.ceil((new Date(d)-new Date())/86400000);};

// ── PROVISIONS DATABASE ──
const PROVISIONS_DB = {
  "Civil": [
    {s:"Order VII Rule 1 CPC",a:"Code of Civil Procedure 1908",p:"Particulars of plaint"},
    {s:"Order VIII Rule 1 CPC",a:"Code of Civil Procedure 1908",p:"Written statement"},
    {s:"Order XX Rule 18 CPC",a:"Code of Civil Procedure 1908",p:"Decree for partition of immovable property"},
    {s:"Order XXXIX Rules 1 & 2 CPC",a:"Code of Civil Procedure 1908",p:"Temporary injunction"},
    {s:"Order VI Rule 17 CPC",a:"Code of Civil Procedure 1908",p:"Amendment of pleadings"},
    {s:"Section 9 CPC",a:"Code of Civil Procedure 1908",p:"Courts to try all civil suits"},
    {s:"Section 16 CPC",a:"Code of Civil Procedure 1908",p:"Suits relating to immovable property — jurisdiction"},
    {s:"Section 20 CPC",a:"Code of Civil Procedure 1908",p:"Other suits — place of suing"},
    {s:"Section 6",a:"Specific Relief Act 1963",p:"Recovery of specific immovable property"},
    {s:"Section 34",a:"Specific Relief Act 1963",p:"Declaratory decrees"},
    {s:"Section 38",a:"Specific Relief Act 1963",p:"Perpetual injunction"},
    {s:"Section 39",a:"Specific Relief Act 1963",p:"Mandatory injunction"},
    {s:"Section 54",a:"Transfer of Property Act 1882",p:"Sale of immovable property"},
    {s:"Section 58",a:"Transfer of Property Act 1882",p:"Mortgage — definition and types"},
    {s:"Section 105",a:"Transfer of Property Act 1882",p:"Lease of immovable property"},
    {s:"Article 58",a:"Limitation Act 1963",p:"Suit for declaration — 3 years"},
    {s:"Article 65",a:"Limitation Act 1963",p:"Suit for possession based on title — 12 years"},
    {s:"Section 4",a:"West Bengal Land Reforms Act 1955",p:"Rights of raiyat"},
    {s:"Section 14A",a:"West Bengal Land Reforms Act 1955",p:"Restriction on transfer"},
    {s:"Order XXI CPC",a:"Code of Civil Procedure 1908",p:"Execution of decrees and orders"},
    {s:"Section 89 CPC",a:"Code of Civil Procedure 1908",p:"Settlement of disputes outside court / ADR"},
  ],
  "Criminal": [
    {s:"Section 103 BNS",a:"Bharatiya Nyaya Sanhita 2023",p:"Murder"},
    {s:"Section 115 BNS",a:"Bharatiya Nyaya Sanhita 2023",p:"Voluntarily causing hurt"},
    {s:"Section 316 BNS",a:"Bharatiya Nyaya Sanhita 2023",p:"Cheating"},
    {s:"Section 317 BNS",a:"Bharatiya Nyaya Sanhita 2023",p:"Cheating by personation"},
    {s:"Section 318 BNS",a:"Bharatiya Nyaya Sanhita 2023",p:"Cheating and dishonestly inducing delivery of property"},
    {s:"Section 351 BNS",a:"Bharatiya Nyaya Sanhita 2023",p:"Criminal intimidation"},
    {s:"Section 329 BNS",a:"Bharatiya Nyaya Sanhita 2023",p:"Mischief"},
    {s:"Section 85 BNS",a:"Bharatiya Nyaya Sanhita 2023",p:"Husband or relatives cruelty — dowry"},
    {s:"Section 74 BNS",a:"Bharatiya Nyaya Sanhita 2023",p:"Assault or use of criminal force on woman"},
    {s:"Section 480 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Bail in bailable offences"},
    {s:"Section 481 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Bail in non-bailable offences"},
    {s:"Section 482 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Bail — special powers of High Court"},
    {s:"Section 528 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Inherent powers to prevent abuse"},
    {s:"Section 144 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Maintenance of wives, children and parents"},
    {s:"Section 138",a:"Negotiable Instruments Act 1881",p:"Dishonour of cheque — prosecution"},
    {s:"Section 139",a:"Negotiable Instruments Act 1881",p:"Presumption in favour of holder"},
    {s:"Section 142",a:"Negotiable Instruments Act 1881",p:"Cognizance of offences under NI Act"},
    {s:"Section 65B",a:"Indian Evidence Act 1872 / BSA 2023",p:"Admissibility of electronic records"},
    {s:"Section 4 & 6",a:"POCSO Act 2012",p:"Penetrative and aggravated penetrative sexual assault"},
    {s:"Section 482 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Quashing of FIR — inherent jurisdiction"},
  ],
  "Family/Matrimonial": [
    {s:"Section 13",a:"Hindu Marriage Act 1955",p:"Divorce — grounds"},
    {s:"Section 13B",a:"Hindu Marriage Act 1955",p:"Divorce by mutual consent"},
    {s:"Section 9",a:"Hindu Marriage Act 1955",p:"Restitution of conjugal rights"},
    {s:"Section 24",a:"Hindu Marriage Act 1955",p:"Maintenance pendente lite"},
    {s:"Section 25",a:"Hindu Marriage Act 1955",p:"Permanent alimony and maintenance"},
    {s:"Section 26",a:"Hindu Marriage Act 1955",p:"Custody of children"},
    {s:"Section 144 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Maintenance of wife, children and parents"},
    {s:"Section 12",a:"Protection of Women from DV Act 2005",p:"Application to Magistrate"},
    {s:"Section 18",a:"Protection of Women from DV Act 2005",p:"Protection orders"},
    {s:"Section 19",a:"Protection of Women from DV Act 2005",p:"Residence orders"},
    {s:"Section 20",a:"Protection of Women from DV Act 2005",p:"Monetary relief"},
    {s:"Section 6",a:"Hindu Minority and Guardianship Act 1956",p:"Natural guardians of minor"},
    {s:"Section 8",a:"Hindu Minority and Guardianship Act 1956",p:"Powers of natural guardian"},
    {s:"Section 14",a:"Hindu Succession Act 1956",p:"Property of a female Hindu"},
    {s:"Section 6",a:"Hindu Succession Act 1956",p:"Devolution of coparcenary property"},
  ],
  "GST": [
    {s:"Section 73",a:"CGST Act 2017",p:"Determination of tax — non-fraud cases"},
    {s:"Section 74",a:"CGST Act 2017",p:"Determination of tax — fraud / suppression"},
    {s:"Section 61",a:"CGST Act 2017",p:"Scrutiny of returns"},
    {s:"Section 65",a:"CGST Act 2017",p:"Audit by tax authorities"},
    {s:"Section 66",a:"CGST Act 2017",p:"Special audit"},
    {s:"Section 67",a:"CGST Act 2017",p:"Inspection, search and seizure"},
    {s:"Section 83",a:"CGST Act 2017",p:"Provisional attachment of property"},
    {s:"Section 107",a:"CGST Act 2017",p:"Appeals to Appellate Authority"},
    {s:"Section 112",a:"CGST Act 2017",p:"Appeals to Appellate Tribunal"},
    {s:"Section 16",a:"CGST Act 2017",p:"Eligibility for input tax credit"},
    {s:"Section 17(5)",a:"CGST Act 2017",p:"Blocked ITC — ineligible credits"},
    {s:"Section 129",a:"CGST Act 2017",p:"Detention, seizure and release of goods"},
    {s:"Section 130",a:"CGST Act 2017",p:"Confiscation of goods or conveyances"},
    {s:"Rule 142",a:"CGST Rules 2017",p:"Notice and order for demand of amounts"},
    {s:"Article 226",a:"Constitution of India",p:"Writ jurisdiction of High Court — for GST challenge"},
  ],
  "Writ/Petition": [
    {s:"Article 226",a:"Constitution of India",p:"Power of High Courts to issue writs"},
    {s:"Article 227",a:"Constitution of India",p:"Power of superintendence over all courts"},
    {s:"Article 32",a:"Constitution of India",p:"Remedies for enforcement of fundamental rights — SC"},
    {s:"Article 14",a:"Constitution of India",p:"Right to equality"},
    {s:"Article 19",a:"Constitution of India",p:"Right to freedom"},
    {s:"Article 21",a:"Constitution of India",p:"Protection of life and personal liberty"},
    {s:"Article 300A",a:"Constitution of India",p:"Right to property — no deprivation without authority of law"},
    {s:"Section 482 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Inherent powers of High Court"},
    {s:"Section 528 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"HC inherent powers to prevent abuse of process"},
    {s:"Order 47 Rule 1 CPC",a:"Code of Civil Procedure 1908",p:"Review of judgment"},
  ],
  "Appeal": [
    {s:"Section 96 CPC",a:"Code of Civil Procedure 1908",p:"Appeal from original decree"},
    {s:"Section 100 CPC",a:"Code of Civil Procedure 1908",p:"Second appeal to High Court"},
    {s:"Section 104 CPC",a:"Code of Civil Procedure 1908",p:"Orders from which appeal lies"},
    {s:"Order XLI CPC",a:"Code of Civil Procedure 1908",p:"Appeals from original decrees — procedure"},
    {s:"Section 374 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Appeal in criminal cases"},
    {s:"Section 378 BNSS",a:"Bharatiya Nagarik Suraksha Sanhita 2023",p:"Appeal in cases of acquittal"},
    {s:"Section 107",a:"CGST Act 2017",p:"Appeal to Appellate Authority"},
    {s:"Article 136",a:"Constitution of India",p:"Special leave to appeal — Supreme Court"},
  ],
};

const CASE_TYPES = Object.keys(PROVISIONS_DB);
const COURTS = ["Mathabhanga Sub-Division Court","Cooch Behar District Court","Cooch Behar Sessions Court","Calcutta High Court","Supreme Court of India","CGST Authority","GST Appellate Authority","Consumer Forum (Dist.)","Family Court","Other"];
const STAGES = ["Pre-Filing / Consultation","Plaint/Petition Filed","Notice Issued","Written Statement Filed","Replication Filed","Issues Framed","Evidence Stage","Examination in Chief","Cross Examination","Argument Stage","Order Reserved","Decree/Judgment Passed","Execution Stage","Appeal Filed","Bail Application Filed","Bail Granted","Bail Rejected","Charge Framed","Trial Stage","Acquittal/Conviction","GST Notice Received","Reply Filed","Personal Hearing","GST Order Passed","Disposed/Closed","Other"];
const PARTY_ROLES = {"Civil":["Plaintiff","Defendant"],"Criminal":["Accused","Prosecution/State"],"Writ/Petition":["Petitioner","Respondent"],"Appeal":["Appellant","Respondent"],"GST":["Taxpayer/Assessee","Revenue Authority"],"Family/Matrimonial":["Petitioner","Respondent"]};
const DOC_TYPES = ["Plaint","Written Statement","Affidavit","Bail Application","Vakalatnama","FIR Copy","Charge Sheet","Land Deed/Khatian","Tax Invoice","GST Notice","Court Order","Judgment","Appeal Memo","Replication","Evidence Affidavit","Interim Application","Legal Notice","Reply to Notice","Other"];
const MONEY_SOURCES = ["Case Professional Fee","Consultation Fee","Drafting Fee","Court Appearance","Retainer (Monthly)","Miscellaneous"];

const TYPE_C = {
  "Civil":{bg:"#0D1F3C",br:"#1B4F8A",tx:"#60A5FA"},
  "Criminal":{bg:"#2C0A0A",br:"#7B1A13",tx:"#F87171"},
  "Writ/Petition":{bg:"#1A0A2C",br:"#5A2A8A",tx:"#C4B5FD"},
  "Appeal":{bg:"#052E16",br:"#166534",tx:"#4ADE80"},
  "GST":{bg:"#2C1A00",br:"#92400E",tx:"#FCD34D"},
  "Family/Matrimonial":{bg:"#2C0A1A",br:"#831843",tx:"#F9A8D4"},
  "Miscellaneous":{bg:"#1A1A0A",br:"#4A4A10",tx:"#D4D460"},
};

// ── AI ENGINE ──
async function callAI(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:[{role:"user",content:prompt}]})
  });
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if(data.error) throw new Error(data.error.message);
  const text = data.content.map(i=>i.text||"").join("");
  const match = text.match(/\{[\s\S]*\}/);
  if(!match) throw new Error("No JSON in response");
  try { return JSON.parse(match[0]); }
  catch(e) { return JSON.parse(match[0].replace(/,(\s*[}\]])/g,"$1")); }
}

async function genBrief(cs, client) {
  const provs = (cs.provisions||[]).map(p=>`${p.section} of ${p.act} — ${p.purpose}`).join("\n")||"Not specified";
  const tl = (cs.timeline||[]).map((t,i)=>`${i+1}.[${t.date}] ${t.action}: ${t.notes||""}`).join("\n")||"None";
  const prompt = `You are a Senior Advocate of Calcutta High Court briefing a junior at Mathabhanga Subdivision Court, West Bengal.

CASE: ${cs.title} | TYPE: ${cs.type} | COURT: ${cs.court}
CLIENT: ${client?.name||"Client"} as ${cs.clientRole||"Plaintiff"}
OPPOSITE: ${cs.oppName||"Opposite Party"} as ${cs.oppRole||"Defendant"} | OPP. ADVOCATE: ${cs.oppAdvocate||"Unknown"}
STAGE: ${cs.stage} | CLAIM VALUE: Rs.${cs.claimValue||"Not stated"}
CASE NO: ${cs.caseNo||"Not registered yet"}
PROVISIONS:\n${provs}
TIMELINE:\n${tl}

Reply ONLY in this JSON (no markdown, no text outside braces):
{"executiveSummary":"2-3 sentence summary",
"clientPosition":{"role":"${cs.clientRole||"Plaintiff"}","strengths":["s1","s2","s3"],"weaknesses":["w1","w2"],"strategy":"Full strategy paragraph"},
"provisionsAnalysis":[{"provision":"section","act":"act","relevance":"how it applies","advantage":"use in client favour","counter":"how opp may challenge"}],
"defenceStrategy":{"whatToDo":["Action 1 — what specifically to do","Action 2"],"whereToDo":["Step 1 — which court/office/authority to go to and file/appear","Step 2"],"howToDo":["Step 1 — exact procedure, forms, affidavit requirements","Step 2"]},
"supremeCourtCaseLaws":[{"citation":"Name v Name (Year) X SCC XXX","ratio":"principle","applicability":"how it helps"}],
"calcuttaHCPrecedents":[{"citation":"Name v Name Year Cal","ratio":"principle","applicability":"local relevance"}],
"presidentialOrdersByLaws":[{"title":"Order/Notification","reference":"ref no","relevance":"applicability"}],
"nextSteps":[{"step":"title","description":"what to do","urgency":"High/Medium/Low","timeframe":"X days","underSection":"Section X Act Y"}],
"draftApplications":[{"title":"Document","purpose":"why needed","keyPoints":["p1","p2"],"template":"draft text"}],
"jurisdiction":{"currentCourt":"${cs.court}","pecuniaryJurisdiction":"explanation","territorialJurisdiction":"explanation","nextForum":"appellate forum"},
"courtFee":{"amount":"Rs.XXX","basis":"Court Fees Act 1870 calculation","additionalDuties":"stamp duty etc"},
"limitation":{"period":"X years Article XX Limitation Act 1963","startDate":"when started","expiryDate":"expiry","warningIfAny":""},
"evidenceStrategy":["evidence 1","evidence 2"],
"witnessStrategy":["witness 1 — proves what","witness 2"],
"argumentOutline":"Structured argument for court — numbered points",
"keyRisks":["risk 1 with mitigation","risk 2"]}`;
  return await callAI(prompt);
}

async function genStepAI(cs, step, timeline) {
  const provs = (cs.provisions||[]).map(p=>`${p.section} of ${p.act}`).join(", ")||"Not specified";
  const tl = timeline.map((t,i)=>`${i+1}.[${t.date}] ${t.action}`).join("\n");
  const prompt = `Senior Indian Advocate advising junior at Mathabhanga Court on this step:
STEP: "${step.action}" | NOTES: "${step.notes||""}"
CASE: ${cs.title} | TYPE: ${cs.type} | COURT: ${cs.court} | STAGE: ${step.stage||cs.stage}
PROVISIONS: ${provs}
TIMELINE:\n${tl}

Reply ONLY JSON:
{"immediateNextSteps":[{"step":"title","description":"what to do","urgency":"High/Medium/Low","timeframe":"X days","underSection":"Section X"}],
"courtFee":{"amount":"Rs.XXX or NA","basis":"calculation"},
"limitation":{"period":"X years or NA","warning":""},
"keyLaws":["law — relevance"],
"caseLaws":[{"citation":"Case (Year)","ratio":"principle","applicability":"relevance"}],
"defenceStrategy":{"whatToDo":["what 1","what 2"],"whereToDo":["where 1","where 2"],"howToDo":["how 1","how 2"]},
"draftNeeded":{"title":"doc title","purpose":"why","keyPoints":["p1","p2"],"template":"draft"},
"risks":["risk 1"],
"strategicTip":"Key advice for this moment"}`;
  return await callAI(prompt);
}

// ── SAMPLE DATA ──
const SAMPLE = [{
  id:"c1", name:"Ramesh Kumar Das", nameBn:"রমেশ কুমার দাস",
  phone:"9800001111", whatsapp:"9800001111", email:"", address:"Mathabhanga Town, Ward No. 4",
  age:"48", gender:"Male", occupation:"Farmer", religion:"Hindu",
  idType:"Aadhaar", idNo:"XXXX-XXXX-1234", referred:"CA Suresh Sharma",
  emergencyContact:"Sunil Das — 9800002222", clientType:"Individual",
  status:"Active", since:"2024-01-10", notes:"Pays on time. Prefers WhatsApp updates.",
  cases:[{
    id:"cs1", title:"Land Partition Suit", type:"Civil",
    court:"Mathabhanga Sub-Division Court", caseNo:"T.S. 12/2024",
    filingDate:"2024-01-15", nextDate:"2025-05-15", nextPurpose:"Cross examination of PW-1",
    caseStatus:"Ongoing", stage:"Written Statement Filed",
    clientRole:"Plaintiff", oppRole:"Defendant",
    oppName:"Suresh Kumar Das & Others", oppAdvocate:"Adv. Ratan Mondal", oppAdvPhone:"9700001111",
    fees:8000, paid:5000, claimValue:500000, notes:"3 defendants — brothers of client.",
    provisions:[
      {id:"p1",section:"Order XX Rule 18 CPC",act:"Code of Civil Procedure 1908",purpose:"Decree for partition of immovable property"},
      {id:"p2",section:"Section 4",act:"West Bengal Land Reforms Act 1955",purpose:"Rights of raiyat over agricultural land"},
    ],
    timeline:[
      {id:"t1",date:"2024-01-15",action:"Plaint Filed",stage:"Plaint/Petition Filed",notes:"Plaint filed for partition of 2.5 bigha agricultural land, Mouza Mathabhanga, CS Dag No. 455.",docName:"Plaint.pdf",aiGuidance:null},
      {id:"t2",date:"2024-03-20",action:"WS Filed by Defendants",stage:"Written Statement Filed",notes:"Defendants denied joint family. Claimed self-acquired property.",docName:"",aiGuidance:null},
    ],
    docs:[], legalBrief:null, aiSuggestions:[]
  }],
}];

// ══════════════════
// COMPONENTS
// ══════════════════
function Av({name,size=44}){
  const i=(name||"?").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
  const cs=[T.crimson,"#1B4F8A","#166534","#7C3AED","#C2410C"];
  return <div style={{width:size,height:size,borderRadius:"50%",background:cs[(name||"A").charCodeAt(0)%cs.length],display:"flex",alignItems:"center",justifyContent:"center",color:T.white,fontSize:size*.34,fontWeight:800,fontFamily:"'DM Sans',sans-serif",flexShrink:0,border:`2px solid ${T.border}`}}>{i}</div>;
}

function Chip({label,colors,sm}){
  const c=colors||TYPE_C[label]||{bg:T.grayL,br:T.border,tx:T.gray};
  return <span style={{background:c.bg,color:c.tx,border:`1px solid ${c.br}`,borderRadius:20,padding:sm?"1px 7px":"2px 9px",fontSize:sm?9:10,fontWeight:700,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{(label||"").toUpperCase()}</span>;
}

function Modal({show,onClose,title,children}){
  if(!show) return null;
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:600,display:"flex",alignItems:"flex-end",maxWidth:480,margin:"0 auto",backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:T.dark,borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"95vh",overflow:"auto",border:`1px solid ${T.border}`,borderBottom:"none",boxShadow:`0 -8px 48px #B5202B33`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 18px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,background:T.dark,zIndex:10}}>
        <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:16,fontWeight:700,color:T.white}}>{title}</div>
        <button onClick={onClose} style={{background:T.grayL,border:"none",borderRadius:7,width:28,height:28,cursor:"pointer",color:T.gray,fontSize:14}}>✕</button>
      </div>
      <div style={{padding:"14px 18px 36px",display:"flex",flexDirection:"column",gap:12}}>{children}</div>
    </div>
  </div>;
}

function F({label,value,onChange,type="text",placeholder,required,rows}){
  const base={padding:"10px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.card,color:T.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",width:"100%",boxSizing:"border-box"};
  return <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:10,fontWeight:700,color:T.gold,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em"}}>{label}{required&&<span style={{color:T.crimsonL}}> *</span>}</label>}
    {rows
      ?<textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...base,resize:"vertical"}} onFocus={e=>e.target.style.border=`1.5px solid ${T.crimson}`} onBlur={e=>e.target.style.border=`1.5px solid ${T.border}`}/>
      :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e=>e.target.style.border=`1.5px solid ${T.crimson}`} onBlur={e=>e.target.style.border=`1.5px solid ${T.border}`}/>
    }
  </div>;
}

function S({label,value,onChange,options}){
  return <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:10,fontWeight:700,color:T.gold,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em"}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"10px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.card,color:T.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none"}}>
      {options.map(o=><option key={o}>{o}</option>)}
    </select>
  </div>;
}

function Btn({onClick,children,color,outline,disabled,sm}){
  return <button onClick={onClick} disabled={disabled} style={{padding:sm?"7px 14px":"12px 20px",borderRadius:10,border:outline?`1.5px solid ${color||T.crimson}`:"none",background:disabled?T.grayL:outline?"transparent":(color||T.crimson),color:disabled?T.gray:outline?(color||T.crimsonL):T.white,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:sm?11:13,opacity:disabled?.6:1}}>{children}</button>;
}

function Card({children,style={}}){
  return <div style={{background:T.card,borderRadius:14,padding:"14px",border:`1px solid ${T.border}`,...style}}>{children}</div>;
}

function SecHead({icon,title,color,sub}){
  return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
    <span style={{fontSize:16}}>{icon}</span>
    <div>
      <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:14,fontWeight:700,color:color||T.gold}}>{title}</div>
      {sub&&<div style={{fontSize:10,color:T.gray}}>{sub}</div>}
    </div>
  </div>;
}

function Nav({view,setView}){
  const items=[
    {id:"home",icon:"🏛️",label:"Diary"},
    {id:"clients",icon:"👥",label:"Clients"},
    {id:"dates",icon:"📅",label:"Dates"},
    {id:"misc",icon:"📋",label:"Misc"},
    {id:"money",icon:"₹",label:"Money"},
    {id:"docs",icon:"📁",label:"Docs"},
  ];
  return <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.dark,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:100,maxWidth:480,margin:"0 auto"}}>
    {items.map(it=><button key={it.id} onClick={()=>setView(it.id)} style={{flex:1,padding:"9px 0 5px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:view===it.id?T.crimsonL:T.gray}}>
      <span style={{fontSize:17}}>{it.icon}</span>
      <span style={{fontSize:8,fontFamily:"'DM Sans',sans-serif",fontWeight:view===it.id?700:400}}>{it.label}</span>
      {view===it.id&&<div style={{width:14,height:2,background:T.crimsonL,borderRadius:2}}/>}
    </button>)}
  </div>;
}

// ── PROVISIONS POPUP ──
function ProvisionsPopup({caseType, onSelect, onClose}){
  const [q,setQ]=useState("");
  const list=(PROVISIONS_DB[caseType]||[]).filter(p=>!q||(p.s+p.a+p.p).toLowerCase().includes(q.toLowerCase()));
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:700,display:"flex",alignItems:"flex-end",maxWidth:480,margin:"0 auto"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:T.dark,borderRadius:"20px 20px 0 0",width:"100%",height:"85vh",display:"flex",flexDirection:"column",border:`1px solid ${T.border}`,borderBottom:"none"}}>
      <div style={{padding:"16px 18px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:15,fontWeight:700,color:"#60A5FA"}}>⚖️ Provisions — {caseType}</div>
          <button onClick={onClose} style={{background:T.grayL,border:"none",borderRadius:7,width:28,height:28,cursor:"pointer",color:T.gray,fontSize:14}}>✕</button>
        </div>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search section, act, or keyword..." style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.card,color:T.white,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}/>
      </div>
      <div style={{overflow:"auto",flex:1,padding:"10px 18px 20px"}}>
        {list.length===0&&<div style={{textAlign:"center",color:T.gray,padding:40}}>No matching provisions</div>}
        {list.map((p,i)=><div key={i} onClick={()=>onSelect(p)} style={{background:T.card,borderRadius:11,padding:"12px 14px",marginBottom:8,border:`1px solid ${T.border}`,cursor:"pointer"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#60A5FA",fontWeight:500,marginBottom:2}}>{p.s}</div>
          <div style={{fontSize:10,color:T.gold,marginBottom:4}}>{p.a}</div>
          <div style={{fontSize:11,color:T.gray,lineHeight:1.5}}>{p.p}</div>
        </div>)}
      </div>
    </div>
  </div>;
}

// ── AI BRIEF DISPLAY ──
function BriefSection({icon,title,color,children}){
  const [open,setOpen]=useState(true);
  return <div style={{background:T.card,borderRadius:13,border:`1px solid ${color||T.border}`,overflow:"hidden",marginBottom:10}}>
    <div onClick={()=>setOpen(p=>!p)} style={{background:color?(color+"18"):T.grayL,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",borderBottom:open?`1px solid ${color||T.border}`:"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:15}}>{icon}</span><span style={{fontFamily:"'Libre Baskerville',serif",fontSize:13,fontWeight:700,color:color||T.gold}}>{title}</span></div>
      <span style={{color:T.gray,fontSize:12}}>{open?"▲":"▼"}</span>
    </div>
    {open&&<div style={{padding:"12px 14px"}}>{children}</div>}
  </div>;
}

function CaseLawCard({c}){
  return <div style={{background:"#1A0A2C",borderRadius:10,padding:"10px 12px",border:"1px solid #5A2A8A",marginBottom:8}}>
    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#C4B5FD",marginBottom:3}}>{c.citation}</div>
    {c.court&&<div style={{fontSize:9,color:T.gray,marginBottom:3}}>{c.court}</div>}
    <div style={{fontSize:12,color:T.white,fontWeight:600,marginBottom:3}}>{c.ratio}</div>
    <div style={{fontSize:11,color:T.gray,lineHeight:1.5,borderLeft:"2px solid #5A2A8A",paddingLeft:8}}>{c.applicability}</div>
  </div>;
}

function DraftCard({d}){
  const [open,setOpen]=useState(false);
  return <div style={{background:"#2C1200",borderRadius:10,border:`1px solid ${T.orange}`,marginBottom:8,overflow:"hidden"}}>
    <div onClick={()=>setOpen(p=>!p)} style={{padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
      <div><div style={{fontSize:12,fontWeight:700,color:"#FB923C"}}>📝 {d.title}</div><div style={{fontSize:10,color:T.gray,marginTop:1}}>{d.purpose}</div></div>
      <span style={{color:T.gray,fontSize:13}}>{open?"▲":"▼"}</span>
    </div>
    {open&&<div style={{padding:"0 12px 12px",borderTop:`1px solid ${T.orange}`}}>
      {d.keyPoints?.length>0&&<div style={{marginBottom:8}}><div style={{fontSize:9,color:T.gold,fontWeight:700,marginBottom:5}}>KEY POINTS</div>
        {d.keyPoints.map((p,i)=><div key={i} style={{fontSize:11,color:T.gray,marginBottom:3,paddingLeft:10,borderLeft:`2px solid ${T.gold}`}}>▸ {p}</div>)}</div>}
      {d.template&&<div><div style={{fontSize:9,color:T.gold,fontWeight:700,marginBottom:5}}>DRAFT TEXT</div>
        <div style={{background:T.black,borderRadius:8,padding:"10px 12px",fontFamily:"'DM Mono',monospace",fontSize:11,color:T.gray,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{d.template}</div></div>}
    </div>}
  </div>;
}

function StepAICard({g}){
  const [open,setOpen]=useState(false);
  if(!g) return null;
  return <div style={{background:T.greenD,borderRadius:9,border:`1px solid ${T.green}`,padding:"9px 12px",marginTop:8}}>
    <div onClick={()=>setOpen(p=>!p)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
      <div style={{fontSize:11,color:T.green,fontWeight:700}}>🤖 AI Guidance for this step</div>
      <span style={{color:T.gray,fontSize:12}}>{open?"▲":"▼"}</span>
    </div>
    {open&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
      {g.immediateNextSteps?.map((s,i)=><div key={i} style={{background:"#0A1A0F",borderRadius:8,padding:"8px 10px"}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:12,fontWeight:700,color:T.white}}>{s.step}</div><span style={{fontSize:9,color:s.urgency==="High"?T.crimsonL:T.gold}}>{s.urgency}</span></div>
        <div style={{fontSize:11,color:T.gray,marginTop:2}}>{s.description}</div>
        {s.underSection&&<div style={{fontSize:10,color:"#60A5FA",marginTop:2}}>Under: {s.underSection}</div>}
        {s.timeframe&&<div style={{fontSize:10,color:T.gold,marginTop:2}}>⏰ {s.timeframe}</div>}
      </div>)}
      {g.defenceStrategy&&<div style={{background:T.card,borderRadius:8,padding:"8px 10px"}}>
        <div style={{fontSize:9,color:T.crimsonL,fontWeight:700,marginBottom:6}}>⚔️ DEFENCE STRATEGY</div>
        {["whatToDo","whereToDo","howToDo"].map(k=><div key={k} style={{marginBottom:6}}>
          <div style={{fontSize:9,color:T.gold,fontWeight:700,marginBottom:3}}>{k==="whatToDo"?"WHAT TO DO":k==="whereToDo"?"WHERE TO GO":"HOW TO DO IT"}</div>
          {(g.defenceStrategy[k]||[]).map((x,i)=><div key={i} style={{fontSize:11,color:T.gray,marginBottom:2,paddingLeft:8,borderLeft:`2px solid ${k==="whatToDo"?T.crimsonL:k==="whereToDo"?"#60A5FA":T.green}`}}>• {x}</div>)}
        </div>)}
      </div>}
      {g.strategicTip&&<div style={{fontSize:12,color:T.white,padding:"8px 10px",background:T.crimsonD,borderRadius:8,borderLeft:`3px solid ${T.crimson}`}}>💡 {g.strategicTip}</div>}
      {g.caseLaws?.map((c,i)=><CaseLawCard key={i} c={c}/>)}
      {g.draftNeeded&&<DraftCard d={g.draftNeeded}/>}
      {g.risks?.map((r,i)=><div key={i} style={{fontSize:11,color:"#FB923C",paddingLeft:8,borderLeft:`2px solid ${T.orange}`}}>⚠️ {r}</div>)}
    </div>}
  </div>;
}

// ══════════════════════════════
// MAIN APP
// ══════════════════════════════
export default function App(){
  const [clients,setClients]=useState([]);
  const [diary,setDiary]=useState([]);   // [{id,date,court,remarks,hearingsToday:[{caseTitle,outcome}],earned,expenses}]
  const [money,setMoney]=useState([]);   // [{id,date,amount,source,clientId,caseId,note}]
  const [misc,setMisc]=useState([]);     // misc cases not tied to a client
  const [allDocs,setAllDocs]=useState([]); // global docs
  const [loaded,setLoaded]=useState(false);

  const [view,setView]=useState("home");
  const [selClient,setSelClient]=useState(null);
  const [selCase,setSelCase]=useState(null);
  const [selMisc,setSelMisc]=useState(null);
  const [caseTab,setCaseTab]=useState("overview");
  const [miscTab,setMiscTab]=useState("overview");

  // Modals
  const [showAddClient,setShowAddClient]=useState(false);
  const [showAddCase,setShowAddCase]=useState(false);
  const [showAddProv,setShowAddProv]=useState(false);
  const [showProvPop,setShowProvPop]=useState(false);
  const [showAddStep,setShowAddStep]=useState(false);
  const [showAddDoc,setShowAddDoc]=useState(false);
  const [showAddMisc,setShowAddMisc]=useState(false);
  const [showAddMoney,setShowAddMoney]=useState(false);
  const [showDiary,setShowDiary]=useState(false);
  const [showEditClient,setShowEditClient]=useState(false);

  // AI state
  const [briefLoading,setBriefLoading]=useState(false);
  const [briefError,setBriefError]=useState(null);
  const [stepLoading,setStepLoading]=useState(false);

  // Forms
  const blankClient={name:"",nameBn:"",phone:"",whatsapp:"",email:"",address:"",age:"",gender:"Male",occupation:"",religion:"",idType:"Aadhaar",idNo:"",referred:"",emergencyContact:"",clientType:"Individual",notes:""};
  const [nc,setNc]=useState(blankClient);
  const [editC,setEditC]=useState(null);
  const blankCase={title:"",type:"Civil",court:COURTS[0],caseNo:"",filingDate:"",nextDate:"",nextPurpose:"",stage:STAGES[0],clientRole:"Plaintiff",oppRole:"Defendant",oppName:"",oppAdvocate:"",oppAdvPhone:"",fees:"",paid:"0",claimValue:"",notes:""};
  const [ncs,setNcs]=useState(blankCase);
  const [np,setNp]=useState({section:"",act:"",purpose:""});
  const [ns,setNs]=useState({date:today(),action:"",stage:"",notes:"",docName:""});
  const [nd,setNd]=useState({name:"",type:"Plaint",text:"",clientId:"",caseId:""});
  const blankMisc={title:"",type:"Miscellaneous",court:COURTS[0],caseNo:"",date:today(),description:"",fees:"",paid:"0",stage:"Consultation",status:"Open",notes:""};
  const [nm,setNm]=useState(blankMisc);
  const [nmStep,setNmStep]=useState({date:today(),action:"",notes:""});
  const [nmon,setNmon]=useState({date:today(),amount:"",source:MONEY_SOURCES[0],clientId:"",caseId:"",note:""});
  const blankDiary={date:today(),court:"Mathabhanga Sub-Division Court",remarks:"",hearingsToday:[],earned:"",expenses:"",note:""};
  const [nd2,setNd2]=useState(blankDiary);
  const [diaryHearing,setDiaryHearing]=useState({caseTitle:"",outcome:""});
  const [search,setSearch]=useState("");
  const [filterType,setFilterType]=useState("All");

  useEffect(()=>{
    (async()=>{
      const [c,d,m,ms,ad]=await Promise.all([load("af4-clients"),load("af4-diary"),load("af4-money"),load("af4-misc"),load("af4-docs")]);
      setClients(c||SAMPLE); setDiary(d||[]); setMoney(m||[]); setMisc(ms||[]); setAllDocs(ad||[]);
      setLoaded(true);
    })();
  },[]);

  useEffect(()=>{ if(loaded){ save("af4-clients",clients); save("af4-diary",diary); save("af4-money",money); save("af4-misc",misc); save("af4-docs",allDocs); } },[clients,diary,money,misc,allDocs,loaded]);

  const allCases=clients.flatMap(c=>c.cases.map(cs=>({...cs,clientName:c.name,clientId:c.id})));
  const upcoming=allCases.filter(c=>c.nextDate&&c.caseStatus==="Ongoing").sort((a,b)=>new Date(a.nextDate)-new Date(b.nextDate));
  const totalF=clients.reduce((s,c)=>s+c.cases.reduce((ss,cs)=>ss+(cs.fees||0),0),0);
  const totalP=clients.reduce((s,c)=>s+c.cases.reduce((ss,cs)=>ss+(cs.paid||0),0),0);
  const todayStr=today();
  const todayDiary=diary.find(d=>d.date===todayStr);
  const todayMoney=money.filter(m=>m.date===todayStr).reduce((s,m)=>s+(parseFloat(m.amount)||0),0);
  const monthMoney=money.filter(m=>m.date?.startsWith(todayStr.slice(0,7))).reduce((s,m)=>s+(parseFloat(m.amount)||0),0);

  const curClient=selClient?clients.find(c=>c.id===selClient.id):null;
  const curCase=selCase&&curClient?curClient.cases.find(cs=>cs.id===selCase.id):null;
  const curMisc=selMisc?misc.find(m=>m.id===selMisc.id):null;

  function updCase(csId,cliId,fn){setClients(p=>p.map(c=>c.id===cliId?{...c,cases:c.cases.map(cs=>cs.id===csId?fn(cs):cs)}:c));}

  // ── ADD CLIENT ──
  function addClient(){
    if(!nc.name||!nc.phone) return;
    setClients(p=>[{...nc,id:uid(),status:"Active",since:today(),cases:[]},p].flat());
    setNc(blankClient); setShowAddClient(false);
  }
  function saveEditClient(){
    if(!editC) return;
    setClients(p=>p.map(c=>c.id===editC.id?editC:c));
    setSelClient(editC); setShowEditClient(false);
  }

  // ── ADD CASE ──
  function addCase(){
    if(!ncs.title||!curClient) return;
    const roles=PARTY_ROLES[ncs.type]||["Plaintiff","Defendant"];
    const cs={...ncs,id:uid(),caseStatus:"Ongoing",fees:parseFloat(ncs.fees)||0,paid:parseFloat(ncs.paid)||0,claimValue:parseFloat(ncs.claimValue)||0,clientRole:ncs.clientRole||roles[0],oppRole:ncs.oppRole||roles[1],provisions:[],timeline:[],docs:[],legalBrief:null,aiSuggestions:[]};
    setClients(p=>p.map(c=>c.id===curClient.id?{...c,cases:[cs,...c.cases]}:c));
    setNcs(blankCase); setShowAddCase(false);
  }

  // ── ADD PROVISION ──
  function addProvision(p){
    if(!curCase) return;
    const prov={id:uid(),section:p.section||np.section,act:p.act||np.act,purpose:p.purpose||np.purpose,addedDate:today()};
    if(!prov.section||!prov.act) return;
    updCase(curCase.id,curClient.id,cs=>({...cs,provisions:[...(cs.provisions||[]),prov]}));
    setNp({section:"",act:"",purpose:""}); setShowAddProv(false); setShowProvPop(false);
  }
  function removeProvision(pid){
    if(!curCase) return;
    updCase(curCase.id,curClient.id,cs=>({...cs,provisions:cs.provisions.filter(p=>p.id!==pid)}));
  }

  // ── ADD STEP ──
  async function addStep(){
    if(!ns.action||!curCase) return;
    const step={id:uid(),...ns,stage:ns.stage||curCase.stage,aiGuidance:null};
    updCase(curCase.id,curClient.id,cs=>({...cs,stage:ns.stage||cs.stage,timeline:[...(cs.timeline||[]),step]}));
    setShowAddStep(false); setStepLoading(true); setCaseTab("timeline");
    try{
      const tl=[...(curCase.timeline||[]),step];
      const g=await genStepAI(curCase,step,tl);
      updCase(curCase.id,curClient.id,cs=>({...cs,timeline:cs.timeline.map(t=>t.id===step.id?{...t,aiGuidance:g}:t)}));
    }catch(e){console.error(e);}
    setStepLoading(false);
    setNs({date:today(),action:"",stage:"",notes:"",docName:""});
  }

  // ── ADD DOC ──
  function addDoc(){
    if(!nd.name) return;
    const doc={id:uid(),...nd,date:today()};
    if(curCase&&curClient){
      updCase(curCase.id,curClient.id,cs=>({...cs,docs:[...(cs.docs||[]),doc]}));
    } else {
      setAllDocs(p=>[doc,...p]);
    }
    setNd({name:"",type:"Plaint",text:"",clientId:"",caseId:""}); setShowAddDoc(false);
  }

  // ── ADD MISC ──
  function addMisc(){
    if(!nm.title) return;
    setMisc(p=>[{...nm,id:uid(),fees:parseFloat(nm.fees)||0,paid:parseFloat(nm.paid)||0,timeline:[],docs:[]},p].flat());
    setNm(blankMisc); setShowAddMisc(false);
  }
  function addMiscStep(){
    if(!nmStep.action||!curMisc) return;
    setMisc(p=>p.map(m=>m.id===curMisc.id?{...m,timeline:[...(m.timeline||[]),{id:uid(),...nmStep}]}:m));
    setNmStep({date:today(),action:"",notes:""});
  }

  // ── ADD MONEY ──
  function addMoney(){
    if(!nmon.amount) return;
    setMoney(p=>[{...nmon,id:uid(),amount:parseFloat(nmon.amount)||0},p].flat());
    setNmon({date:today(),amount:"",source:MONEY_SOURCES[0],clientId:"",caseId:"",note:""});
    setShowAddMoney(false);
  }

  // ── DIARY ──
  function saveDiary(){
    const entry={...nd2,id:uid()};
    setDiary(p=>{const ex=p.find(d=>d.date===nd2.date);return ex?p.map(d=>d.date===nd2.date?{...d,...nd2}:d):[entry,...p];});
    setShowDiary(false);
    setNd2(blankDiary);
  }

  // ── AI BRIEF ──
  async function generateBrief(){
    if(!curCase||!curClient) return;
    setBriefLoading(true); setBriefError(null); setCaseTab("brief");
    try{
      const b=await genBrief(curCase,curClient);
      updCase(curCase.id,curClient.id,cs=>({...cs,legalBrief:b}));
    }catch(e){ setBriefError(e.message); }
    setBriefLoading(false);
  }

  const liveCase=curCase?(clients.find(c=>c.id===curClient?.id)?.cases.find(cs=>cs.id===curCase.id)):null;
  const liveMisc=curMisc?misc.find(m=>m.id===curMisc.id):null;

  const filteredClients=clients.filter(c=>{
    const s=search.toLowerCase();
    return(c.name.toLowerCase().includes(s)||c.phone.includes(s)||(c.nameBn||"").includes(s))&&(filterType==="All"||c.type===filterType);
  });

  if(!loaded) return <div style={{background:T.black,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center"}}><div style={{fontSize:48}}>⚖️</div><div style={{color:T.crimson,fontFamily:"'Libre Baskerville',serif",fontSize:20,marginTop:12}}>Loading Practice Manager...</div></div></div>;

  return(
    <div style={{background:T.black,minHeight:"100vh",maxWidth:480,margin:"0 auto",color:T.white,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}*{box-sizing:border-box}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}`}</style>

      {/* ── HEADER ── */}
      <div style={{background:T.dark,borderBottom:`1px solid ${T.border}`,padding:"13px 16px 11px",position:"sticky",top:0,zIndex:50}}>
        {liveCase?(
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setSelCase(null)} style={{background:"transparent",border:"none",color:T.crimsonL,fontSize:24,cursor:"pointer",padding:0}}>‹</button>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:14,fontWeight:700,color:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{liveCase.title}</div>
              <div style={{fontSize:9,color:T.gray}}>{curClient?.name} · {liveCase.clientRole} · {liveCase.caseNo||"No case no."}</div>
            </div>
            <button onClick={generateBrief} disabled={briefLoading} style={{background:T.greenD,border:`1px solid ${T.green}`,borderRadius:8,padding:"5px 10px",color:T.green,fontSize:10,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
              {briefLoading?"⏳...":"🤖 Brief"}
            </button>
          </div>
        ):liveMisc?(
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setSelMisc(null)} style={{background:"transparent",border:"none",color:T.crimsonL,fontSize:24,cursor:"pointer",padding:0}}>‹</button>
            <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:15,fontWeight:700,color:T.white}}>{liveMisc.title}</div>
          </div>
        ):curClient?(
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setSelClient(null)} style={{background:"transparent",border:"none",color:T.crimsonL,fontSize:24,cursor:"pointer",padding:0}}>‹</button>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:16,fontWeight:700,color:T.white}}>{curClient.name}</div>
              <div style={{fontSize:10,color:T.gray}}>{curClient.phone} · {curClient.address?.split(",")[0]}</div>
            </div>
            <button onClick={()=>{setEditC({...curClient});setShowEditClient(true);}} style={{background:T.grayL,border:"none",borderRadius:7,padding:"5px 10px",color:T.gray,fontSize:11,fontWeight:700,cursor:"pointer"}}>Edit</button>
          </div>
        ):(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:19,fontWeight:700,color:T.white}}>⚖️ <span style={{color:T.crimsonL}}>Adv.</span> Alfayed</div>
              <div style={{fontSize:9,color:T.gray,letterSpacing:"0.06em"}}>PRACTICE MANAGER · MATHABHANGA</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:T.gray}}>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}}</div>
              {upcoming.filter(c=>dLeft(c.nextDate)===0).length>0&&<div style={{fontSize:9,color:T.crimsonL,fontWeight:700}}>🔴 HEARING TODAY</div>}
            </div>
          </div>
        )}
      </div>

      <div style={{padding:"14px 14px 0"}}>

      {/* ══════════════════ HOME / DIARY ══════════════════ */}
      {view==="home"&&!curClient&&(
        <div>
          {/* Today's court diary banner */}
          <div style={{background:todayDiary?"#0A1A0A":T.crimsonD,borderRadius:14,padding:"14px",border:`1px solid ${todayDiary?T.green:T.crimson}`,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:15,fontWeight:700,color:todayDiary?T.green:T.crimsonL}}>
                  {todayDiary?"📋 Today's Court Diary":"📋 Record Today's Court Visit"}
                </div>
                {todayDiary?(
                  <div style={{marginTop:8}}>
                    <div style={{fontSize:12,color:T.white,fontWeight:600}}>{todayDiary.court}</div>
                    {todayDiary.remarks&&<div style={{fontSize:11,color:T.gray,marginTop:4,lineHeight:1.5}}>{todayDiary.remarks}</div>}
                    {todayDiary.hearingsToday?.length>0&&<div style={{fontSize:11,color:T.gold,marginTop:4}}>{todayDiary.hearingsToday.length} case(s) heard today</div>}
                    {todayDiary.earned&&<div style={{fontSize:11,color:T.green,marginTop:2}}>₹{parseFloat(todayDiary.earned).toLocaleString()} collected</div>}
                  </div>
                ):(
                  <div style={{fontSize:11,color:T.gray,marginTop:4}}>Tap to log court visit, hearings heard, and remarks</div>
                )}
              </div>
              <button onClick={()=>{setNd2(todayDiary||blankDiary);setShowDiary(true);}} style={{background:todayDiary?T.greenD:T.crimsonD,border:`1px solid ${todayDiary?T.green:T.crimson}`,borderRadius:9,padding:"7px 12px",color:todayDiary?T.green:T.crimsonL,fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>
                {todayDiary?"✏️ Edit":"+ Log"}
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[
              {icon:"👥",val:clients.filter(c=>c.status==="Active").length,label:"Clients",color:T.white},
              {icon:"📁",val:allCases.filter(c=>c.caseStatus==="Ongoing").length,label:"Active",color:T.white},
              {icon:"📅",val:upcoming.filter(c=>{const d=dLeft(c.nextDate);return d!==null&&d<=7;}).length,label:"This Week",color:T.gold},
              {icon:"₹",val:`₹${(totalF-totalP)/1000>0?((totalF-totalP)/1000).toFixed(1)+"k":"0"}`,label:"Pending",color:T.crimsonL},
            ].map(s=><div key={s.label} style={{flex:1,background:T.card,borderRadius:12,padding:"11px 6px",textAlign:"center",border:`1px solid ${T.border}`}}>
              <div style={{fontSize:16}}>{s.icon}</div>
              <div style={{fontSize:s.val.toString().length>4?14:19,fontWeight:900,color:s.color,fontFamily:"'Libre Baskerville',serif"}}>{s.val}</div>
              <div style={{fontSize:8,color:T.gray,marginTop:1}}>{s.label}</div>
            </div>)}
          </div>

          {/* Today's money */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1,background:"#1A1200",borderRadius:12,padding:"12px",border:`1px solid ${T.goldD}`,textAlign:"center"}}>
              <div style={{fontSize:9,color:T.gold,fontWeight:700,marginBottom:3}}>TODAY EARNED</div>
              <div style={{fontSize:22,fontWeight:900,color:T.goldL,fontFamily:"'Libre Baskerville',serif"}}>₹{todayMoney.toLocaleString()}</div>
            </div>
            <div style={{flex:1,background:"#0A1A0A",borderRadius:12,padding:"12px",border:`1px solid #166534`,textAlign:"center"}}>
              <div style={{fontSize:9,color:T.green,fontWeight:700,marginBottom:3}}>THIS MONTH</div>
              <div style={{fontSize:22,fontWeight:900,color:T.green,fontFamily:"'Libre Baskerville',serif"}}>₹{monthMoney.toLocaleString()}</div>
            </div>
            <button onClick={()=>setShowAddMoney(true)} style={{background:T.crimsonD,border:`1px solid ${T.crimson}`,borderRadius:12,padding:"12px 10px",color:T.crimsonL,fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0}}>+ Add<br/>Income</button>
          </div>

          {/* Urgent hearings */}
          {upcoming.filter(c=>{const d=dLeft(c.nextDate);return d!==null&&d<=3;}).length>0&&(
            <Card style={{border:`1px solid ${T.crimson}`,marginBottom:12}}>
              <SecHead icon="🔴" title="Urgent Hearings" color={T.crimsonL}/>
              {upcoming.filter(c=>{const d=dLeft(c.nextDate);return d!==null&&d<=3;}).map(c=>{
                const d=dLeft(c.nextDate);
                return <div key={c.id} onClick={()=>{setSelClient(clients.find(cl=>cl.id===c.clientId));setView("clients");}} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8,cursor:"pointer"}}>
                  <div style={{minWidth:34,textAlign:"center",background:T.crimsonD,borderRadius:8,padding:"4px"}}>
                    <div style={{fontSize:15,fontWeight:900,color:T.crimsonL,fontFamily:"'Libre Baskerville',serif"}}>{d===0?"!":d}</div>
                    <div style={{fontSize:8,color:T.gray}}>{d===0?"TODAY":"DAYS"}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.white}}>{c.title}</div>
                    <div style={{fontSize:10,color:T.gray}}>{c.clientName} · {fmtD(c.nextDate)}</div>
                    {c.nextPurpose&&<div style={{fontSize:10,color:T.gold}}>Purpose: {c.nextPurpose}</div>}
                  </div>
                </div>;
              })}
            </Card>
          )}

          {/* This week */}
          <Card style={{marginBottom:12}}>
            <SecHead icon="📅" title="This Week's Dates"/>
            {upcoming.filter(c=>{const d=dLeft(c.nextDate);return d!==null&&d>0&&d<=7;}).length===0
              ?<div style={{color:T.gray,fontSize:12,textAlign:"center",padding:10}}>No hearings this week ✓</div>
              :upcoming.filter(c=>{const d=dLeft(c.nextDate);return d!==null&&d>0&&d<=7;}).slice(0,6).map(c=>(
                <div key={c.id} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:`1px solid ${T.grayL}`,cursor:"pointer"}} onClick={()=>{setSelClient(clients.find(cl=>cl.id===c.clientId));setView("clients");}}>
                  <div style={{fontSize:11,color:T.gold,fontWeight:700,minWidth:28,textAlign:"center"}}>{dLeft(c.nextDate)}d</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:T.white}}>{c.title}</div>
                    <div style={{fontSize:10,color:T.gray}}>{c.clientName}{c.nextPurpose?` · ${c.nextPurpose}`:""}</div>
                  </div>
                  <div style={{fontSize:10,color:T.gray,flexShrink:0}}>{fmtD(c.nextDate)}</div>
                </div>
              ))
            }
          </Card>

          {/* Past diary entries */}
          {diary.filter(d=>d.date!==todayStr).slice(0,3).length>0&&(
            <Card>
              <SecHead icon="📓" title="Recent Diary" sub="Past court visits"/>
              {diary.filter(d=>d.date!==todayStr).slice(0,3).map(d=>(
                <div key={d.id||d.date} style={{padding:"8px 0",borderBottom:`1px solid ${T.grayL}`}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div style={{fontSize:12,fontWeight:700,color:T.white}}>{d.court}</div>
                    <div style={{fontSize:10,color:T.gray}}>{fmtD(d.date)}</div>
                  </div>
                  {d.remarks&&<div style={{fontSize:11,color:T.gray,marginTop:2}}>{d.remarks.slice(0,80)}{d.remarks.length>80?"...":""}</div>}
                  {d.earned&&<div style={{fontSize:10,color:T.green,marginTop:2}}>₹{parseFloat(d.earned).toLocaleString()} collected</div>}
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {/* ══════════════════ CLIENTS ══════════════════ */}
      {view==="clients"&&!curClient&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:20,fontWeight:700,color:T.white}}>Clients</div>
            <Btn onClick={()=>setShowAddClient(true)} sm>+ Add Client</Btn>
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Name, phone, Bengali name..."
            style={{width:"100%",padding:"10px 13px",borderRadius:10,border:`1px solid ${T.border}`,background:T.card,color:T.white,fontSize:13,outline:"none",marginBottom:10}}/>
          <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto"}}>
            {["All",...CASE_TYPES].map(t=><button key={t} onClick={()=>setFilterType(t)} style={{padding:"5px 11px",borderRadius:20,border:`1px solid ${filterType===t?T.crimson:T.border}`,background:filterType===t?T.crimsonD:T.card,color:filterType===t?T.crimsonL:T.gray,fontWeight:700,fontSize:10,cursor:"pointer",whiteSpace:"nowrap"}}>{t}</button>)}
          </div>
          {filteredClients.map(c=>{
            const unpaid=c.cases.reduce((s,cs)=>s+((cs.fees||0)-(cs.paid||0)),0);
            const next=c.cases.filter(cs=>cs.nextDate&&cs.caseStatus==="Ongoing").sort((a,b)=>new Date(a.nextDate)-new Date(b.nextDate))[0];
            return <div key={c.id} onClick={()=>setSelClient(c)} style={{background:T.card,borderRadius:14,padding:"13px",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:11,cursor:"pointer",marginBottom:10}}>
              <Av name={c.name} size={46}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap",marginBottom:3}}>
                  <span style={{fontFamily:"'Libre Baskerville',serif",fontSize:15,fontWeight:700,color:T.white}}>{c.name}</span>
                  <Chip label={c.type} sm/>
                </div>
                {c.nameBn&&<div style={{fontSize:10,color:T.gray,marginBottom:2}}>{c.nameBn}</div>}
                <div style={{fontSize:10,color:T.gray,display:"flex",gap:10,flexWrap:"wrap"}}>
                  <span>📞 {c.phone}</span>
                  <span>📁 {c.cases.length} case{c.cases.length!==1?"s":""}</span>
                  {c.occupation&&<span>💼 {c.occupation}</span>}
                  {next&&<span style={{color:dLeft(next.nextDate)<=3?T.crimsonL:T.gold}}>📅 {dLeft(next.nextDate)===0?"TODAY":`${dLeft(next.nextDate)}d`}</span>}
                  {unpaid>0&&<span style={{color:T.gold}}>₹{unpaid.toLocaleString()} due</span>}
                </div>
              </div>
              <span style={{color:T.gray,fontSize:20}}>›</span>
            </div>;
          })}
          {filteredClients.length===0&&<div style={{textAlign:"center",color:T.gray,padding:60}}><div style={{fontSize:32}}>👥</div><div style={{marginTop:8}}>No clients found</div></div>}
        </div>
      )}

      {/* ── CLIENT DETAIL ── */}
      {view==="clients"&&curClient&&!liveCase&&(
        <div>
          {/* Full client profile */}
          <Card style={{marginBottom:12}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <Av name={curClient.name} size={56}/>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:18,fontWeight:700,color:T.white}}>{curClient.name}</div>
                {curClient.nameBn&&<div style={{fontSize:12,color:T.gray}}>{curClient.nameBn}</div>}
                <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                  <Chip label={curClient.type} sm/>
                  <Chip label={curClient.status} colors={curClient.status==="Active"?{bg:T.greenD,br:"#166534",tx:T.green}:{bg:T.grayL,br:T.border,tx:T.gray}} sm/>
                  <Chip label={curClient.clientType||"Individual"} colors={{bg:T.grayL,br:T.border,tx:T.gray}} sm/>
                </div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {[
                ["📞 Phone",curClient.phone],
                ["💬 WhatsApp",curClient.whatsapp||curClient.phone],
                ["📧 Email",curClient.email||"—"],
                ["👤 Age / Gender",`${curClient.age||"—"} / ${curClient.gender||"—"}`],
                ["💼 Occupation",curClient.occupation||"—"],
                ["🙏 Religion",curClient.religion||"—"],
                ["🪪 ID Proof",`${curClient.idType||"—"}: ${curClient.idNo||"—"}`],
                ["📍 Address",curClient.address||"—"],
                ["🤝 Referred By",curClient.referred||"—"],
                ["🚨 Emergency",curClient.emergencyContact||"—"],
                ["📅 Client Since",fmtD(curClient.since)],
              ].map(([l,v])=><div key={l} style={{background:T.card2,borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontSize:9,color:T.gold,fontWeight:700}}>{l}</div>
                <div style={{fontSize:11,color:T.white,marginTop:2,wordBreak:"break-word"}}>{v}</div>
              </div>)}
            </div>
            {curClient.notes&&<div style={{marginTop:10,padding:"8px 10px",background:T.black,borderRadius:8,fontSize:12,color:T.gray,borderLeft:`2px solid ${T.gold}`}}>{curClient.notes}</div>}
          </Card>

          {/* Cases */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:15,fontWeight:700,color:T.white}}>Cases ({curClient.cases.length})</div>
            <Btn onClick={()=>setShowAddCase(true)} sm>+ Add Case</Btn>
          </div>
          {curClient.cases.map(cs=>{
            const d=dLeft(cs.nextDate);
            return <div key={cs.id} onClick={()=>{setSelCase(cs);setCaseTab("overview");setBriefError(null);}} style={{background:T.card,borderRadius:14,padding:"13px",border:`1px solid ${T.border}`,marginBottom:10,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <div style={{flex:1,marginRight:8}}>
                  <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:14,fontWeight:700,color:T.white}}>{cs.title}</div>
                  <div style={{fontSize:10,color:T.gray,marginTop:1}}>{cs.court}{cs.caseNo?` · ${cs.caseNo}`:""}</div>
                </div>
                <Chip label={cs.type} sm/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,fontSize:10}}>
                <span style={{color:"#60A5FA"}}>👤 {cs.clientRole}</span>
                <span style={{color:T.gold}}>📌 {cs.stage}</span>
                {cs.nextDate&&<span style={{color:d<=3?T.crimsonL:T.gray}}>📅 {d===0?"TODAY":`${d}d — ${fmtD(cs.nextDate)}`}</span>}
                {cs.provisions?.length>0&&<span style={{color:T.green}}>⚖️ {cs.provisions.length} provisions</span>}
                {cs.legalBrief&&<span style={{color:T.green}}>🤖 Brief ready</span>}
                {(cs.fees||0)>(cs.paid||0)&&<span style={{color:T.gold}}>₹{((cs.fees||0)-(cs.paid||0)).toLocaleString()} due</span>}
              </div>
            </div>;
          })}
          {curClient.cases.length===0&&<div style={{textAlign:"center",color:T.gray,padding:30,fontSize:12}}>No cases yet. Add one above.</div>}
        </div>
      )}

      {/* ── CASE DETAIL ── */}
      {view==="clients"&&curClient&&liveCase&&(
        <div>
          {/* Party vs Party banner */}
          <Card style={{marginBottom:12}}>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              <Chip label={liveCase.type} sm/>
              <Chip label={liveCase.caseStatus} colors={liveCase.caseStatus==="Ongoing"?{bg:T.greenD,br:"#166534",tx:T.green}:{bg:T.grayL,br:T.border,tx:T.gray}} sm/>
              {liveCase.caseNo&&<Chip label={liveCase.caseNo} colors={{bg:T.grayL,br:T.border,tx:T.gray}} sm/>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center",marginBottom:10}}>
              <div style={{background:T.blueD,borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                <div style={{fontSize:8,color:T.gold,fontWeight:700}}>OUR CLIENT</div>
                <div style={{fontSize:12,fontWeight:700,color:"#60A5FA",marginTop:2}}>{liveCase.clientRole}</div>
                <div style={{fontSize:10,color:T.white,marginTop:1}}>{curClient.name}</div>
              </div>
              <div style={{textAlign:"center",color:T.crimsonL,fontSize:16,fontWeight:900}}>vs</div>
              <div style={{background:T.crimsonD,borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                <div style={{fontSize:8,color:T.gold,fontWeight:700}}>OPPOSITE</div>
                <div style={{fontSize:12,fontWeight:700,color:T.crimsonL,marginTop:2}}>{liveCase.oppRole}</div>
                <div style={{fontSize:10,color:T.white,marginTop:1}}>{liveCase.oppName||"Opposite Party"}</div>
                {liveCase.oppAdvocate&&<div style={{fontSize:9,color:T.gray,marginTop:1}}>Adv. {liveCase.oppAdvocate}</div>}
                {liveCase.oppAdvPhone&&<div style={{fontSize:9,color:T.gray}}>{liveCase.oppAdvPhone}</div>}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {[
                ["COURT",liveCase.court],
                ["STAGE",liveCase.stage],
                ["FILING DATE",fmtD(liveCase.filingDate)],
                ["NEXT DATE",liveCase.nextDate?`${fmtD(liveCase.nextDate)} (${dLeft(liveCase.nextDate)===0?"TODAY":dLeft(liveCase.nextDate)+"d"})`:"—"],
                ["PURPOSE OF NEXT DATE",liveCase.nextPurpose||"—"],
                ["CLAIM VALUE",liveCase.claimValue?`₹${Number(liveCase.claimValue).toLocaleString()}`:"—"],
              ].map(([l,v])=><div key={l} style={{background:T.black,borderRadius:8,padding:"7px 9px"}}>
                <div style={{fontSize:8,color:T.gold,fontWeight:700,letterSpacing:"0.05em"}}>{l}</div>
                <div style={{fontSize:11,color:T.white,marginTop:2}}>{v}</div>
              </div>)}
            </div>
            {liveCase.notes&&<div style={{marginTop:10,padding:"8px 10px",background:T.black,borderRadius:8,fontSize:11,color:T.gray,borderLeft:`2px solid ${T.gold}`}}>{liveCase.notes}</div>}
          </Card>

          {/* Provisions — always visible */}
          <div style={{background:T.blueD,borderRadius:14,padding:"12px 14px",marginBottom:12,border:"1px solid #1B4F8A"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:14,fontWeight:700,color:"#60A5FA"}}>⚖️ Sections & Provisions</div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>setShowProvPop(true)} style={{background:"#0D1F3C",border:"1px solid #1B4F8A",borderRadius:8,padding:"5px 10px",color:"#60A5FA",fontSize:10,fontWeight:700,cursor:"pointer"}}>📋 Auto-fill</button>
                <button onClick={()=>setShowAddProv(true)} style={{background:"#0D1F3C",border:"1px solid #1B4F8A",borderRadius:8,padding:"5px 10px",color:"#60A5FA",fontSize:10,fontWeight:700,cursor:"pointer"}}>+ Manual</button>
              </div>
            </div>
            {(liveCase.provisions||[]).length===0
              ?<div style={{fontSize:11,color:T.gray,textAlign:"center",padding:10}}>No provisions yet. Use "Auto-fill" to pick from a list, or "Manual" to add custom.</div>
              :(liveCase.provisions||[]).map(p=><div key={p.id} style={{background:"#0A1525",borderRadius:10,padding:"10px 12px",border:"1px solid #1B4F8A",marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#60A5FA",fontWeight:500,marginBottom:2}}>{p.section}</div>
                    <div style={{fontSize:10,color:T.gold,marginBottom:3}}>{p.act}</div>
                    {p.purpose&&<div style={{fontSize:11,color:T.gray,lineHeight:1.5}}>{p.purpose}</div>}
                  </div>
                  <button onClick={()=>removeProvision(p.id)} style={{background:"transparent",border:"none",color:T.gray,cursor:"pointer",fontSize:14,padding:"0 4px",flexShrink:0}}>✕</button>
                </div>
              </div>)
            }
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:3,marginBottom:12,background:T.card,padding:4,borderRadius:12,border:`1px solid ${T.border}`,overflowX:"auto"}}>
            {[["overview","📋 Steps"],["brief","🤖 Brief"],["docs","📁 Docs"],["fees","₹ Fees"]].map(([id,label])=>(
              <button key={id} onClick={()=>setCaseTab(id)} style={{flex:1,padding:"7px 4px",borderRadius:9,border:"none",cursor:"pointer",background:caseTab===id?(id==="brief"?T.greenD:T.crimsonD):"transparent",color:caseTab===id?(id==="brief"?T.green:T.crimsonL):T.gray,fontWeight:700,fontSize:10,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",minWidth:0}}>{label}</button>
            ))}
          </div>

          {/* Steps/Timeline */}
          {caseTab==="overview"&&<div>
            <button onClick={()=>setShowAddStep(true)} style={{width:"100%",background:"transparent",border:`1.5px dashed ${T.crimsonD}`,borderRadius:12,padding:"11px",color:T.crimsonL,fontWeight:700,cursor:"pointer",marginBottom:12,fontSize:12}}>
              + Add Step / Action → Instant AI Guidance
            </button>
            {stepLoading&&<div style={{background:T.greenD,border:`1px solid ${T.green}`,borderRadius:12,padding:"12px",marginBottom:12,textAlign:"center"}}>
              <div style={{color:T.green,fontWeight:700,fontSize:12}}>🤖 AI analysing step...</div>
              <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:T.green,animation:`pulse 1.2s ${i*.4}s infinite`}}/>)}</div>
            </div>}
            {(liveCase.timeline||[]).slice().reverse().map((step,i)=>(
              <div key={step.id} style={{display:"flex",gap:10,marginBottom:12}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:T.crimsonD,border:`2px solid ${T.crimson}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.crimsonL,flexShrink:0}}>{(liveCase.timeline||[]).length-i}</div>
                  {i<(liveCase.timeline||[]).length-1&&<div style={{width:2,flex:1,background:T.grayL,marginTop:4}}/>}
                </div>
                <div style={{flex:1,marginBottom:4}}>
                  <div style={{background:T.card,borderRadius:12,padding:"11px 13px",border:`1px solid ${T.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <div style={{fontWeight:700,color:T.white,fontSize:13}}>{step.action}</div>
                      <div style={{fontSize:10,color:T.gray,flexShrink:0}}>{fmtD(step.date)}</div>
                    </div>
                    {step.stage&&<div style={{fontSize:10,color:T.gold,marginBottom:3}}>📌 {step.stage}</div>}
                    {step.notes&&<div style={{fontSize:12,color:T.gray,lineHeight:1.5}}>{step.notes}</div>}
                    {step.docName&&<div style={{fontSize:11,color:"#60A5FA",marginTop:4}}>📎 {step.docName}</div>}
                  </div>
                  <StepAICard g={step.aiGuidance}/>
                </div>
              </div>
            ))}
            {(!liveCase.timeline||liveCase.timeline.length===0)&&<div style={{textAlign:"center",color:T.gray,padding:40}}><div style={{fontSize:32}}>📋</div><div style={{marginTop:8,fontSize:12}}>No steps yet. Add the first action above.</div></div>}
          </div>}

          {/* AI Brief */}
          {caseTab==="brief"&&<div>
            {briefLoading&&<div style={{background:T.greenD,border:`1px solid ${T.green}`,borderRadius:14,padding:24,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:8}}>🤖</div>
              <div style={{color:T.green,fontWeight:700,fontSize:14,marginBottom:4}}>Generating Full Legal Brief...</div>
              <div style={{color:T.gray,fontSize:11,marginBottom:12}}>SC judgments · Calcutta HC · Provisions · Defence Strategy · Drafts</div>
              <div style={{display:"flex",justifyContent:"center",gap:8}}>{[0,1,2,3,4].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:T.green,animation:`pulse 1.4s ${i*.28}s infinite`}}/>)}</div>
            </div>}
            {briefError&&<div style={{background:T.crimsonD,border:`1px solid ${T.crimson}`,borderRadius:14,padding:"16px"}}>
              <div style={{color:T.crimsonL,fontWeight:700,fontSize:13,marginBottom:8}}>⚠️ Could not generate brief</div>
              <div style={{color:T.gray,fontSize:12,lineHeight:1.6,marginBottom:10}}>{briefError}</div>
              <div style={{fontSize:11,color:T.gray,background:T.black,borderRadius:8,padding:"8px 10px",marginBottom:10}}>Tips: ① Add at least one provision ② Check internet connection</div>
              <Btn onClick={generateBrief} sm>🔄 Try Again</Btn>
            </div>}
            {!briefLoading&&!liveCase.legalBrief&&!briefError&&<div style={{textAlign:"center",padding:40}}>
              <div style={{fontSize:40,marginBottom:12}}>⚖️</div>
              <div style={{color:T.white,fontFamily:"'Libre Baskerville',serif",fontSize:17,fontWeight:700,marginBottom:8}}>Generate Full Legal Brief</div>
              <div style={{color:T.gray,fontSize:12,lineHeight:1.6,marginBottom:20}}>AI will produce SC judgments, Calcutta HC precedents, provision-by-provision analysis, complete defence strategy (What/Where/How), draft applications, court fees, limitation, and argument outline.</div>
              <Btn onClick={generateBrief} color={T.green}>🤖 Generate Full Legal Brief</Btn>
            </div>}
            {liveCase.legalBrief&&!briefLoading&&(()=>{
              const b=liveCase.legalBrief;
              return <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:16,fontWeight:700,color:T.green}}>🤖 Legal Brief</div>
                  <Btn onClick={generateBrief} color={T.green} outline sm>Regenerate</Btn>
                </div>
                {b.executiveSummary&&<div style={{background:T.crimsonD,border:`1px solid ${T.crimson}`,borderRadius:12,padding:"12px 14px",marginBottom:10}}>
                  <div style={{fontSize:9,color:T.gold,fontWeight:700,marginBottom:5}}>EXECUTIVE SUMMARY</div>
                  <div style={{fontSize:12,color:T.white,lineHeight:1.7}}>{b.executiveSummary}</div>
                </div>}
                {b.clientPosition&&<BriefSection icon="👤" title={`${b.clientPosition.role} — Client Position & Strategy`} color={T.blue}>
                  {b.clientPosition.strategy&&<div style={{fontSize:12,color:T.gray,lineHeight:1.7,marginBottom:10}}>{b.clientPosition.strategy}</div>}
                  {b.clientPosition.strengths?.length>0&&<div style={{marginBottom:8}}>
                    <div style={{fontSize:9,color:T.green,fontWeight:700,marginBottom:4}}>STRENGTHS</div>
                    {b.clientPosition.strengths.map((s,i)=><div key={i} style={{fontSize:11,color:T.gray,marginBottom:3,paddingLeft:10,borderLeft:`2px solid ${T.green}`}}>✓ {s}</div>)}
                  </div>}
                  {b.clientPosition.weaknesses?.length>0&&<div>
                    <div style={{fontSize:9,color:T.crimsonL,fontWeight:700,marginBottom:4}}>WEAKNESSES</div>
                    {b.clientPosition.weaknesses.map((w,i)=><div key={i} style={{fontSize:11,color:T.gray,marginBottom:3,paddingLeft:10,borderLeft:`2px solid ${T.crimson}`}}>⚠ {w}</div>)}
                  </div>}
                </BriefSection>}
                {b.provisionsAnalysis?.length>0&&<BriefSection icon="⚖️" title="Provisions Analysis" color="#1B4F8A">
                  {b.provisionsAnalysis.map((p,i)=><div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<b.provisionsAnalysis.length-1?`1px solid ${T.grayL}`:"none"}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#60A5FA",marginBottom:2}}>{p.provision}</div>
                    <div style={{fontSize:10,color:T.gold,marginBottom:6}}>{p.act}</div>
                    {[["RELEVANCE",p.relevance,T.gray],["USE IN YOUR FAVOUR",p.advantage,T.green],["OPPOSITE PARTY COUNTER",p.counter,"#FB923C"]].map(([l,v,c])=><div key={l} style={{marginBottom:5}}>
                      <div style={{fontSize:9,color:T.gold,fontWeight:700,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:11,color:c,lineHeight:1.5}}>{v}</div>
                    </div>)}
                  </div>)}
                </BriefSection>}
                {/* Defence Strategy — What/Where/How */}
                {b.defenceStrategy&&<BriefSection icon="⚔️" title="Defence Strategy — What · Where · How" color={T.crimson}>
                  {[
                    {key:"whatToDo",label:"WHAT TO DO",color:T.crimsonL,icon:"🎯"},
                    {key:"whereToDo",label:"WHERE TO GO / FILE",color:"#60A5FA",icon:"📍"},
                    {key:"howToDo",label:"HOW TO DO IT (STEP BY STEP)",color:T.green,icon:"🔧"},
                  ].map(({key,label,color,icon})=><div key={key} style={{marginBottom:14}}>
                    <div style={{fontSize:10,color:color,fontWeight:700,marginBottom:7}}>{icon} {label}</div>
                    {(b.defenceStrategy[key]||[]).map((item,i)=><div key={i} style={{fontSize:12,color:T.gray,marginBottom:6,padding:"8px 10px",background:T.black,borderRadius:8,borderLeft:`3px solid ${color}`,lineHeight:1.6}}>
                      <span style={{color:color,fontWeight:700}}>{i+1}. </span>{item}
                    </div>)}
                  </div>)}
                </BriefSection>}
                {b.supremeCourtCaseLaws?.length>0&&<BriefSection icon="🏛️" title="Supreme Court Judgments" color="#7C3AED">
                  {b.supremeCourtCaseLaws.map((c,i)=><CaseLawCard key={i} c={c}/>)}
                </BriefSection>}
                {b.calcuttaHCPrecedents?.length>0&&<BriefSection icon="⚖️" title="Calcutta HC Precedents" color={T.teal}>
                  {b.calcuttaHCPrecedents.map((c,i)=><CaseLawCard key={i} c={{...c,court:"Calcutta High Court"}}/>)}
                </BriefSection>}
                {b.presidentialOrdersByLaws?.length>0&&<BriefSection icon="📜" title="Presidential Orders & Bylaws" color={T.green}>
                  {b.presidentialOrdersByLaws.map((o,i)=><div key={i} style={{marginBottom:10,paddingBottom:10,borderBottom:i<b.presidentialOrdersByLaws.length-1?`1px solid ${T.grayL}`:"none"}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.green,marginBottom:2}}>{o.title}</div>
                    <div style={{fontSize:10,color:T.gray,marginBottom:3}}>{o.reference}</div>
                    <div style={{fontSize:12,color:T.gray,lineHeight:1.5}}>{o.relevance}</div>
                  </div>)}
                </BriefSection>}
                {b.nextSteps?.length>0&&<BriefSection icon="✅" title="Next Legal Steps" color={T.green}>
                  {b.nextSteps.map((s,i)=><div key={i} style={{marginBottom:10,paddingBottom:10,borderBottom:i<b.nextSteps.length-1?`1px solid ${T.grayL}`:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <div style={{fontWeight:700,color:T.white,fontSize:13}}>Step {i+1}: {s.step}</div>
                      <span style={{fontSize:9,color:s.urgency==="High"?T.crimsonL:T.gold,fontWeight:700}}>{s.urgency}</span>
                    </div>
                    <div style={{fontSize:12,color:T.gray,lineHeight:1.6,marginBottom:3}}>{s.description}</div>
                    {s.provisionBasis&&<div style={{fontSize:10,color:"#60A5FA"}}>Under: {s.provisionBasis}</div>}
                    {s.timeframe&&<div style={{fontSize:10,color:T.gold,marginTop:2}}>⏰ {s.timeframe}</div>}
                  </div>)}
                </BriefSection>}
                {b.draftApplications?.length>0&&<BriefSection icon="📝" title="Draft Applications & Arguments" color={T.orange}>
                  {b.draftApplications.map((d,i)=><DraftCard key={i} d={d}/>)}
                </BriefSection>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  {b.jurisdiction&&<div style={{background:T.blueD,borderRadius:12,padding:"12px",border:"1px solid #1B4F8A"}}>
                    <div style={{fontSize:9,color:"#60A5FA",fontWeight:700,marginBottom:5}}>🏛️ JURISDICTION</div>
                    <div style={{fontSize:11,fontWeight:700,color:T.white,marginBottom:3}}>{b.jurisdiction.currentCourt}</div>
                    <div style={{fontSize:10,color:T.gray,lineHeight:1.5}}>{b.jurisdiction.pecuniaryJurisdiction}</div>
                    {b.jurisdiction.nextForum&&<div style={{fontSize:10,color:"#60A5FA",marginTop:5}}>↑ {b.jurisdiction.nextForum}</div>}
                  </div>}
                  {b.courtFee&&<div style={{background:"#1A1200",borderRadius:12,padding:"12px",border:`1px solid ${T.goldD}`}}>
                    <div style={{fontSize:9,color:T.gold,fontWeight:700,marginBottom:5}}>₹ COURT FEE</div>
                    <div style={{fontSize:18,fontWeight:900,color:T.goldL,fontFamily:"'Libre Baskerville',serif",marginBottom:3}}>{b.courtFee.amount}</div>
                    <div style={{fontSize:10,color:T.gray,lineHeight:1.5}}>{b.courtFee.basis}</div>
                  </div>}
                </div>
                {b.limitation&&<div style={{background:b.limitation.warningIfAny?T.crimsonD:T.card,border:`1px solid ${b.limitation.warningIfAny?T.crimson:T.border}`,borderRadius:12,padding:"12px 14px",marginBottom:10}}>
                  <div style={{fontSize:9,color:T.gold,fontWeight:700,marginBottom:5}}>⏳ LIMITATION PERIOD</div>
                  <div style={{fontSize:13,fontWeight:700,color:T.white,marginBottom:3}}>{b.limitation.period}</div>
                  <div style={{fontSize:11,color:T.gray}}>{b.limitation.startDate} → {b.limitation.expiryDate}</div>
                  {b.limitation.warningIfAny&&<div style={{fontSize:11,color:T.crimsonL,marginTop:5,fontWeight:700}}>⚠️ {b.limitation.warningIfAny}</div>}
                </div>}
                {(b.evidenceStrategy?.length>0||b.witnessStrategy?.length>0)&&<BriefSection icon="🔍" title="Evidence & Witness Strategy" color={T.green}>
                  {b.evidenceStrategy?.length>0&&<div style={{marginBottom:8}}>
                    <div style={{fontSize:9,color:T.green,fontWeight:700,marginBottom:5}}>EVIDENCE</div>
                    {b.evidenceStrategy.map((e,i)=><div key={i} style={{fontSize:11,color:T.gray,marginBottom:3,paddingLeft:10,borderLeft:`2px solid ${T.green}`}}>{e}</div>)}
                  </div>}
                  {b.witnessStrategy?.length>0&&<div>
                    <div style={{fontSize:9,color:"#60A5FA",fontWeight:700,marginBottom:5}}>WITNESSES</div>
                    {b.witnessStrategy.map((w,i)=><div key={i} style={{fontSize:11,color:T.gray,marginBottom:3,paddingLeft:10,borderLeft:"2px solid #1B4F8A"}}>{w}</div>)}
                  </div>}
                </BriefSection>}
                {b.argumentOutline&&<BriefSection icon="🗣️" title="Argument Outline for Court" color={T.crimson}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:T.gray,lineHeight:1.9,whiteSpace:"pre-wrap",background:T.black,borderRadius:8,padding:"10px 12px"}}>{b.argumentOutline}</div>
                </BriefSection>}
                {b.keyRisks?.length>0&&<BriefSection icon="⚠️" title="Key Risks & Mitigations" color={T.orange}>
                  {b.keyRisks.map((r,i)=><div key={i} style={{fontSize:12,color:T.gray,marginBottom:5,paddingLeft:10,borderLeft:`2px solid ${T.orange}`}}>• {r}</div>)}
                </BriefSection>}
              </div>;
            })()}
          </div>}

          {/* Docs tab */}
          {caseTab==="docs"&&<div>
            <button onClick={()=>setShowAddDoc(true)} style={{width:"100%",background:"transparent",border:"1.5px dashed #1B4F8A",borderRadius:12,padding:"11px",color:"#60A5FA",fontWeight:700,cursor:"pointer",marginBottom:12,fontSize:12}}>+ Add Document</button>
            {(liveCase.docs||[]).map(doc=><div key={doc.id} style={{background:T.card,borderRadius:12,padding:"12px 14px",border:`1px solid ${T.border}`,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{fontWeight:700,color:T.white,fontSize:13}}>📄 {doc.name}</div>
                <div style={{fontSize:10,color:T.gray}}>{fmtD(doc.date)}</div>
              </div>
              <div style={{fontSize:10,color:"#60A5FA",marginTop:2,marginBottom:doc.text?4:0}}>{doc.type}</div>
              {doc.text&&<div style={{fontSize:11,color:T.gray,lineHeight:1.6,maxHeight:100,overflow:"hidden"}}>{doc.text}</div>}
            </div>)}
            {(!liveCase.docs||liveCase.docs.length===0)&&<div style={{textAlign:"center",color:T.gray,padding:40}}>No documents yet.</div>}
          </div>}

          {/* Fees tab */}
          {caseTab==="fees"&&<div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {[["Agreed",`₹${(liveCase.fees||0).toLocaleString()}`,T.white],["Paid",`₹${(liveCase.paid||0).toLocaleString()}`,T.green],["Due",`₹${((liveCase.fees||0)-(liveCase.paid||0)).toLocaleString()}`,T.gold]].map(([l,v,col])=>(
                <div key={l} style={{background:T.card,borderRadius:10,padding:"12px 6px",textAlign:"center",border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:16,fontWeight:800,color:col,fontFamily:"'Libre Baskerville',serif"}}>{v}</div>
                  <div style={{fontSize:9,color:T.gray,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            {liveCase.fees>0&&<div style={{height:6,background:T.grayL,borderRadius:3,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",background:`linear-gradient(90deg,${T.crimson},${T.gold})`,width:`${Math.min(100,Math.round((liveCase.paid||0)/liveCase.fees*100))}%`}}/>
            </div>}
            {liveCase.claimValue>0&&<div style={{background:"#1A1200",border:`1px solid ${T.goldD}`,borderRadius:12,padding:"12px 14px",marginTop:8}}>
              <div style={{fontSize:10,color:T.gold,fontWeight:700}}>CLAIM / SUBJECT MATTER VALUE</div>
              <div style={{fontSize:22,fontWeight:900,color:T.goldL,fontFamily:"'Libre Baskerville',serif"}}>₹{Number(liveCase.claimValue).toLocaleString()}</div>
              <div style={{fontSize:11,color:T.gray,marginTop:4}}>Court fee computed on this value. See AI Brief for exact calculation under Court Fees Act 1870.</div>
            </div>}
          </div>}
        </div>
      )}

      {/* ══════════════════ DATES ══════════════════ */}
      {view==="dates"&&(
        <div>
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:20,fontWeight:700,color:T.white,marginBottom:14}}>All Hearing Dates</div>
          {upcoming.map(c=>{
            const d=dLeft(c.nextDate);
            return <div key={c.id} onClick={()=>{setSelClient(clients.find(cl=>cl.id===c.clientId));setView("clients");}} style={{background:T.card,borderRadius:14,padding:"13px 14px",border:`1px solid ${d<=3?T.crimsonD:T.border}`,marginBottom:10,display:"flex",gap:12,cursor:"pointer"}}>
              <div style={{textAlign:"center",minWidth:42,background:d<=3?T.crimsonD:T.grayL,borderRadius:10,padding:"8px 4px",flexShrink:0}}>
                <div style={{fontSize:17,fontWeight:900,color:d<=3?T.crimsonL:T.white,fontFamily:"'Libre Baskerville',serif"}}>{d===0?"!":d}</div>
                <div style={{fontSize:8,color:T.gray}}>{d===0?"TODAY":"DAYS"}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,color:T.white,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.title}</div>
                <div style={{fontSize:11,color:T.gray,marginTop:1}}>{c.clientName}</div>
                <div style={{fontSize:10,color:T.gray}}>{c.court}</div>
                {c.nextPurpose&&<div style={{fontSize:10,color:T.gold,marginTop:2}}>Purpose: {c.nextPurpose}</div>}
                <div style={{fontSize:11,color:T.goldL,marginTop:2,fontWeight:600}}>{fmtD(c.nextDate)}</div>
              </div>
              <Chip label={c.type} sm/>
            </div>;
          })}
          {/* Misc with dates */}
          {misc.filter(m=>m.nextDate&&m.status==="Open").map(m=>{
            const d=dLeft(m.nextDate);
            return <div key={m.id} onClick={()=>{setSelMisc(m);setView("misc");}} style={{background:T.card,borderRadius:14,padding:"13px 14px",border:`1px solid ${T.border}`,marginBottom:10,display:"flex",gap:12,cursor:"pointer"}}>
              <div style={{textAlign:"center",minWidth:42,background:T.grayL,borderRadius:10,padding:"8px 4px",flexShrink:0}}>
                <div style={{fontSize:17,fontWeight:900,color:T.white,fontFamily:"'Libre Baskerville',serif"}}>{d===0?"!":d||"—"}</div>
                <div style={{fontSize:8,color:T.gray}}>DAYS</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:T.white,fontSize:13}}>{m.title}</div>
                <div style={{fontSize:10,color:T.gold}}>Miscellaneous</div>
                <div style={{fontSize:11,color:T.goldL,marginTop:2}}>{fmtD(m.nextDate)}</div>
              </div>
            </div>;
          })}
          {upcoming.length===0&&misc.filter(m=>m.nextDate).length===0&&<div style={{textAlign:"center",color:T.gray,padding:60}}>No upcoming hearings ✓</div>}
        </div>
      )}

      {/* ══════════════════ MISC CASES ══════════════════ */}
      {view==="misc"&&!liveMisc&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:20,fontWeight:700,color:T.white}}>Miscellaneous</div>
            <Btn onClick={()=>setShowAddMisc(true)} sm>+ Add</Btn>
          </div>
          <div style={{fontSize:11,color:T.gray,marginBottom:14,padding:"8px 12px",background:T.card,borderRadius:10,border:`1px solid ${T.border}`}}>One-time appearances, drafting work, legal opinions, consultation matters not linked to a specific client.</div>
          {misc.map(m=><div key={m.id} onClick={()=>setSelMisc(m)} style={{background:T.card,borderRadius:14,padding:"13px",border:`1px solid ${T.border}`,marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
              <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:14,fontWeight:700,color:T.white}}>{m.title}</div>
              <Chip label={m.status||"Open"} colors={m.status==="Closed"?{bg:T.grayL,br:T.border,tx:T.gray}:{bg:T.greenD,br:"#166534",tx:T.green}} sm/>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",fontSize:10}}>
              <span style={{color:T.gray}}>📅 {fmtD(m.date)}</span>
              {m.court&&<span style={{color:T.gray}}>{m.court}</span>}
              {m.fees>0&&<span style={{color:T.gold}}>₹{m.fees.toLocaleString()}{m.paid<m.fees?` (₹${(m.fees-m.paid).toLocaleString()} due)`:""}</span>}
            </div>
            {m.description&&<div style={{fontSize:11,color:T.gray,marginTop:6,lineHeight:1.5}}>{m.description.slice(0,100)}{m.description.length>100?"...":""}</div>}
          </div>)}
          {misc.length===0&&<div style={{textAlign:"center",color:T.gray,padding:60}}><div style={{fontSize:32}}>📋</div><div style={{marginTop:8}}>No miscellaneous cases yet.</div></div>}
        </div>
      )}

      {/* Misc detail */}
      {view==="misc"&&liveMisc&&(
        <div>
          <Card style={{marginBottom:12}}>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              <Chip label={liveMisc.type||"Miscellaneous"} sm/>
              <Chip label={liveMisc.status||"Open"} colors={liveMisc.status==="Closed"?{bg:T.grayL,br:T.border,tx:T.gray}:{bg:T.greenD,br:"#166534",tx:T.green}} sm/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {[["DATE",fmtD(liveMisc.date)],["COURT",liveMisc.court||"—"],["STAGE",liveMisc.stage||"—"],["FEES",`₹${(liveMisc.fees||0).toLocaleString()} / Paid ₹${(liveMisc.paid||0).toLocaleString()}`]].map(([l,v])=><div key={l} style={{background:T.black,borderRadius:8,padding:"7px 9px"}}>
                <div style={{fontSize:8,color:T.gold,fontWeight:700}}>{l}</div>
                <div style={{fontSize:11,color:T.white,marginTop:2}}>{v}</div>
              </div>)}
            </div>
            {liveMisc.description&&<div style={{marginTop:10,padding:"8px 10px",background:T.black,borderRadius:8,fontSize:12,color:T.gray,lineHeight:1.6}}>{liveMisc.description}</div>}
            {liveMisc.notes&&<div style={{marginTop:8,padding:"8px 10px",background:T.black,borderRadius:8,fontSize:11,color:T.gray,borderLeft:`2px solid ${T.gold}`}}>{liveMisc.notes}</div>}
          </Card>
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:14,fontWeight:700,color:T.white,marginBottom:10}}>Steps / Updates</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <input value={nmStep.action} onChange={e=>setNmStep(p=>({...p,action:e.target.value}))} placeholder="Add a step or update..." style={{flex:1,padding:"10px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.card,color:T.white,fontSize:13,outline:"none"}}/>
            <button onClick={addMiscStep} style={{background:T.crimson,border:"none",borderRadius:9,padding:"10px 16px",color:T.white,fontWeight:700,cursor:"pointer",fontSize:12}}>Add</button>
          </div>
          {(liveMisc.timeline||[]).slice().reverse().map((step,i)=><div key={step.id} style={{background:T.card,borderRadius:10,padding:"10px 12px",border:`1px solid ${T.border}`,marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div style={{fontWeight:600,color:T.white,fontSize:12}}>{step.action}</div>
              <div style={{fontSize:10,color:T.gray}}>{fmtD(step.date)}</div>
            </div>
            {step.notes&&<div style={{fontSize:11,color:T.gray,marginTop:4}}>{step.notes}</div>}
          </div>)}
        </div>
      )}

      {/* ══════════════════ MONEY ══════════════════ */}
      {view==="money"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:20,fontWeight:700,color:T.white}}>Income Tracker</div>
            <Btn onClick={()=>setShowAddMoney(true)} sm>+ Add Income</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {[
              {label:"Today",amount:todayMoney,color:T.goldL},
              {label:"This Month",amount:monthMoney,color:T.green},
              {label:"Total Billed",amount:totalF,color:T.white},
              {label:"Total Pending",amount:totalF-totalP,color:T.crimsonL},
            ].map(s=><div key={s.label} style={{background:T.card,borderRadius:12,padding:"12px",border:`1px solid ${T.border}`,textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:900,color:s.color,fontFamily:"'Libre Baskerville',serif"}}>₹{s.amount.toLocaleString()}</div>
              <div style={{fontSize:9,color:T.gray,marginTop:3}}>{s.label}</div>
            </div>)}
          </div>
          {/* Group by month */}
          {[...new Set(money.map(m=>m.date?.slice(0,7)).filter(Boolean))].sort((a,b)=>b.localeCompare(a)).map(month=>{
            const entries=money.filter(m=>m.date?.startsWith(month));
            const total=entries.reduce((s,m)=>s+(parseFloat(m.amount)||0),0);
            return <div key={month} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:14,fontWeight:700,color:T.white}}>{fmtM(month+"-01")}</div>
                <div style={{fontSize:14,fontWeight:700,color:T.green}}>₹{total.toLocaleString()}</div>
              </div>
              {entries.sort((a,b)=>b.date?.localeCompare(a.date)).map(m=><div key={m.id} style={{background:T.card,borderRadius:10,padding:"10px 12px",border:`1px solid ${T.border}`,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:T.white}}>₹{parseFloat(m.amount).toLocaleString()}</div>
                  <div style={{fontSize:10,color:T.gold}}>{m.source}</div>
                  {m.note&&<div style={{fontSize:10,color:T.gray,marginTop:1}}>{m.note}</div>}
                  {m.clientId&&clients.find(c=>c.id===m.clientId)&&<div style={{fontSize:10,color:T.gray}}>Client: {clients.find(c=>c.id===m.clientId)?.name}</div>}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:T.gray}}>{fmtD(m.date)}</div>
                </div>
              </div>)}
            </div>;
          })}
          {money.length===0&&<div style={{textAlign:"center",color:T.gray,padding:60}}><div style={{fontSize:32}}>₹</div><div style={{marginTop:8}}>No income recorded yet.</div></div>}
        </div>
      )}

      {/* ══════════════════ DOCS ══════════════════ */}
      {view==="docs"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:20,fontWeight:700,color:T.white}}>Documents</div>
            <Btn onClick={()=>setShowAddDoc(true)} sm>+ Add Doc</Btn>
          </div>
          {/* All case docs */}
          {clients.flatMap(c=>c.cases.flatMap(cs=>(cs.docs||[]).map(d=>({...d,caseName:cs.title,clientName:c.name,clientId:c.id,caseId:cs.id}))))
            .concat(allDocs)
            .sort((a,b)=>b.date?.localeCompare(a.date)).map(doc=><div key={doc.id} style={{background:T.card,borderRadius:12,padding:"12px 14px",border:`1px solid ${T.border}`,marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div style={{fontWeight:700,color:T.white,fontSize:13}}>📄 {doc.name}</div>
              <div style={{fontSize:10,color:T.gray}}>{fmtD(doc.date)}</div>
            </div>
            {doc.clientName&&<div style={{fontSize:11,color:T.crimsonL,marginTop:2}}>{doc.clientName}{doc.caseName?` · ${doc.caseName}`:""}</div>}
            <div style={{fontSize:10,color:"#60A5FA",marginTop:2}}>{doc.type}</div>
            {doc.text&&<div style={{fontSize:11,color:T.gray,marginTop:4,lineHeight:1.5,maxHeight:80,overflow:"hidden"}}>{doc.text}</div>}
          </div>)}
          {clients.every(c=>c.cases.every(cs=>!cs.docs?.length))&&allDocs.length===0&&<div style={{textAlign:"center",color:T.gray,padding:60}}><div style={{fontSize:32}}>📁</div><div style={{marginTop:8}}>No documents yet.</div></div>}
        </div>
      )}

      </div>{/* end padding div */}

      <Nav view={view} setView={v=>{setSelClient(null);setSelCase(null);setSelMisc(null);setView(v);}}/>

      {/* ════════════════ MODALS ════════════════ */}

      {/* ADD CLIENT */}
      <Modal show={showAddClient} onClose={()=>setShowAddClient(false)} title="Add New Client">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <F label="FULL NAME *" value={nc.name} onChange={v=>setNc(p=>({...p,name:v}))} placeholder="English name" required/>
          <F label="BENGALI NAME" value={nc.nameBn} onChange={v=>setNc(p=>({...p,nameBn:v}))} placeholder="বাংলা নাম"/>
          <F label="PHONE *" value={nc.phone} onChange={v=>setNc(p=>({...p,phone:v}))} placeholder="Mobile number" required/>
          <F label="WHATSAPP" value={nc.whatsapp} onChange={v=>setNc(p=>({...p,whatsapp:v}))} placeholder="If different"/>
          <F label="EMAIL" value={nc.email} onChange={v=>setNc(p=>({...p,email:v}))} placeholder="Email address"/>
          <F label="AGE" value={nc.age} onChange={v=>setNc(p=>({...p,age:v}))} placeholder="Age"/>
          <S label="GENDER" value={nc.gender} onChange={v=>setNc(p=>({...p,gender:v}))} options={["Male","Female","Other"]}/>
          <S label="CLIENT TYPE" value={nc.clientType} onChange={v=>setNc(p=>({...p,clientType:v}))} options={["Individual","Firm/Company","Government","NGO"]}/>
          <F label="OCCUPATION" value={nc.occupation} onChange={v=>setNc(p=>({...p,occupation:v}))} placeholder="Farmer, Trader, etc."/>
          <F label="RELIGION" value={nc.religion} onChange={v=>setNc(p=>({...p,religion:v}))} placeholder="Hindu, Muslim, etc."/>
          <S label="CASE TYPE" value={nc.type} onChange={v=>setNc(p=>({...p,type:v}))} options={CASE_TYPES}/>
          <F label="ID PROOF TYPE" value={nc.idType} onChange={v=>setNc(p=>({...p,idType:v}))} placeholder="Aadhaar / PAN / Voter"/>
          <F label="ID NUMBER" value={nc.idNo} onChange={v=>setNc(p=>({...p,idNo:v}))} placeholder="ID number"/>
          <F label="REFERRED BY" value={nc.referred} onChange={v=>setNc(p=>({...p,referred:v}))} placeholder="Name of referral"/>
        </div>
        <F label="ADDRESS" value={nc.address} onChange={v=>setNc(p=>({...p,address:v}))} placeholder="Full address with village/ward/block"/>
        <F label="EMERGENCY CONTACT" value={nc.emergencyContact} onChange={v=>setNc(p=>({...p,emergencyContact:v}))} placeholder="Name — Phone number"/>
        <F label="NOTES / INSTRUCTIONS" value={nc.notes} onChange={v=>setNc(p=>({...p,notes:v}))} placeholder="Payment notes, special instructions..." rows={2}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setShowAddClient(false)} color={T.grayL} outline>Cancel</Btn>
          <Btn onClick={addClient}>Add Client ✓</Btn>
        </div>
      </Modal>

      {/* EDIT CLIENT */}
      {editC&&<Modal show={showEditClient} onClose={()=>setShowEditClient(false)} title="Edit Client Profile">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <F label="FULL NAME" value={editC.name} onChange={v=>setEditC(p=>({...p,name:v}))}/>
          <F label="BENGALI NAME" value={editC.nameBn||""} onChange={v=>setEditC(p=>({...p,nameBn:v}))}/>
          <F label="PHONE" value={editC.phone} onChange={v=>setEditC(p=>({...p,phone:v}))}/>
          <F label="WHATSAPP" value={editC.whatsapp||""} onChange={v=>setEditC(p=>({...p,whatsapp:v}))}/>
          <F label="EMAIL" value={editC.email||""} onChange={v=>setEditC(p=>({...p,email:v}))}/>
          <F label="AGE" value={editC.age||""} onChange={v=>setEditC(p=>({...p,age:v}))}/>
          <S label="GENDER" value={editC.gender||"Male"} onChange={v=>setEditC(p=>({...p,gender:v}))} options={["Male","Female","Other"]}/>
          <S label="STATUS" value={editC.status||"Active"} onChange={v=>setEditC(p=>({...p,status:v}))} options={["Active","Inactive","Closed"]}/>
          <F label="OCCUPATION" value={editC.occupation||""} onChange={v=>setEditC(p=>({...p,occupation:v}))}/>
          <F label="RELIGION" value={editC.religion||""} onChange={v=>setEditC(p=>({...p,religion:v}))}/>
          <F label="ID TYPE" value={editC.idType||""} onChange={v=>setEditC(p=>({...p,idType:v}))}/>
          <F label="ID NUMBER" value={editC.idNo||""} onChange={v=>setEditC(p=>({...p,idNo:v}))}/>
          <F label="REFERRED BY" value={editC.referred||""} onChange={v=>setEditC(p=>({...p,referred:v}))}/>
          <F label="EMERGENCY CONTACT" value={editC.emergencyContact||""} onChange={v=>setEditC(p=>({...p,emergencyContact:v}))}/>
        </div>
        <F label="ADDRESS" value={editC.address||""} onChange={v=>setEditC(p=>({...p,address:v}))}/>
        <F label="NOTES" value={editC.notes||""} onChange={v=>setEditC(p=>({...p,notes:v}))} rows={2}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setShowEditClient(false)} color={T.grayL} outline>Cancel</Btn>
          <Btn onClick={saveEditClient}>Save Changes ✓</Btn>
        </div>
      </Modal>}

      {/* ADD CASE */}
      <Modal show={showAddCase} onClose={()=>setShowAddCase(false)} title="Add New Case">
        <F label="CASE TITLE *" value={ncs.title} onChange={v=>setNcs(p=>({...p,title:v}))} placeholder="e.g. Land Partition Suit, Bail Application" required/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <S label="CASE TYPE" value={ncs.type} onChange={v=>{const r=PARTY_ROLES[v]||["Plaintiff","Defendant"];setNcs(p=>({...p,type:v,clientRole:r[0],oppRole:r[1]}));}} options={CASE_TYPES}/>
          <S label="COURT" value={ncs.court} onChange={v=>setNcs(p=>({...p,court:v}))} options={COURTS}/>
          <F label="CASE NUMBER" value={ncs.caseNo} onChange={v=>setNcs(p=>({...p,caseNo:v}))} placeholder="e.g. T.S. 12/2024"/>
          <F label="FILING DATE" value={ncs.filingDate} onChange={v=>setNcs(p=>({...p,filingDate:v}))} type="date"/>
          <F label="NEXT HEARING DATE" value={ncs.nextDate} onChange={v=>setNcs(p=>({...p,nextDate:v}))} type="date"/>
          <F label="PURPOSE OF NEXT DATE" value={ncs.nextPurpose} onChange={v=>setNcs(p=>({...p,nextPurpose:v}))} placeholder="e.g. Cross examination"/>
          <F label="CLIENT ROLE" value={ncs.clientRole} onChange={v=>setNcs(p=>({...p,clientRole:v}))} placeholder="Plaintiff"/>
          <F label="OPPOSITE ROLE" value={ncs.oppRole} onChange={v=>setNcs(p=>({...p,oppRole:v}))} placeholder="Defendant"/>
        </div>
        <F label="OPPOSITE PARTY NAME" value={ncs.oppName} onChange={v=>setNcs(p=>({...p,oppName:v}))} placeholder="Name of opposite party"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <F label="OPP. ADVOCATE" value={ncs.oppAdvocate} onChange={v=>setNcs(p=>({...p,oppAdvocate:v}))} placeholder="Advocate name"/>
          <F label="OPP. ADV. PHONE" value={ncs.oppAdvPhone} onChange={v=>setNcs(p=>({...p,oppAdvPhone:v}))} placeholder="Phone"/>
        </div>
        <S label="CURRENT STAGE" value={ncs.stage} onChange={v=>setNcs(p=>({...p,stage:v}))} options={STAGES}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <F label="CLAIM VALUE (₹)" value={ncs.claimValue} onChange={v=>setNcs(p=>({...p,claimValue:v}))} type="number" placeholder="e.g. 500000"/>
          <F label="AGREED FEES (₹)" value={ncs.fees} onChange={v=>setNcs(p=>({...p,fees:v}))} type="number"/>
          <F label="ADVANCE PAID (₹)" value={ncs.paid} onChange={v=>setNcs(p=>({...p,paid:v}))} type="number"/>
        </div>
        <F label="CASE NOTES" value={ncs.notes} onChange={v=>setNcs(p=>({...p,notes:v}))} placeholder="Brief facts, instructions..." rows={2}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setShowAddCase(false)} color={T.grayL} outline>Cancel</Btn>
          <Btn onClick={addCase}>Add Case ✓</Btn>
        </div>
      </Modal>

      {/* ADD PROVISION MANUAL */}
      <Modal show={showAddProv} onClose={()=>setShowAddProv(false)} title="Add Provision Manually">
        <div style={{background:"#0A1525",border:"1px solid #1B4F8A",borderRadius:9,padding:"10px 12px",fontSize:11,color:"#60A5FA"}}>
          Or use "📋 Auto-fill" button to pick from the automated list of provisions for {liveCase?.type||"this case type"}.
        </div>
        <F label="SECTION / ORDER / RULE *" value={np.section} onChange={v=>setNp(p=>({...p,section:v}))} placeholder="e.g. Section 420 BNS / Order XX Rule 18 CPC / Section 73 CGST" required/>
        <F label="ACT / CODE *" value={np.act} onChange={v=>setNp(p=>({...p,act:v}))} placeholder="e.g. Bharatiya Nyaya Sanhita 2023 / CPC 1908 / CGST Act 2017" required/>
        <F label="PURPOSE / RELEVANCE" value={np.purpose} onChange={v=>setNp(p=>({...p,purpose:v}))} placeholder="Why this provision applies to your case" rows={2}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setShowAddProv(false)} color={T.grayL} outline>Cancel</Btn>
          <Btn onClick={()=>addProvision(np)} color={T.blue}>Add Provision ✓</Btn>
        </div>
      </Modal>

      {/* ADD STEP */}
      <Modal show={showAddStep} onClose={()=>setShowAddStep(false)} title="Add Case Step → AI Guidance">
        <div style={{background:T.greenD,border:`1px solid ${T.green}`,borderRadius:9,padding:"9px 12px",fontSize:11,color:T.green}}>
          🤖 After saving, AI will give next steps, case laws, defence strategy (What/Where/How), and draft — based on your registered provisions.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <F label="DATE" value={ns.date} onChange={v=>setNs(p=>({...p,date:v}))} type="date"/>
          <S label="UPDATED STAGE" value={ns.stage||(liveCase?.stage||STAGES[0])} onChange={v=>setNs(p=>({...p,stage:v}))} options={STAGES}/>
        </div>
        <F label="ACTION TAKEN *" value={ns.action} onChange={v=>setNs(p=>({...p,action:v}))} placeholder="e.g. Plaint filed, Bail rejected, WS filed by defendant, Issues framed..." required/>
        <F label="COURT NOTES / DETAILS" value={ns.notes} onChange={v=>setNs(p=>({...p,notes:v}))} placeholder="Court observations, orders passed, client instructions, key facts, next date purpose..." rows={4}/>
        <F label="DOCUMENT ATTACHED" value={ns.docName} onChange={v=>setNs(p=>({...p,docName:v}))} placeholder="e.g. Plaint.pdf, Bail Application, Vakalatnama"/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setShowAddStep(false)} color={T.grayL} outline>Cancel</Btn>
          <Btn onClick={addStep} color={T.green}>Save + Get AI Guidance 🤖</Btn>
        </div>
      </Modal>

      {/* ADD DOC */}
      <Modal show={showAddDoc} onClose={()=>setShowAddDoc(false)} title="Add Document">
        <F label="DOCUMENT NAME *" value={nd.name} onChange={v=>setNd(p=>({...p,name:v}))} placeholder="e.g. FIR Copy, Land Deed, GST Notice" required/>
        <S label="DOCUMENT TYPE" value={nd.type} onChange={v=>setNd(p=>({...p,type:v}))} options={DOC_TYPES}/>
        <F label="CONTENT / NOTES" value={nd.text} onChange={v=>setNd(p=>({...p,text:v}))} placeholder="Paste key excerpts or type notes about this document..." rows={5}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setShowAddDoc(false)} color={T.grayL} outline>Cancel</Btn>
          <Btn onClick={addDoc} color={T.blue}>Save Document ✓</Btn>
        </div>
      </Modal>

      {/* ADD MISC */}
      <Modal show={showAddMisc} onClose={()=>setShowAddMisc(false)} title="Add Miscellaneous Matter">
        <F label="TITLE *" value={nm.title} onChange={v=>setNm(p=>({...p,title:v}))} placeholder="e.g. Legal opinion for Suresh, One-time appearance" required/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <S label="COURT / FORUM" value={nm.court} onChange={v=>setNm(p=>({...p,court:v}))} options={COURTS}/>
          <F label="DATE" value={nm.date} onChange={v=>setNm(p=>({...p,date:v}))} type="date"/>
          <F label="FEES (₹)" value={nm.fees} onChange={v=>setNm(p=>({...p,fees:v}))} type="number" placeholder="Fees charged"/>
          <F label="ADVANCE PAID (₹)" value={nm.paid} onChange={v=>setNm(p=>({...p,paid:v}))} type="number"/>
        </div>
        <F label="DESCRIPTION" value={nm.description} onChange={v=>setNm(p=>({...p,description:v}))} placeholder="What is this matter about?" rows={3}/>
        <F label="NOTES" value={nm.notes} onChange={v=>setNm(p=>({...p,notes:v}))} placeholder="Instructions, reminders..." rows={2}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setShowAddMisc(false)} color={T.grayL} outline>Cancel</Btn>
          <Btn onClick={addMisc}>Add Matter ✓</Btn>
        </div>
      </Modal>

      {/* ADD MONEY */}
      <Modal show={showAddMoney} onClose={()=>setShowAddMoney(false)} title="Record Income">
        <F label="AMOUNT (₹) *" value={nmon.amount} onChange={v=>setNmon(p=>({...p,amount:v}))} type="number" placeholder="Amount received" required/>
        <S label="SOURCE" value={nmon.source} onChange={v=>setNmon(p=>({...p,source:v}))} options={MONEY_SOURCES}/>
        <F label="DATE" value={nmon.date} onChange={v=>setNmon(p=>({...p,date:v}))} type="date"/>
        <S label="CLIENT (optional)" value={nmon.clientId} onChange={v=>setNmon(p=>({...p,clientId:v}))} options={["(No client)",...clients.map(c=>c.id)]}/>
        <F label="NOTE" value={nmon.note} onChange={v=>setNmon(p=>({...p,note:v}))} placeholder="e.g. Case fee for Ramesh land matter, advance received"/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setShowAddMoney(false)} color={T.grayL} outline>Cancel</Btn>
          <Btn onClick={addMoney} color={T.green}>Record Income ✓</Btn>
        </div>
      </Modal>

      {/* DAILY DIARY */}
      <Modal show={showDiary} onClose={()=>setShowDiary(false)} title="Court Diary — Daily Log">
        <F label="DATE" value={nd2.date} onChange={v=>setNd2(p=>({...p,date:v}))} type="date"/>
        <S label="COURT VISITED" value={nd2.court} onChange={v=>setNd2(p=>({...p,court:v}))} options={COURTS}/>
        <F label="COURT REMARKS / OBSERVATIONS" value={nd2.remarks} onChange={v=>setNd2(p=>({...p,remarks:v}))} placeholder="What happened in court today? Observations, orders, client meetings..." rows={3}/>
        <div>
          <div style={{fontSize:10,color:T.gold,fontWeight:700,marginBottom:8}}>CASES HEARD TODAY</div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input value={diaryHearing.caseTitle} onChange={e=>setDiaryHearing(p=>({...p,caseTitle:e.target.value}))} placeholder="Case title / name" style={{flex:2,padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,background:T.card,color:T.white,fontSize:12,outline:"none"}}/>
            <input value={diaryHearing.outcome} onChange={e=>setDiaryHearing(p=>({...p,outcome:e.target.value}))} placeholder="Outcome / remark" style={{flex:2,padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,background:T.card,color:T.white,fontSize:12,outline:"none"}}/>
            <button onClick={()=>{if(!diaryHearing.caseTitle) return;setNd2(p=>({...p,hearingsToday:[...(p.hearingsToday||[]),{...diaryHearing,id:uid()}]}));setDiaryHearing({caseTitle:"",outcome:""}); }} style={{background:T.crimson,border:"none",borderRadius:8,padding:"9px 12px",color:T.white,fontWeight:700,cursor:"pointer",fontSize:12}}>+</button>
          </div>
          {(nd2.hearingsToday||[]).map((h,i)=><div key={h.id||i} style={{background:T.card2,borderRadius:8,padding:"8px 10px",marginBottom:5,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:12,color:T.white}}>{h.caseTitle}</div><div style={{fontSize:10,color:T.gray}}>{h.outcome}</div></div>
            <button onClick={()=>setNd2(p=>({...p,hearingsToday:p.hearingsToday.filter((_,idx)=>idx!==i)}))} style={{background:"transparent",border:"none",color:T.gray,cursor:"pointer",fontSize:14}}>✕</button>
          </div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <F label="FEES COLLECTED TODAY (₹)" value={nd2.earned} onChange={v=>setNd2(p=>({...p,earned:v}))} type="number" placeholder="Total received today"/>
          <F label="EXPENSES TODAY (₹)" value={nd2.expenses} onChange={v=>setNd2(p=>({...p,expenses:v}))} type="number" placeholder="Travel, misc expenses"/>
        </div>
        <F label="ADDITIONAL NOTES" value={nd2.note} onChange={v=>setNd2(p=>({...p,note:v}))} placeholder="Anything else to remember..." rows={2}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setShowDiary(false)} color={T.grayL} outline>Cancel</Btn>
          <Btn onClick={saveDiary} color={T.green}>Save Diary Entry ✓</Btn>
        </div>
      </Modal>

      {/* PROVISIONS POPUP */}
      {showProvPop&&liveCase&&<ProvisionsPopup caseType={liveCase.type} onSelect={p=>{addProvision({section:p.s,act:p.a,purpose:p.p});}} onClose={()=>setShowProvPop(false)}/>}
    </div>
  );
}
