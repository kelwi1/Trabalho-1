const pages = [...document.querySelectorAll('.page')];
const navLinks = [...document.querySelectorAll('.nav-link')];
let selectedDate = null, selectedTime = null, currentMonth = new Date();
let booking = null, userName = 'Visitante', userEmail = '';

function showPage(id){
  const target = document.getElementById(id) || document.getElementById('inicio');
  pages.forEach(p=>p.classList.toggle('active',p===target));
  navLinks.forEach(a=>a.classList.toggle('active',a.dataset.page===target.id));
  document.getElementById('mainNav').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.go)));
navLinks.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPage(a.dataset.page)}));
document.getElementById('menuToggle').addEventListener('click',()=>document.getElementById('mainNav').classList.toggle('open'));
document.getElementById('year').textContent = new Date().getFullYear();

function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
document.querySelectorAll('.service-card').forEach(card=>card.addEventListener('click',()=>{
  document.getElementById('serviceSelect').value=card.dataset.service;
  document.querySelectorAll('.service-card').forEach(c=>c.classList.remove('selected'));
  card.classList.add('selected');showPage('agendamento');
}));

function renderCalendar(){
  const y=currentMonth.getFullYear(), m=currentMonth.getMonth();
  document.getElementById('monthLabel').textContent=new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(currentMonth);
  const cal=document.getElementById('calendar');cal.innerHTML='';
  ['D','S','T','Q','Q','S','S'].forEach(d=>{const el=document.createElement('span');el.textContent=d;cal.append(el)});
  const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
  for(let i=0;i<first;i++){const blank=document.createElement('span');cal.append(blank)}
  const today=new Date();today.setHours(0,0,0,0);
  for(let day=1;day<=days;day++){
    const date=new Date(y,m,day), btn=document.createElement('button');btn.textContent=day;
    btn.disabled=date<today || date.getDay()===0;
    if(selectedDate && date.toDateString()===selectedDate.toDateString())btn.classList.add('chosen');
    btn.addEventListener('click',()=>{selectedDate=date;selectedTime=null;renderCalendar();renderTimes();document.getElementById('bookingHint').textContent='Agora escolha um horário disponível.'});
    cal.append(btn);
  }
}
function renderTimes(){
  document.querySelectorAll('#timeSlots button').forEach(b=>{
    b.classList.toggle('selected',b.textContent===selectedTime);
    b.onclick=()=>{selectedTime=b.textContent;renderTimes();};
  });
}
document.getElementById('prevMonth').onclick=()=>{currentMonth.setMonth(currentMonth.getMonth()-1);renderCalendar()};
document.getElementById('nextMonth').onclick=()=>{currentMonth.setMonth(currentMonth.getMonth()+1);renderCalendar()};
renderCalendar();renderTimes();

document.getElementById('confirmBooking').addEventListener('click',()=>{
  if(!selectedDate||!selectedTime){toast('Selecione uma data e um horário.');return}
  booking={service:document.getElementById('serviceSelect').value,date:selectedDate,time:selectedTime};
  const dateText=selectedDate.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'});
  document.getElementById('bookingSummary').innerHTML=`<b>▦ Data</b><br>${dateText}<br><b>◷ Horário</b><br>${selectedTime}<br><b>🔧 Serviço</b><br>${booking.service}`;
  document.getElementById('trackDate').textContent=`${dateText} às ${selectedTime}`;
  showPage('confirmacao');
});
document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();userEmail=document.getElementById('loginEmail').value;userName=userEmail.split('@')[0].replace(/[._-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  document.getElementById('profileName').textContent=userName;document.getElementById('profileEmail').textContent=userEmail;
  toast('Login demonstrativo realizado!');showPage('perfil');
});
document.getElementById('registerLink').addEventListener('click',e=>{e.preventDefault();toast('Cadastro estará disponível em uma próxima versão.')});
document.getElementById('logoutBtn').addEventListener('click',()=>{userName='Visitante';userEmail='';document.getElementById('profileName').textContent=userName;document.getElementById('profileEmail').textContent='Entre para acessar seus dados';showPage('inicio');toast('Você saiu da demonstração.')});
