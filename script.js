const Q = [
 ["ଆପଣଙ୍କ ନିୟମିତ ଗ୍ରାହକ କେଉଁମାନେ (ବୃଦ୍ଧ, ପରିବାର, ଶ୍ରମିକ)?","Who are your regular customers (elderly, families, workers)?"],
 ["ପ୍ରତି ମାସରେ ଏକା ଔଷଧ ପାଇଁ କେତେ ଗ୍ରାହକ ଆସନ୍ତି?","How many customers come every month for the same medicines?"],
 ["କେଉଁ ଔଷଧ ଆପଣଙ୍କ ପାଖରେ ପ୍ରାୟ ସରିଯାଏ?","Which medicines do you often run out of?"],
 ["ଆପଣ କିପରି ପୁନଃ ଷ୍ଟକ୍ କରନ୍ତି, ଏବଂ କେତେ ସମୟ ଲାଗେ?","How do you restock, and how long does it take?"],
 ["କୌଣସି ଜିନିଷ ନଥିଲେ, ଆପଣ ଗ୍ରାହକ ପାଇଁ ଅନ୍ୟ ଦୋକାନକୁ ଫୋନ୍ କରନ୍ତି କି?","When you don't have an item, do you call another shop for the customer?",["ହଁ|Yes","ନା|No","କେବେ କେବେ|Sometimes"]],
 ["ନିୟମିତ ଗ୍ରାହକ ହୋମ୍ ଡେଲିଭରି କିମ୍ବା ରିମାଇଣ୍ଡର ମାଗନ୍ତି କି? କେତେ ଥର?","Do regular customers ask for home delivery or reminders? How often?"],
 ["ଆପଣ ବର୍ତ୍ତମାନ ଡେଲିଭରି କରନ୍ତି କି? କିଏ ଡେଲିଭରି କରେ ଏବଂ ଖର୍ଚ୍ଚ କେତେ?","Do you deliver now? Who delivers and what does it cost?",["ହଁ|Yes","ନା|No"]],
 ["କେତେ ଗ୍ରାହକ ଦୋକାନକୁ ନଆସି ଫୋନ୍ କିମ୍ବା ହ୍ୱାଟସ୍ଆପ୍ ମାଧ୍ୟମରେ ମାଗନ୍ତି?","How many customers ask by phone or WhatsApp instead of coming in?"],
 ["ଗ୍ରାହକ କିପରି ଦେୟ ଦିଅନ୍ତି: ନଗଦ, UPI, ନା ଉଧାର?","How do customers pay: cash, UPI, or credit?",["ନଗଦ|Cash","UPI|UPI","ଉଧାର|Credit"],true],
 ["ଦୋକାନ ଚଳାଇବାରେ ଆପଣଙ୍କ ସବୁଠାରୁ ବଡ଼ ଦୈନିକ ଅସୁବିଧା କ'ଣ?","What is your biggest daily headache in running the shop?"],
 ["ଯେଉଁ ଗ୍ରାହକ ଆଗରୁ ନିଜ ଔଷଧ ରିଜର୍ଭ କରିସାରିଛନ୍ତି, ସେମାନଙ୍କୁ ଆପଣଙ୍କ ପାଖକୁ ପଠାଉଥିବା ସେବାରେ ଆପଣ ଯୋଗ ଦେବେ କି?","Would you join a service that sends you new customers who have already reserved their medicine?",["ହଁ|Yes","ନା|No","ଜାଣି ନାହିଁ|Not sure"]],
 ["କେଉଁ ଶୁଳ୍କ କିମ୍ବା ବ୍ୟବସ୍ଥା ଆପଣଙ୍କୁ ନ୍ୟାୟ୍ୟ ଲାଗିବ, ଏବଂ କ'ଣ ଆପଣଙ୍କୁ ଚିନ୍ତା ଦେବ?","What fee or arrangement would feel fair, and what would worry you?"]
];
const KEY="medsurvey";
const form=document.getElementById("survey"), box=document.getElementById("questions"), msg=document.getElementById("msg");

Q.forEach((q,i)=>{
  const n=i+1, s=document.createElement("section");
  s.className="block q";
  let h=`<h3>${n}. ${q[0]}<small>${q[1]}</small></h3>`;
  if(q[2]){
    const t=q[3]?"checkbox":"radio";
    h+=`<div class="opts">`+q[2].map(o=>{const [od,en]=o.split("|");
      return `<label><input type="${t}" name="opt${n}" value="${od} / ${en}">${od} <small>${en}</small></label>`}).join("")+`</div>`;
  }
  h+=`<textarea name="ans${n}" placeholder="ଏଠାରେ ଲେଖନ୍ତୁ... / Write here..."></textarea>`;
  s.innerHTML=h; box.appendChild(s);
});

function collect(){
  const d={shop:form.shop.value,owner:form.owner.value,phone:form.phone.value,q:[]};
  Q.forEach((_,i)=>{const n=i+1;
    d.q.push({opts:[...form.querySelectorAll(`[name=opt${n}]:checked`)].map(e=>e.value),text:form["ans"+n].value});});
  return d;
}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(collect()))}catch(e){}};
function load(){
  try{const d=JSON.parse(localStorage.getItem(KEY)||"null"); if(!d)return;
    form.shop.value=d.shop;form.owner.value=d.owner;form.phone.value=d.phone;
    d.q.forEach((a,i)=>{const n=i+1;form["ans"+n].value=a.text;
      form.querySelectorAll(`[name=opt${n}]`).forEach(e=>e.checked=a.opts.includes(e.value));});
  }catch(e){}
}
form.addEventListener("input",save); form.addEventListener("change",save); load();

const esc=s=>s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])).replace(/\n/g,"<br>");

function ready(){
  if(!form.shop.value.trim()||!form.owner.value.trim()||!form.phone.value.trim()){
    msg.textContent="ଦୟାକରି ଦୋକାନ ନାମ, ମାଲିକଙ୍କ ନାମ ଓ ନମ୍ବର ଭରନ୍ତୁ। / Please fill shop name, owner name and phone.";
    form.reportValidity(); return null;}
  return collect();
}
function buildBody(d){
  let body=`<h1>Medicine Shop Survey / ଔଷଧ ଦୋକାନ ସର୍ବେକ୍ଷଣ</h1>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
  <tr><td width="35%"><b>ଦୋକାନର ନାମ / Store name</b></td><td>${esc(d.shop)}</td></tr>
  <tr><td><b>ମାଲିକଙ୍କ ନାମ / Owner</b></td><td>${esc(d.owner)}</td></tr>
  <tr><td><b>ନମ୍ବର / Phone</b></td><td>${esc(d.phone)}</td></tr></table>
  <p>Date: ${new Date().toLocaleDateString("en-IN")}</p>`;
  Q.forEach((q,i)=>{const a=d.q[i];
    body+=`<p><b>${i+1}. ${q[0]}</b><br><i style="color:#555">${q[1]}</i></p>`;
    if(a.opts.length)body+=`<p>&#10003; ${esc(a.opts.join(", "))}</p>`;
    body+=`<p>${a.text.trim()?esc(a.text):"<i>&mdash;</i>"}</p><hr>`;});
  return body;
}
const fname=d=>(d.shop.trim().replace(/[^\w\u0B00-\u0B7F]+/g,"_")||"survey")+"_survey";
function download(blob,name){
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;
  document.body.appendChild(a);a.click();a.remove();
}
// PDF: opens the print dialog showing a clean report; choose "Save as PDF"
document.getElementById("pdfBtn").onclick=()=>{
  const d=ready(); if(!d)return;
  document.getElementById("report").innerHTML=buildBody(d);
  const t=document.title; document.title=fname(d);
  msg.textContent="Print window ଖୁଲିବ \u2192 'Save as PDF' ବାଛନ୍ତୁ। / Choose 'Save as PDF'.";
  setTimeout(()=>{window.print();document.title=t;},150);
};
document.getElementById("exportBtn").onclick=()=>{
  const d=ready(); if(!d)return;
  const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Survey</title><style>body{font-family:'Nirmala UI','Noto Sans Oriya',Arial,sans-serif;font-size:12pt}</style></head><body>${buildBody(d)}</body></html>`;
  download(new Blob(["\ufeff"+html],{type:"application/msword"}),fname(d)+".doc");
  msg.textContent="Word file ଡାଉନଲୋଡ୍ ହେଲା। / Downloaded.";
};
// Plain text: copy to clipboard (paste into WhatsApp) or download .txt
function toText(d){
  let t=`Medicine Shop Survey\nStore: ${d.shop}\nOwner: ${d.owner}\nPhone: ${d.phone}\nDate: ${new Date().toLocaleDateString("en-IN")}\n\n`;
  Q.forEach((q,i)=>{const a=d.q[i];t+=`${i+1}. ${q[0]}\n(${q[1]})\n${a.opts.length?"["+a.opts.join(", ")+"] ":""}${a.text.trim()||"-"}\n\n`;});
  return t;
}
document.getElementById("copyBtn").onclick=async()=>{
  const d=ready(); if(!d)return; const t=toText(d);
  try{await navigator.clipboard.writeText(t);msg.textContent="କପି ହେଲା, WhatsApp ରେ paste କରନ୍ତୁ। / Copied.";}
  catch(e){download(new Blob(["\ufeff"+t],{type:"text/plain;charset=utf-8"}),fname(d)+".txt");msg.textContent="Text file ଡାଉନଲୋଡ୍ ହେଲା। / Downloaded.";}
};
document.getElementById("clearBtn").onclick=()=>{
  if(confirm("ସବୁ ଉତ୍ତର ଲିଭିଯିବ। ଜାରି ରଖିବେ? / Clear all answers?")){form.reset();try{localStorage.removeItem(KEY)}catch(e){}msg.textContent="";}
};