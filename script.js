'use strict';
const $ = id => document.getElementById(id);
const BR_TIMEZONE = 'America/Sao_Paulo';
const brTodayFormatter = new Intl.DateTimeFormat('en-CA', {timeZone:BR_TIMEZONE, year:'numeric',month:'2-digit',day:'2-digit'});
const brDisplayFormatter = new Intl.DateTimeFormat('pt-BR', {timeZone:'UTC',day:'2-digit',month:'2-digit',year:'numeric'});
const brWeekdayFormatter = new Intl.DateTimeFormat('pt-BR', {timeZone:'UTC',weekday:'long'});
const PRESETS = [30,60,90,180,365];
let selectedDays = 60;
let selectedType = 'preset';
let latest = null;
let manufacturingDateEdited = false;
let currentAutoDate = '';
let serverClockOffset = 0;

function todayBR(now = new Date()) {
  const parts = brTodayFormatter.formatToParts(now);
  const get = kind => parts.find(part => part.type === kind).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
function utcDate(y,m,d) {
  const date = new Date(0);
  date.setUTCHours(12,0,0,0);
  date.setUTCFullYear(y,m-1,d);
  return date;
}
function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) throw new Error('Informe a Data de Fabricação.');
  const [y,m,d] = value.split('-').map(Number);
  if (y < 1 || y > 9998 || m < 1 || m > 12 || d < 1 || d > utcDate(y,m+1,0).getUTCDate()) throw new Error('A Data de Fabricação é inválida.');
  return {y,m,d};
}
function calculateExpiry(iso, days) {
  if (!Number.isSafeInteger(days) || days < 1 || days > 36500) throw new Error('Informe um prazo inteiro de 1 até 36.500 dias.');
  const {y,m,d} = parseDate(iso);
  const date = utcDate(y,m,d);
  date.setUTCDate(date.getUTCDate() + days);
  if (date.getUTCFullYear() > 9999) throw new Error('O vencimento ultrapassa o limite do calendário.');
  return date;
}
function updateSelectedButtons() {
  document.querySelectorAll('.choice').forEach(btn => {
    const isActive = selectedType === 'preset' && Number(btn.dataset.amount) === selectedDays;
    btn.classList.toggle('selected',isActive);
    btn.setAttribute('aria-pressed',String(isActive));
  });
}
function showError(message) {
  $('error').textContent = message;
  $('error').hidden = false;
}
function update() {
  $('error').hidden = true;
  try {
    const customRaw = $('customAmount').value.trim();
    const days = selectedType === 'custom' ? Number(customRaw) : selectedDays;
    if (selectedType === 'custom' && (!/^\d+$/.test(customRaw) || !Number.isSafeInteger(days) || days < 1 || days > 36500)) throw new Error('Digite um prazo personalizado de 1 até 36.500 dias.');
    const {y,m,d} = parseDate($('baseDate').value);
    const base = utcDate(y,m,d);
    const expiry = calculateExpiry($('baseDate').value,days);
    const product = $('product').value.trim() || 'Não informado';
    const period = `${days} ${days===1?'dia corrido':'dias corridos'}`;
    latest = {product,base:brDisplayFormatter.format(base),end:brDisplayFormatter.format(expiry),period,days};
    $('resultDate').textContent = latest.end;
    $('resultWeekday').textContent = brWeekdayFormatter.format(expiry);
    $('referenceValue').textContent = latest.base;
    $('periodValue').textContent = period;
    $('productValue').textContent = product;
    $('methodValue').textContent = 'Dias corridos';
    $('daysValue').textContent = `${days} ${days === 1 ? 'dia' : 'dias'}`;
    $('printProduct').textContent = `Produto: ${product}`;
    $('printManufacture').textContent = `Data de Fabricação: ${latest.base}`;
    $('printExpiry').textContent = `Data calculada: ${latest.end}`;
    $('printPeriod').textContent = `Prazo: ${period} · Confirme o rótulo`;
    $('exampleTitle').textContent = product === 'Não informado' ? '✓ Conferência do produto' : `✓ Conferência — ${product}`;
    $('exampleDetails').textContent = `Fabricação: ${latest.base} · Prazo: ${period} · Validade calculada: ${latest.end}`;
  } catch (error) {
    latest = null;
    showError(error.message);
    $('resultDate').textContent = '—';
    $('resultWeekday').textContent = 'Corrija os dados para calcular';
    $('exampleTitle').textContent = '✓ Conferência do produto';
    $('exampleDetails').textContent = 'Preencha a fabricação e informe um prazo válido.';
  }
}
function selectPreset(days) {
  selectedDays = days;
  selectedType = 'preset';
  $('customAmount').value = String(days);
  updateSelectedButtons();
  update();
}
function selectCustom() {
  selectedType = 'custom';
  updateSelectedButtons();
  update();
}
function refreshAutoDate() {
  const newDate = todayBR(new Date(Date.now() + serverClockOffset));
  if (newDate !== currentAutoDate) {
    currentAutoDate = newDate;
    if (!manufacturingDateEdited) {
      $('baseDate').value = newDate;
      update();
    }
  }
}
function initChoices() {
  const fragment = document.createDocumentFragment();
  PRESETS.forEach(days => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.dataset.amount = String(days);
    button.innerHTML = `${days}<small>dias</small>`;
    button.addEventListener('click',() => selectPreset(days));
    fragment.append(button);
  });
  $('choices').replaceChildren(fragment);
  selectPreset(60);
}
$('customAmount').addEventListener('input',selectCustom);
$('applyCustom').addEventListener('click',selectCustom);
$('customAmount').addEventListener('keydown',e => {if (e.key==='Enter') {e.preventDefault(); selectCustom();}});
$('baseDate').addEventListener('input',() => {manufacturingDateEdited = true; update();});
$('baseDate').addEventListener('change',() => {manufacturingDateEdited = true; update();});
$('product').addEventListener('input',update);
$('todayBtn').addEventListener('click',() => {manufacturingDateEdited = false; refreshAutoDate(); $('baseDate').value = currentAutoDate; update();});
$('calculate').addEventListener('click',() => {refreshAutoDate(); update();});
$('copy').addEventListener('click',async () => {
  if (!latest) return;
  const output = `Produto: ${latest.product}\nFabricação: ${latest.base}\nPrazo: ${latest.period}\nData calculada: ${latest.end}\nConfira a validade indicada pelo fabricante.`;
  try {
    await navigator.clipboard.writeText(output);
    $('copy').textContent = '✓ Copiado';
    setTimeout(() => $('copy').textContent = '⧉ Copiar resultado',1600);
  } catch {showError('Não foi possível copiar automaticamente. Selecione o resultado manualmente.');}
});
$('print').addEventListener('click',() => {if (latest) window.print();});
async function syncOnlineClock() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),3500);
    let response;
    try {response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo',{signal:controller.signal,cache:'no-store'});}
    finally {clearTimeout(timeout);}
    if (!response.ok) throw new Error('Sem conexão');
    const data = await response.json();
    const instant = Date.parse(data.datetime);
    if (!Number.isFinite(instant)) throw new Error('Data online inválida');
    // Desconta metade da latência de rede? Não é necessário para precisão de dias.
    serverClockOffset = instant - Date.now();
    refreshAutoDate();
    $('clockInfo').textContent = 'Data atual de Brasília consultada online. Atualização automática ao mudar o dia.';
  } catch {
    $('clockInfo').textContent = 'Data de Brasília calculada pelo relógio do dispositivo. Consulta online indisponível.';
  }
}
currentAutoDate = todayBR();
$('baseDate').value = currentAutoDate;
initChoices();
update();
syncOnlineClock();
setInterval(refreshAutoDate,60 * 1000);
document.addEventListener('visibilitychange',() => {if (!document.hidden) refreshAutoDate();});
window.addEventListener('focus',refreshAutoDate);
