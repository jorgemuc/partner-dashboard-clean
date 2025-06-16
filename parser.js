const Papa = require('papaparse');

const referenceSchema = [
  "Partnername","Systemname","Partnertyp","Branche","Land","Website",
  "Vertragsstatus","Vertragstyp","Vertragsbeginn","Vertragsende","Kündigungsfrist",
  "Modul/Zweck","Schnittstelle","Format","API URL","Schnittstellenstatus",
  "Anzahl_Kunden","Anzahl_Liegenschaften","Anzahl_NE","Nutzungsfrequenz",
  "Störungen_90d","Score","Ansprechpartner_Name","Ansprechpartner_E-Mail",
  "Telefon","Rolle","Landingpage","Webinar_Termine","Marketingkampagne",
  "Produktflyer_URL","Präsentation_URL","Referenzprojekte","Schulungstypen",
  "Schulungsunterlagen","Trainingsstatus","Developer_Portal_Zugang"
];

const headerAliases = {
  contract_start: "Vertragsbeginn",
  contract_end: "Vertragsende",
  partner_name: "Partnername",
  system_name: "Systemname",
  api_url: "API URL"
};
const canonicalAliases = Object.fromEntries(
  Object.entries(headerAliases).map(([k, v]) => [canonical(k), v])
);

function canonical(str){
  return (str||'').toLowerCase().replace(/[^a-z0-9]/g,'');
}

function parseCsv(raw){
  raw = (raw || '').replace(/^\uFEFF/, '');
  const first = raw.split(/\r?\n/)[0] || '';
  const comma = (first.match(/,/g) || []).length;
  const semi = (first.match(/;/g) || []).length;
  const delimiter = semi > comma ? ';' : ',';
  const results = Papa.parse(raw,{header:true,skipEmptyLines:true,delimiter,transformHeader:h=>{
    const norm = h.trim();
    const key = canonical(norm);
    return canonicalAliases[key] || referenceSchema.find(r => canonical(r)===key) || norm;
  }});
  const data = results.data.map(row => {
    Object.keys(row).forEach(k => { if(row[k]==null) row[k]=''; });
    referenceSchema.forEach(f => { if(!(f in row)) row[f]=''; });
    return row;
  });
  const csvHeaders = results.meta.fields;
  const parsedCanon = csvHeaders.map(canonical);
  const refCanon = referenceSchema.map(canonical);
  const missing = referenceSchema.filter(r => !parsedCanon.includes(canonical(r)));
  const unexpected = csvHeaders.filter(h => !refCanon.includes(canonical(h)));
  return {data, missing, unexpected, delimiter};
}

module.exports = { parseCsv };
