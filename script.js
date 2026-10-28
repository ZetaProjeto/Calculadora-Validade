'use strict';
const el = id => document.getElementById(id);
const zone = 'America/Sao_Paulo';
const dateFormat = new Intl.DateTimeFormat('pt-BR',{timeZone:zone,day:'2-digit',month:'2-digit',year:'numeric'});
const weekdayFormat = new Intl.DateTimeFormat('pt-BR',{weekday:'long',timeZone:'UTC'});
let selected = {amount:6,unit:'months',label:'6 meses'};
let latest = null;
// O relógio civil vem de uma fonte online quando possível, com fallback local.
// Um horário remoto NÃO é necessário para somar meses: esta conta é determinística.
function getBrazilToday(instant = new Date()){
  const parts = dateFormat.formatToParts(instant);
  const part = type => Number(parts.find(p=>p.type===type).value);
  return `${part('year')}-${String(part('month')).padStart(2,'0')}-${String(part('day')).padStart(2,'0')}`;
}
function parseISO(s){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))throw new Error('Informe uma data válida.');
  const [y,m,d]=s.split('-').map(Number);
  const limit = new Date(Date.UTC(y,m,0)).getUTCDate();
  if(y<1||y>9998||m<1||m>12||d<1||d>limit)throw new Error('Informe uma data válida.');
  return {y,m,d};
}
function makeUTC(y,m,d){const result=new Date(0);result.setUTCHours(12,0,0,0);result.setUTCFullYear(y,m-1,d);return result;}
function addMonths(date,amount){
  const {y,m,d}=parseISO(date);
  const monthIndex=y*12+(m-1)+amount;
  const targetYear=Math.floor(monthIndex/12);
  const targetMonth=monthIndex%12+1;
  if(targetYear>9999)throw new Error('Prazo fora do intervalo permitido.');
  const lastDay=new Date(Date.UTC(targetYear,targetMonth,0)).getUTCDate();
  return makeUTC(targetYear,targetMonth,Math.min(d,lastDay));
}
function addDays(date,days){const {y,m,d}=parseISO(date);const out=makeUTC(y,m,d);out.setUTCDate(out.getUTCDate()+days);return out;}
function fmt(date){return new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',day:'2-digit',month:'2-digit',year:'numeric'}).format(date);}
function calc(){
  el('error').hidden=true;
  try{
    const iso=el('baseDate').value;
    const {y,m,d}=parseISO(iso);
    const base=makeUTC(y,m,d);
    let end;
    if(selected.unit==='days')end=addDays(iso,selected.amount);
    else end=addMonths(iso,selected.amount*(selected.unit==='years'?12:1));
    if(end.getUTCFullYear()>9999)throw new Error('Prazo fora do intervalo permitido.');
    const product=el('product').value.trim()||'Não informado';
    latest={product,base:fmt(base),end:fmt(end),period:selected.label};
    el('resultDate').textContent=latest.end;
    el('resultWeekday').textContent=weekdayFormat.format(end);
    el('referenceValue').textContent=latest.base;
    el('periodValue').textContent=latest.period;
    el('productValue').textContent=product;
    el('printProduct').textContent=`Produto: ${product}`;
    el('printManufacture').textContent=`Fabricação/referência: ${latest.base}`;
    el('printExpiry').textContent=`Validade: ${latest.end}`;
    el('printPeriod').textContent=`Prazo informado: ${latest.period}`;
  }catch(err){latest=null;el('error').textContent=err.message;el('error').hidden=false;}
}
function setPeriod(amount,unit,label){selected={amount,unit,label};document.querySelectorAll('.choice').forEach(btn=>{const active=unit==='months'&&Number(btn.dataset.months)===amount;btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',String(active));});calc();}
document.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{const amount=Number(btn.dataset.months);setPeriod(amount,'months',amount===12?'1 ano':`${amount} ${amount===1?'mês':'meses'}`);}));
el('applyCustom').addEventListener('click',()=>{const raw=el('customAmount').value;const amount=Number(raw);const unit=el('customUnit').value;if(!raw||!Number.isInteger(amount)||amount<1||amount>1200){el('error').hidden=false;el('error').textContent='Digite um prazo inteiro entre 1 e 1200.';return;}const single={days:'dia',months:'mês',years:'ano'};const plural={days:'dias',months:'meses',years:'anos'};setPeriod(amount,unit,`${amount} ${amount===1?single[unit]:plural[unit]}`);});
el('calculate').addEventListener('click',calc);
el('baseDate').addEventListener('change',calc);
el('product').addEventListener('input',calc);
el('todayBtn').addEventListener('click',()=>{el('baseDate').value=getBrazilToday();calc();});
el('copy').addEventListener('click',async()=>{if(!latest)return;const text=`Produto: ${latest.product}\nData de fabricação/referência: ${latest.base}\nPrazo: ${latest.period}\nValidade: ${latest.end}`;try{await navigator.clipboard.writeText(text);el('copy').textContent='✓ Copiado!';setTimeout(()=>el('copy').textContent='⧉ Copiar resultado',1800);}catch{const input=document.createElement('textarea');input.value=text;document.body.appendChild(input);input.select();try{document.execCommand('copy');el('copy').textContent='✓ Copiado!';setTimeout(()=>el('copy').textContent='⧉ Copiar resultado',1800);}catch{el('error').hidden=false;el('error').textContent='Não foi possível copiar automaticamente neste navegador.';}input.remove();}});
el('print').addEventListener('click',()=>{if(latest)window.print();});
async function syncClock(){
  const clock=el('clockInfo');
  try{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),4000);
    let data;
    try{const response=await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo',{signal:controller.signal,cache:'no-store'});if(!response.ok)throw Error('Indisponível');data=await response.json();}finally{clearTimeout(timer);}
    if(!data.datetime||!Number.isFinite(Date.parse(data.datetime)))throw Error('Data inválida');
    const onlineDate=getBrazilToday(new Date(data.datetime));
    // Atualiza o valor inicial; não sobrescreve escolha manual do usuário.
    if(el('baseDate').value===getBrazilToday()) {el('baseDate').value=onlineDate;calc();}
    clock.textContent=`Data de Brasília verificada pela internet: ${fmt(makeUTC(...[Number(onlineDate.slice(0,4)),Number(onlineDate.slice(5,7)),Number(onlineDate.slice(8,10))]))}.`;
  }catch{clock.textContent='Data de Brasília obtida do relógio do dispositivo. Não foi possível consultar a hora online; confirme se o aparelho está ajustado corretamente.';}
}
el('baseDate').value=getBrazilToday();calc();syncClock();
