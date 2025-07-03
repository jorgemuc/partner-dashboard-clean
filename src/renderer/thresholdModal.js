import { createModal } from './modal.js';
import { getThresholds, thresholdStore, checkThresholds, computeKpis, validateOperator } from './kpi.js';

export function openThresholdModal(label){
  const current = getThresholds()[label] || { op:'<', value:0, email:false };
  const modal = createModal(`Schwellwert für ${label}`);
  modal.body.innerHTML = `
    <label>Operator
      <select id="thOp">
        <option value="<">&lt;</option>
        <option value=">">&gt;</option>
        <option value="=">=</option>
      </select>
    </label>
    <label>Wert <input id="thVal" type="number"></label>
    <label><input id="thMail" type="checkbox"> E-Mail senden</label>
  `;
  modal.actions.innerHTML = `
    <button class="export-btn" id="thSave" style="background:#32b14d;">Speichern</button>
    <button class="export-btn" id="thDelete" style="background:#e88;">Löschen</button>
    <button class="export-btn" id="thCancel" style="background:#777;">Abbrechen</button>`;
  document.getElementById('thOp').value = current.op;
  document.getElementById('thVal').value = current.value;
  document.getElementById('thMail').checked = current.email;
  document.getElementById('thSave').onclick = () => {
    const op = document.getElementById('thOp').value;
    const val = parseFloat(document.getElementById('thVal').value);
    if(!(/[<>]=?|=/.test(op) && Number.isFinite(val))) return;
    const cfg = getThresholds();
    cfg[label] = { op, value:val, email: document.getElementById('thMail').checked };
    thresholdStore(cfg);
    checkThresholds(computeKpis());
    modal.close();
  };
  document.getElementById('thDelete').onclick = () => {
    const cfg = getThresholds();
    delete cfg[label];
    thresholdStore(cfg);
    checkThresholds(computeKpis());
    modal.close();
  };
  document.getElementById('thCancel').onclick = modal.close;
}
