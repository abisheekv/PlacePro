/* Demo authentication (frontend-only; passwords are stored in plain text in localStorage - never do this in production) */
const validEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
$('#loginForm')?.addEventListener('submit',e=>{e.preventDefault();const em=$('#email').value.trim().toLowerCase(),pw=$('#password').value,er=$('#err');
if(!em||!pw)return er.textContent='Enter your email and password.';if(!validEmail(em))return er.textContent='Enter a valid email address.';
const u=DB.get('users',[]).find(x=>x.email===em&&x.password===pw);if(!u)return er.textContent='Email or password is incorrect.';
DB.set('session',{email:u.email,role:u.role});location.href='student-dashboard.html'});
$('#regForm')?.addEventListener('submit',e=>{e.preventDefault();const n=$('#name').value.trim(),em=$('#email').value.trim().toLowerCase(),pw=$('#password').value,cf=$('#confirm').value,er=$('#err');
if(!n||!em||!pw)return er.textContent='Fill in all required fields.';if(!validEmail(em))return er.textContent='Enter a valid email address.';
if(pw.length<6)return er.textContent='Password needs at least 6 characters.';if(pw!==cf)return er.textContent='Passwords do not match.';
const us=DB.get('users',[]);if(us.some(x=>x.email===em))return er.textContent='An account with this email already exists. Try logging in.';
us.push({email:em,password:pw,role:'student',name:n,profile:{name:n,email:em,skills:[],backlogs:0}});DB.set('users',us);DB.set('session',{email:em,role:'student'});location.href='student-dashboard.html'});
