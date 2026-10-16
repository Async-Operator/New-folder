"use strict";

/* ============================================================
   DATA
   Option format  : [key, odia, english]
   Choice format  : [odia, english]            (for <select>)
   Field "when"   : option keys that make the extra field appear
   ============================================================ */

const YN  = [["yes", "ହଁ", "Yes"], ["no", "ନା", "No"]];
const YNN = [...YN, ["unsure", "ଜାଣି ନାହିଁ", "Not sure"]];

// Store profile (shown inside the shop-details block)
const PROFILE = [
  { name: "area", type: "checkbox", od: "ଅବସ୍ଥିତି", en: "Location", options: [
    ["govt",    "ସରକାରୀ ଡାକ୍ତରଖାନା ନିକଟରେ", "Near Government Hospital"],
    ["private", "ଘରୋଇ ଡାକ୍ତରଖାନା ନିକଟରେ",  "Near Private Hospital"],
    ["rural",   "ଗ୍ରାମାଞ୍ଚଳରେ",            "Rural Area"],
    ["urban",   "ସହରାଞ୍ଚଳରେ",              "Urban Area"]
  ]},
  { name: "crowd", type: "radio", od: "ଭିଡ଼", en: "Crowd", options: [
    ["high",     "ଅଧିକ ଭିଡ଼",  "Highly Crowded"],
    ["moderate", "ମଧ୍ୟମ ଭିଡ଼", "Moderately Crowded"],
    ["low",      "କମ୍ ଭିଡ଼",   "Less Crowded"]
  ]},
  { name: "size", type: "radio", od: "ଦୋକାନର ଆକାର", en: "Store size", options: [
    ["big",    "ବଡ଼ ଦୋକାନ",    "Big Store"],
    ["medium", "ମଧ୍ୟମ ଦୋକାନ", "Medium Store"],
    ["small",  "ଛୋଟ ଦୋକାନ",   "Small Store"]
  ]},
  { name: "trade", type: "checkbox", od: "ବ୍ୟବସାୟ ପ୍ରକାର", en: "Business type", options: [
    ["wholesale", "ପାଇକାରୀ ଦୋକାନ", "Wholesale"],
    ["retail",    "ଖୁଚୁରା ଦୋକାନ",  "Retail"]
  ]},
  { name: "hours", type: "checkbox", od: "ସମୟ", en: "Hours", options: [
    ["24h", "୨୪ ଘଣ୍ଟା ଖୋଲା", "24-Hour Store"]
  ]}
];

const Q = [
  { // 1 – easy warm-up
    od: "ଦିନକୁ ପ୍ରାୟ କେତେ ଗ୍ରାହକ ଆପଣଙ୍କ ଦୋକାନକୁ ଆସନ୍ତି?",
    en: "About how many customers visit your shop per day?",
    fields: [{
      name: "dailyCustomers", type: "select",
      od: "ଗ୍ରାହକ ସଂଖ୍ୟା ବାଛନ୍ତୁ", en: "Choose a range",
      choices: [
        ["୨୦ ରୁ କମ୍", "Less than 20"],
        ["୨୦ – ୫୦", "20 – 50"],
        ["୫୦ – ୧୦୦", "50 – 100"],
        ["୧୦୦ ରୁ ଅଧିକ", "More than 100"]
      ]
    }]
  },
  { // 2
    od: "ଆପଣ କିପରି ପୁନଃ ଷ୍ଟକ୍ କରନ୍ତି?",
    en: "How do you restock?",
    fields: [{
      name: "restockTime", type: "select",
      od: "ଷ୍ଟକ୍ ଆସିବାକୁ କେତେ ସମୟ ଲାଗେ?",
      en: "How long does restocking take?",
      choices: [
        ["ଏକ ଘଣ୍ଟା ମଧ୍ୟରେ", "Within an hour"],
        ["୪ ଘଣ୍ଟା ମଧ୍ୟରେ", "Within 4 hours"],
        ["ଗୋଟିଏ ଦିନ ମଧ୍ୟରେ", "Within a day"],
        ["୩ ଦିନ ମଧ୍ୟରେ", "Within 3 days"],
        ["ଗୋଟିଏ ସପ୍ତାହ ମଧ୍ୟରେ", "Within a week"],
        ["ଏକ ସପ୍ତାହରୁ ଅଧିକ", "More than a week"]
      ]
    }]
  },
  { // 3
    od: "ଔଷଧ ନଥିବାରୁ ଗ୍ରାହକ କେବେ ଫେରିଯାଇଛନ୍ତି କି?",
    en: "Have customers ever left because a medicine was out of stock?",
    opts: YN,
    fields: [{
      name: "stockoutPerWeek", type: "number", min: 0, step: 1, unit: "times/week",
      od: "ସପ୍ତାହରେ ପ୍ରାୟ କେତେ ଥର ଏପରି ହୁଏ?",
      en: "About how many times a week does this happen?",
      placeholder: "Times per week",
      when: ["yes"]
    }]
  },
  { // 4
    od: "କେତେ ଗ୍ରାହକ ଦୋକାନକୁ ନଆସି ଫୋନ୍ କିମ୍ବା ହ୍ୱାଟସ୍ଆପ୍ ମାଧ୍ୟମରେ ମାଗନ୍ତି?",
    en: "How many customers order by phone or WhatsApp instead of visiting?",
    fields: [{
      name: "phoneOrderShare", type: "number", min: 0, max: 100, step: 1, unit: "%",
      od: "ପ୍ରାୟ କେତେ ପ୍ରତିଶତ ଗ୍ରାହକ ଏପରି ମାଗନ୍ତି?",
      en: "Roughly what percentage of customers order this way?",
      placeholder: "Percentage (%)"
    }]
  },
  { // 5
    od: "ନିୟମିତ ଗ୍ରାହକ ହୋମ୍ ଡେଲିଭରି କିମ୍ବା ରିମାଇଣ୍ଡର ମାଗନ୍ତି କି?",
    en: "Do regular customers ask for home delivery or reminders?",
    opts: YN,
    fields: [{
      name: "deliveryDemand", type: "number", min: 0, max: 100, step: 1, unit: "%",
      od: "କେତେ ପ୍ରତିଶତ ଗ୍ରାହକ ଏହି ସୁବିଧା ଚାହାନ୍ତି?",
      en: "What percentage of customers want this service?",
      placeholder: "Percentage (%)",
      when: ["yes"]
    }]
  },
  { // 6
    od: "ଆପଣ ବର୍ତ୍ତମାନ ଡେଲିଭରି କରନ୍ତି କି?",
    en: "Do you currently offer delivery?",
    opts: YN,
    fields: [
      {
        name: "deliveryPerson", type: "text",
        od: "ଡେଲିଭରି କିଏ କରେ?", en: "Who delivers?",
        placeholder: "ଏଠାରେ ଲେଖନ୍ତୁ / Enter name or role",
        when: ["yes"]
      },
      {
        name: "deliveryCost", type: "number", min: 0, step: 1, unit: "₹/km",
        od: "ପ୍ରତି କିଲୋମିଟର ଡେଲିଭରି ଖର୍ଚ୍ଚ", en: "Delivery cost per km",
        placeholder: "Cost per km (₹, whole number)",
        when: ["yes"]
      },
      {
        name: "deliverySalesToday", type: "number", min: 0, step: 1, unit: "₹",
        od: "ଆଜି ଡେଲିଭରି ମାଧ୍ୟମରେ କେତେ ଟଙ୍କାର ଔଷଧ ବିକ୍ରି ହୋଇଛି?",
        en: "How much amount of medicine did you sell through delivery today?",
        placeholder: "Amount today (₹)",
        when: ["yes"]
      }
    ]
  },
  { // 7
    od: "ଦୋକାନ ଚଳାଇବାରେ ଆପଣଙ୍କ ସବୁଠାରୁ ବଡ଼ ଦୈନିକ ଅସୁବିଧା କ'ଣ?",
    en: "What is your biggest daily challenge in running the shop?",
    multi: true,
    opts: [
      ["stock",  "ଔଷଧ ଷ୍ଟକ୍ ଅଭାବ",              "Medicine stock shortage"],
      ["credit", "ବାକି / ଧାର ଟଙ୍କା",             "Credit / unpaid dues"],
      ["staff",  "କର୍ମଚାରୀ ଅଭାବ",               "Staff shortage"],
      ["online", "ଅନଲାଇନ୍ ଔଷଧ ସହ ପ୍ରତିଯୋଗିତା",  "Competition from online pharmacies"],
      ["power",  "ବିଦ୍ୟୁତ୍ / ଇଣ୍ଟରନେଟ୍ ସମସ୍ୟା",  "Power / internet problems"],
      ["other",  "ଅନ୍ୟାନ୍ୟ",                    "Other"]
    ]
  },
  { // 8
    od: "ବ୍ୟବସାୟରେ ଆପଣ କେଉଁ ଡିଜିଟାଲ୍ ମାଧ୍ୟମ ବ୍ୟବହାର କରନ୍ତି?",
    en: "Which digital tools do you use in your business?",
    multi: true,
    opts: [
      ["phone",   "ସ୍ମାର୍ଟଫୋନ୍",                     "Smartphone"],
      ["whatsapp","ହ୍ୱାଟସ୍ଆପ୍",                      "WhatsApp"],
      ["upi",     "UPI / ଫୋନ୍ ପେ / ଗୁଗୁଲ୍ ପେ",       "UPI / PhonePe / Google Pay"],
      ["billing", "ବିଲିଂ ସଫ୍ଟୱେର୍",                   "Billing software"],
      ["none",    "କିଛି ନାହିଁ",                       "None"]
    ]
  },
  { // 9
    od: "ଯଦି କେହି ଡେଲିଭରିରେ ସାହାଯ୍ୟ କରନ୍ତି ଏବଂ ଔଷଧ ରିଜର୍ଭ କରିଥିବା ନୂଆ ଗ୍ରାହକ ଆପଣଙ୍କ ଦୋକାନକୁ ପଠାନ୍ତି, ତେବେ ଆପଣ ଏହି ସେବାରେ ଯୋଗ ଦେବେ କି?",
    en: "If someone helps with delivery and sends you new customers who have reserved medicines, would you join this service?",
    opts: YN,
    fields: [
      {
        name: "joinYesWhy", type: "text",
        od: "ଆପଣ କାହିଁକି ଯୋଗ ଦେବାକୁ ଚାହାଁନ୍ତି?",
        en: "Why do you want to join?",
        placeholder: "ଏଠାରେ ଲେଖନ୍ତୁ / Write here",
        when: ["yes"]
      },
      {
        name: "joinYesDemand", type: "text",
        od: "ଏହି ସେବାରୁ ଆପଣଙ୍କର କୌଣସି ଦାବି ବା ଆବଶ୍ୟକତା ଅଛି କି?",
        en: "Any demand or requirement from this service?",
        placeholder: "ଏଠାରେ ଲେଖନ୍ତୁ / Write here",
        when: ["yes"]
      },
      {
        name: "joinNoWhy", type: "text",
        od: "ଆପଣ କାହିଁକି ଯୋଗ ଦେବାକୁ ଚାହାଁନ୍ତି ନାହିଁ?",
        en: "Why don't you want to join?",
        placeholder: "ଏଠାରେ ଲେଖନ୍ତୁ / Write here",
        when: ["no"]
      },
      {
        name: "joinNoChange", type: "text",
        od: "କେଉଁ ପରିବର୍ତ୍ତନ ହେଲେ ଆପଣ ଯୋଗ ଦେବେ?",
        en: "What changes would make you willing to join?",
        placeholder: "ଏଠାରେ ଲେଖନ୍ତୁ / Write here",
        when: ["no"]
      }
    ]
  },
  { // 10
    od: "ଆପଣ ଏହି ସେବାରେ ଯୋଗ ଦେଲେ ସବସ୍କ୍ରିପସନ୍ ଶୁଳ୍କ ଦେବାକୁ ଚାହିଁବେ କି?",
    en: "If you join this service, would you be willing to pay a subscription fee?",
    opts: YNN,
    fields: [{
      name: "feeAmount", type: "select",
      od: "ମାସିକ କେତେ ଶୁଳ୍କ ଦେବାକୁ ପ୍ରସ୍ତୁତ?",
      en: "How much monthly fee are you willing to pay?",
      choices: [
        ["₹୧୦୦ ତଳେ", "Below ₹100"],
        ["₹୧୦୦ – ₹୩୦୦", "₹100 – ₹300"],
        ["₹୩୦୦ – ₹୫୦୦", "₹300 – ₹500"],
        ["₹୫୦୦ ରୁ ଅଧିକ", "Above ₹500"]
      ],
      when: ["yes"]
    }]
  },
  { // 11 – closing wish (open, optional)
    od: "ଆପଣଙ୍କ ଦୋକାନ ପାଇଁ ସବୁଠାରୁ ଉପକାରୀ ଗୋଟିଏ ସାହାଯ୍ୟ କ'ଣ ହେବ?",
    en: "What one kind of help would be most useful for your shop?",
    ph: "ଆପଣଙ୍କ ମତ ଆମ ପାଇଁ ମୂଲ୍ୟବାନ... / Your idea matters to us..."
  }
];

/* ============================================================
   SETUP
   ============================================================ */

const KEY = "medsurvey_v3";
const form = document.getElementById("survey");
const box = document.getElementById("questions");
const profileBox = document.getElementById("profile");
const msg = document.getElementById("msg");
const reportBox = document.getElementById("report");

form.addEventListener("submit", e => e.preventDefault());

const esc = s => String(s ?? "")
  .replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))
  .replace(/\n/g, "<br>");

/* ---------- builders ---------- */

function optHTML(name, type, [k, od, en]) {
  return `<label>
    <input type="${type}" name="${name}" value="${od} / ${en}" data-k="${k}">
    ${od} <small>${en}</small>
  </label>`;
}

function fieldHTML(f) {
  let control;
  if (f.type === "select") {
    control = `<select name="${f.name}" id="${f.name}">
      <option value="">ବାଛନ୍ତୁ / Select</option>
      ${f.choices.map(([od, en]) => `<option value="${od} / ${en}">${od} / ${en}</option>`).join("")}
    </select>`;
  } else {
    control = `<input type="${f.type}" name="${f.name}" id="${f.name}"
      placeholder="${f.placeholder || "ଏଠାରେ ଲେଖନ୍ତୁ / Enter here"}"
      ${f.type === "number" ? 'inputmode="numeric"' : ""}
      ${f.min !== undefined ? `min="${f.min}"` : ""}
      ${f.max !== undefined ? `max="${f.max}"` : ""}
      ${f.step !== undefined ? `step="${f.step}"` : ""}>`;
  }
  const cond = f.when ? ` data-when="${f.when.join(",")}" hidden` : "";
  return `<div class="conditional-field"${cond}>
    <label for="${f.name}">${f.od}<small>${f.en}</small></label>
    ${control}
  </div>`;
}

// Store profile groups
PROFILE.forEach(g => {
  const d = document.createElement("div");
  d.className = "group";
  d.innerHTML = `<p class="group-title">${g.od} <small>${g.en}</small></p>
    <div class="opts">${g.options.map(o => optHTML(g.name, g.type, o)).join("")}</div>`;
  profileBox.appendChild(d);
});

// Questions
Q.forEach((q, i) => {
  const n = i + 1;
  const s = document.createElement("section");
  s.className = "block q";

  let h = `<h3>${n}. ${q.od}<small>${q.en}</small></h3>`;
  if (q.opts) {
    const type = q.multi ? "checkbox" : "radio";
    h += `<div class="opts">${q.opts.map(o => optHTML("opt" + n, type, o)).join("")}</div>`;
  }
  (q.fields || []).forEach(f => { h += fieldHTML(f); });
  h += `<textarea name="ans${n}" aria-label="Notes for question ${n}"
          placeholder="${q.ph || "ଅତିରିକ୍ତ ମନ୍ତବ୍ୟ (ଇଚ୍ଛାଧୀନ)... / Extra notes (optional)..."}"></textarea>`;

  s.innerHTML = h;
  box.appendChild(s);
});

/* ============================================================
   CONDITIONAL FIELDS + PROGRESS
   Hidden fields are also disabled, so they never block validation
   and never appear in the exported report.
   ============================================================ */

function updateConditionalFields() {
  box.querySelectorAll(".q").forEach(sec => {
    const picked = [...sec.querySelectorAll(".opts input:checked")].map(e => e.dataset.k);
    sec.querySelectorAll("[data-when]").forEach(w => {
      const show = w.dataset.when.split(",").some(k => picked.includes(k));
      w.hidden = !show;
      w.querySelectorAll("input,select").forEach(c => { c.disabled = !show; });
    });
  });
}

function updateProgress() {
  const secs = [...box.querySelectorAll(".q")];
  const done = secs.filter(s =>
    s.querySelector(".opts input:checked") ||
    [...s.querySelectorAll("input:not([type=radio]):not([type=checkbox]):not(:disabled),select:not(:disabled),textarea")]
      .some(e => e.value.trim())
  ).length;
  document.getElementById("bar").style.width = (done / secs.length * 100) + "%";
  const cheer = done === secs.length ? " 🎉 ଧନ୍ୟବାଦ! / Thank you!"
    : done >= secs.length / 2 ? " – ପ୍ରାୟ ଶେଷ! / Almost done!" : "";
  document.getElementById("progText").textContent =
    `${done} / ${secs.length} ପ୍ରଶ୍ନ ଉତ୍ତର ଦିଆଗଲା / questions answered${cheer}`;
}

/* ============================================================
   SAVE / LOAD  (every named control: text, number, select,
   radio, checkbox, textarea)
   ============================================================ */

function getState() {
  const s = {};
  [...form.elements].forEach(el => {
    if (!el.name || el.type === "button") return;
    if (el.type === "radio") { if (el.checked) s[el.name] = el.value; }
    else if (el.type === "checkbox") { if (el.checked) (s[el.name] ||= []).push(el.value); }
    else s[el.name] = el.value;
  });
  return s;
}

function setState(s) {
  [...form.elements].forEach(el => {
    if (!el.name || !(el.name in s)) return;
    const v = s[el.name];
    if (el.type === "radio") el.checked = (v === el.value);
    else if (el.type === "checkbox") el.checked = Array.isArray(v) && v.includes(el.value);
    else el.value = v;
  });
}

const save = () => { try { localStorage.setItem(KEY, JSON.stringify(getState())); } catch (e) {} };

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (s) setState(s);
  } catch (e) {}
}

function refresh() { updateConditionalFields(); updateProgress(); }

form.addEventListener("input", () => { save(); updateProgress(); });
form.addEventListener("change", () => { updateConditionalFields(); updateProgress(); save(); });

load();
refresh();

/* ============================================================
   REPORT DATA  (one source used by PDF, Word and text export)
   ============================================================ */

const picked = name => [...form.querySelectorAll(`[name="${name}"]:checked`)].map(e => e.value);
const text = name => {
  const el = form.elements.namedItem(name);
  return el && !el.disabled && el.value ? el.value.trim() : "";
};

function getReport() {
  const head = [
    ["ଦୋକାନର ନାମ", "Store name", text("shop")],
    ["ମାଲିକଙ୍କ ନାମ", "Owner", text("owner")],
    ["ନମ୍ବର", "Phone", text("phone")],
    ["ଅବସ୍ଥାନ", "Place", text("place")],
    ["ବର୍ଷ", "Years running", text("years")]
  ].filter(r => r[2]);

  const profile = PROFILE
    .map(g => ({ od: g.od, en: g.en, v: picked(g.name) }))
    .filter(g => g.v.length);

  const qs = Q.map((q, i) => {
    const n = i + 1;
    const fields = (q.fields || []).map(f => {
      const v = text(f.name);
      return v ? { od: f.od, en: f.en, v: v + (f.unit ? " " + f.unit : "") } : null;
    }).filter(Boolean);
    return { n, od: q.od, en: q.en, opts: picked("opt" + n), fields, note: text("ans" + n) };
  });

  return { head, profile, qs, date: new Date().toLocaleDateString("en-IN") };
}

function buildBody(r) {
  let h = `<h1>Medicine Shop Survey / ଔଷଧ ଦୋକାନ ସର୍ବେକ୍ଷଣ</h1>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
  ${r.head.map(([o, e, v]) => `<tr><td width="35%"><b>${o} / ${e}</b></td><td>${esc(v)}</td></tr>`).join("")}
  ${r.profile.map(g => `<tr><td><b>${g.od} / ${g.en}</b></td><td>${esc(g.v.join(", "))}</td></tr>`).join("")}
  <tr><td><b>ତାରିଖ / Date</b></td><td>${r.date}</td></tr></table>`;

  r.qs.forEach(q => {
    h += `<p><b>${q.n}. ${q.od}</b><br><i style="color:#555">${q.en}</i></p>`;
    const empty = !q.opts.length && !q.fields.length && !q.note;
    if (q.opts.length) h += `<p>&#10003; ${esc(q.opts.join(", "))}</p>`;
    q.fields.forEach(f => { h += `<p><b>${f.od}</b> <i style="color:#555">(${f.en})</i><br>${esc(f.v)}</p>`; });
    if (q.note) h += `<p>${esc(q.note)}</p>`;
    if (empty) h += `<p><i>&mdash;</i></p>`;
    h += `<hr>`;
  });
  return h;
}

function toText(r) {
  let t = `Medicine Shop Survey\n`;
  r.head.forEach(([, e, v]) => { t += `${e}: ${v}\n`; });
  r.profile.forEach(g => { t += `${g.en}: ${g.v.join(", ")}\n`; });
  t += `Date: ${r.date}\n\n`;
  r.qs.forEach(q => {
    t += `${q.n}. ${q.od}\n(${q.en})\n`;
    if (q.opts.length) t += `[${q.opts.join(", ")}]\n`;
    q.fields.forEach(f => { t += `- ${f.en}: ${f.v}\n`; });
    if (q.note) t += `${q.note}\n`;
    if (!q.opts.length && !q.fields.length && !q.note) t += "-\n";
    t += "\n";
  });
  return t;
}

/* ============================================================
   ACTIONS
   ============================================================ */

function ready() {
  if (!form.checkValidity()) {
    msg.textContent = "ଦୟାକରି ଦୋକାନ ନାମ, ମାଲିକଙ୍କ ନାମ ଓ ସଠିକ୍ ୧୦ ଅଙ୍କର ନମ୍ବର ଭରନ୍ତୁ। / Please fill shop name, owner name and a valid 10-digit phone.";
    form.reportValidity();
    return null;
  }
  return getReport();
}

const fname = r => {
  const shop = (r.head.find(h => h[1] === "Store name") || [, , ""])[2];
  const clean = shop.replace(/[^\w\u0B00-\u0B7F]+/g, "_").replace(/^_+|_+$/g, "") || "survey";
  return clean + "_survey_" + new Date().toISOString().slice(0, 10);
};

function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// PDF: opens the print dialog with a clean report; choose "Save as PDF"
document.getElementById("pdfBtn").onclick = () => {
  const r = ready(); if (!r) return;
  reportBox.innerHTML = buildBody(r);
  const oldTitle = document.title;
  document.title = fname(r);
  window.addEventListener("afterprint", () => { document.title = oldTitle; }, { once: true });
  msg.textContent = "Print window ଖୁଲିବ → 'Save as PDF' ବାଛନ୍ତୁ। / Choose 'Save as PDF'.";
  setTimeout(() => window.print(), 150);
};

document.getElementById("exportBtn").onclick = () => {
  const r = ready(); if (!r) return;
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Survey</title><style>body{font-family:'Nirmala UI','Noto Sans Oriya',Arial,sans-serif;font-size:12pt}</style></head><body>${buildBody(r)}</body></html>`;
  download(new Blob(["\ufeff" + html], { type: "application/msword" }), fname(r) + ".doc");
  msg.textContent = "Word file ଡାଉନଲୋଡ୍ ହେଲା। / Downloaded.";
};

document.getElementById("copyBtn").onclick = async () => {
  const r = ready(); if (!r) return;
  const t = toText(r);
  try {
    await navigator.clipboard.writeText(t);
    msg.textContent = "କପି ହେଲା, WhatsApp ରେ paste କରନ୍ତୁ। / Copied.";
  } catch (e) {
    download(new Blob(["\ufeff" + t], { type: "text/plain;charset=utf-8" }), fname(r) + ".txt");
    msg.textContent = "Text file ଡାଉନଲୋଡ୍ ହେଲା। / Downloaded.";
  }
};

document.getElementById("clearBtn").onclick = () => {
  if (confirm("ସବୁ ଉତ୍ତର ଲିଭିଯିବ। ଜାରି ରଖିବେ? / Clear all answers?")) {
    form.reset();
    try { localStorage.removeItem(KEY); } catch (e) {}
    reportBox.innerHTML = "";
    msg.textContent = "";
    refresh();
  }
};