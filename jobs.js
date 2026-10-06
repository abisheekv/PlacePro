/* Job marketplace: search, filters, sorting, eligibility check, apply, save */
const jobs=DB.get('jobs',[]);const saveKey=()=>'saved_'+(session()?.email||'guest');
function eligibility(job,p){const sk=(p.skills||[]).map(s=>s.toLowerCase());const r=[];
r.push(['CGPA (min '+job.minCgpa+')',+p.cgpa>=job.minCgpa,'Yours: '+(p.cgpa||'not set')]);
r.push(['Backlogs (max '+job.maxBacklogs+')',(+p.backlogs||0)<=job.maxBacklogs,'Yours: '+(p.backlogs||0)]);
r.push(['Graduation year ('+job.gradYear+')',+p.gradYear===job.gradYear,'Yours: '+(p.gradYear||'not set')]);
r.push(['Degree',job.degrees.includes(p.degree),'Yours: '+(p.degree||'not set')]);
job.skills.forEach(s=>r.push([s+' skill',sk.includes(s.toLowerCase()),sk.includes(s.toLowerCase())?'Found in profile':'Missing']));
r.push(['Experience ('+job.exp+')',true,'Freshers accepted']);return r}
function apply(id){const u=currentUser();if(!u){toast('Log in to apply.',1);return setTimeout(()=>location.href='login.html',900)}
const p=u.profile;if(!p.cgpa||!p.degree||!p.gradYear)return toast('Complete CGPA, degree and graduation year in your profile first.',1);
const apps=DB.get('apps',[]);if(apps.some(a=>a.jobId===id&&a.email===u.email))return toast('You already applied to this job.',1);
const res=eligibility(jobs.find(j=>j.id===id),p);if(res.some(x=>!x[1]))return toast('Not eligible: see the checklist above.',1);
apps.push({id:Date.now(),jobId:id,email:u.email,date:new Date().toISOString().slice(0,10),status:'Applied'});DB.set('apps',apps);toast('Application submitted.');closeModal()}
function toggleSave(id){if(!session()){toast('Log in to save jobs.',1);return}const s=DB.get(saveKey(),[]);const i=s.indexOf(id);i<0?s.push(id):s.splice(i,1);DB.set(saveKey(),s);toast(i<0?'Job saved.':'Job removed from saved.');render()}
function details(id){const j=jobs.find(x=>x.id===id),u=currentUser();let el='<p class="mut">Log in to run the eligibility check.</p>';
if(u){const r=eligibility(j,u.profile),ok=r.every(x=>x[1]);el=`<div class="elig"><ul>${r.map(x=>`<li>${x[1]?'✓':'✗'} <b>${esc(x[0])}</b>: ${x[1]?'Eligible':'Not eligible'} <span class="mut">(${esc(x[2])})</span></li>`).join('')}</ul><div class="verdict badge ${ok?'ok':'bad'}" style="display:block">${ok?'YOU ARE ELIGIBLE TO APPLY':'YOU ARE NOT ELIGIBLE FOR THIS JOB'}</div></div>`}
openModal(`<h2>${esc(j.title)}</h2><p>${esc(j.company)} · ${esc(j.loc)} · ${j.salary} LPA · ${j.type}</p><p>${esc(j.desc)}</p><p><b>Benefits:</b> ${esc(j.benefits)}<br><b>Apply by:</b> ${j.deadline}</p><h3>Eligibility check</h3>${el}<p><button class="btn" onclick="apply(${j.id})">Apply now</button> <button class="btn alt" onclick="toggleSave(${j.id});closeModal()">Save job</button> <button class="btn alt" onclick="closeModal()">Close</button></p>`)}
function render(){const q=$('#q').value.toLowerCase(),loc=$('#loc').value,ty=$('#type').value,so=$('#sort').value,sv=DB.get(saveKey(),[]);
let l=jobs.filter(j=>(!q||(j.title+j.company+j.skills.join(' ')).toLowerCase().includes(q))&&(!loc||j.loc===loc)&&(!ty||j.type===ty));
l.sort((a,b)=>so==='hi'?b.salary-a.salary:so==='lo'?a.salary-b.salary:b.posted.localeCompare(a.posted));
$('#list').innerHTML=l.length?l.map(j=>`<div class="card job"><div class="row"><div class="lg">${j.company[0]}</div><div><b>${esc(j.title)}</b><div class="mut">${esc(j.company)} · ${esc(j.loc)}</div></div></div><div><b>${j.salary} LPA</b> <span class="badge">${j.type}</span> <span class="mut">${j.exp}</span></div><div class="chips">${j.skills.map(s=>`<span class="badge">${s}</span>`).join('')}</div><div class="mut">Posted ${j.posted}</div><div><button class="btn sm" onclick="details(${j.id})">View &amp; apply</button> <button class="btn sm alt" onclick="toggleSave(${j.id})">${sv.includes(j.id)?'Saved ✓':'Save'}</button></div></div>`).join(''):'<div class="empty">No jobs match these filters. Clear a filter to see more.</div>'}
if($('#list')){$('#loc').innerHTML='<option value="">All locations</option>'+LOCS.map(x=>`<option>${x}</option>`).join('');$$('#q,#loc,#type,#sort').forEach(e=>e.addEventListener('input',render));render()}
