/* Shared helpers: theme, toast, modal, session */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function session(){return DB.get('session',null)}
function currentUser(){const s=session();return s&&DB.get('users',[]).find(u=>u.email===s.email)}
function toast(msg,bad){let b=$('#toasts');if(!b){b=document.createElement('div');b.id='toasts';document.body.append(b)}const t=document.createElement('div');t.className='toast'+(bad?' bad':'');t.textContent=msg;b.append(t);setTimeout(()=>t.remove(),3000)}
function openModal(html){let m=$('#modal');if(!m){m=document.createElement('div');m.id='modal';m.className='modal';m.onclick=e=>{if(e.target===m)closeModal()};document.body.append(m)}m.innerHTML=`<div class="card">${html}</div>`;m.classList.add('on')}
function closeModal(){$('#modal')?.classList.remove('on')}
function setTheme(t){document.documentElement.dataset.theme=t;DB.set('theme',t)}
setTheme(DB.get('theme','light'));
document.addEventListener('click',e=>{if(e.target.closest('[data-theme-toggle]')){e.preventDefault();setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')}});
function logout(){localStorage.removeItem('pp_session');location.href='index.html'}
