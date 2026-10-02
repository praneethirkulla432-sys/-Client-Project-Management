const current=JSON.parse(localStorage.getItem("clientpm_current")||"null");
if(!current){location.href="login.html";}
const state={
 projects: JSON.parse(localStorage.getItem("pm_projects")||JSON.stringify([
  {name:"Website Redesign",client:"Acme Corporation",manager:"Admin User",status:"In Progress",budget:"₹1,20,000",start:"01 Oct 2026",end:"30 Oct 2026"},
  {name:"Mobile Application",client:"Nova Technologies",manager:"Admin User",status:"Planning",budget:"₹2,50,000",start:"05 Oct 2026",end:"20 Nov 2026"},
  {name:"CRM Integration",client:"Bright Solutions",manager:"Admin User",status:"Completed",budget:"₹95,000",start:"01 Sep 2026",end:"25 Sep 2026"}
 ])),
 tasks: JSON.parse(localStorage.getItem("pm_tasks")||JSON.stringify([
  {task:"Design landing page",project:"Website Redesign",assignee:"Designer",priority:"High",due:"05 Oct 2026",status:"In Progress"},
  {task:"Setup API integration",project:"Website Redesign",assignee:"Developer",priority:"Critical",due:"07 Oct 2026",status:"Planning"},
  {task:"Prepare test cases",project:"Mobile Application",assignee:"QA",priority:"Medium",due:"10 Oct 2026",status:"Planning"},
  {task:"Client review",project:"CRM Integration",assignee:"Project Manager",priority:"Low",due:"25 Sep 2026",status:"Completed"}
 ])),
 clients: JSON.parse(localStorage.getItem("pm_clients")||JSON.stringify([
  {name:"Acme Corporation",contact:"Rahul Sharma",email:"rahul@acme.com",phone:"+91 98765 43210",projects:3,status:"Active"},
  {name:"Nova Technologies",contact:"Priya Reddy",email:"priya@nova.com",phone:"+91 99887 66554",projects:2,status:"Active"},
  {name:"Bright Solutions",contact:"Arjun Kumar",email:"arjun@bright.com",phone:"+91 91234 56789",projects:1,status:"Completed"}
 ]))
};
const titles={
 dashboard:["Dashboard","Project overview, task status and upcoming deadlines."],
 projects:["Project Management","Create, edit and monitor all client projects."],
 tasks:["Task Management","Assign tasks, priorities, deadlines and track progress."],
 milestones:["Milestone Tracking","Monitor project milestones and completion status."],
 time:["Time Tracking","Log work hours and review time reports."],
 clients:["Client Management","Manage client profiles, contacts and communication history."],
 files:["File Sharing","Upload and organize project files and resources."],
 team:["Team Management","Manage team members, roles and workload."],
 reports:["Project Reports","Generate project, task and time reports."],
 profile:["My Profile","Manage your account information and preferences."]
};
const content=document.getElementById("pageContent");
const save=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));};
const initials=n=>n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();
document.getElementById("sideName").textContent=current.name;
document.getElementById("sideRole").textContent=current.role;
document.getElementById("topName").textContent=current.name;
document.getElementById("sideAvatar").textContent=initials(current.name);
document.getElementById("topAvatar").textContent=initials(current.name);
document.getElementById("logoutBtn").onclick=()=>{localStorage.removeItem("clientpm_current");location.href="login.html"};
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("notificationBtn").onclick=()=>showToast("You have 3 new project notifications.");

function badge(s){let c=s.toLowerCase().replace(" ","");return `<span class="badge ${c}">${s}</span>`}
function dashboard(){
 const completed=state.projects.filter(p=>p.status==="Completed").length, inprog=state.projects.filter(p=>p.status==="In Progress").length;
 return `<div class="welcome"><h2>Welcome, ${current.name} 👋</h2><p>Here is your Client Project Management overview for today.</p></div>
 <div class="cards">
  <div class="stat"><div class="label">Total Projects</div><div class="num">${state.projects.length}</div><div class="trend">↑ 2 this month</div></div>
  <div class="stat"><div class="label">Active Projects</div><div class="num">${inprog+1}</div><div class="trend">● On schedule</div></div>
  <div class="stat"><div class="label">Pending Tasks</div><div class="num">${state.tasks.filter(t=>t.status!=="Completed").length}</div><div class="trend">Keep deadlines in view</div></div>
  <div class="stat"><div class="label">Completed Projects</div><div class="num">${completed}</div><div class="trend">↑ Good progress</div></div>
 </div>
 <div class="section-grid">
  <div class="panel"><div class="panel-head"><h3>Recent Projects</h3><button onclick="navigate('projects')">View All</button></div>${projectTable(state.projects.slice(0,4),true)}</div>
  <div class="panel"><div class="panel-head"><h3>Upcoming Tasks</h3><button onclick="navigate('tasks')">View All</button></div><div class="list">${state.tasks.slice(0,4).map(t=>`<div class="list-item"><div><strong>${t.task}</strong><small>${t.project} · Due ${t.due}</small></div>${badge(t.priority)}</div>`).join("")}</div></div>
 </div>
 <div class="section-grid"><div class="panel"><div class="panel-head"><h3>Project Progress</h3></div>${state.projects.map(p=>`<div style="margin:13px 0"><div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:6px"><b>${p.name}</b><span>${p.status==="Completed"?100:p.status==="In Progress"?68:20}%</span></div><div class="progressbar"><span style="width:${p.status==="Completed"?100:p.status==="In Progress"?68:20}%"></span></div></div>`).join("")}</div>
 <div class="panel"><div class="panel-head"><h3>Quick Actions</h3></div><div class="module-cards" style="grid-template-columns:1fr 1fr"><button class="module-card" onclick="openModal('project')">＋<h4>New Project</h4></button><button class="module-card" onclick="openModal('task')">✓<h4>New Task</h4></button><button class="module-card" onclick="navigate('files')">▱<h4>Upload File</h4></button><button class="module-card" onclick="navigate('reports')">▥<h4>View Reports</h4></button></div></div></div>`;
}
function projectTable(arr,compact=false){return `<div class="table-wrap"><table class="table"><thead><tr><th>PROJECT</th><th>CLIENT</th><th>STATUS</th><th>END DATE</th></tr></thead><tbody>${arr.map((p,i)=>`<tr><td><b>${p.name}</b></td><td>${p.client}</td><td>${badge(p.status)}</td><td>${p.end}</td></tr>`).join("")}</tbody></table></div>`}
function projects(){
 return `<div class="hero-title"><h2>All Projects</h2><p>Create and manage client projects from one place.</p></div><div class="filterbar"><input id="projectSearch" placeholder="Search projects..." oninput="filterProjects()"><select id="projectStatus" onchange="filterProjects()"><option value="">All Status</option><option>Planning</option><option>In Progress</option><option>Completed</option><option>On Hold</option></select><button class="add-btn" onclick="openModal('project')">＋ Create Project</button></div><div class="panel" id="projectPanel">${projectTable(state.projects)}</div>`;
}
function tasks(){
 return `<div class="hero-title"><h2>Task Management</h2><p>Assign tasks, priorities and deadlines.</p></div><div class="filterbar"><input placeholder="Search tasks..." oninput="filterTasks(this.value)"><select onchange="filterTasks('',this.value)" id="taskPriority"><option value="">All Priorities</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select><button class="add-btn" onclick="openModal('task')">＋ Add Task</button></div><div class="panel" id="taskPanel">${taskTable(state.tasks)}</div>`;
}
function taskTable(arr){return `<div class="table-wrap"><table class="table"><thead><tr><th>TASK</th><th>PROJECT</th><th>ASSIGNEE</th><th>PRIORITY</th><th>DUE</th><th>STATUS</th></tr></thead><tbody>${arr.map(t=>`<tr><td><b>${t.task}</b></td><td>${t.project}</td><td>${t.assignee}</td><td>${badge(t.priority)}</td><td>${t.due}</td><td>${badge(t.status)}</td></tr>`).join("")}</tbody></table></div>`}
function milestones(){
 const ms=[["Design Approval","Website Redesign","05 Oct 2026","Completed"],["Development Complete","Website Redesign","18 Oct 2026","In Progress"],["UAT Sign-off","Mobile Application","08 Nov 2026","Planning"],["Final Delivery","Mobile Application","20 Nov 2026","Planning"]];
 return `<div class="hero-title"><h2>Milestone Tracking</h2><p>Track important project checkpoints and completion status.</p></div><div class="panel">${taskTable(ms.map(x=>({task:x[0],project:x[1],assignee:"Project Team",priority:"Medium",due:x[2],status:x[3]})))}</div>`;
}
function time(){
 return `<div class="hero-title"><h2>Time Tracking</h2><p>Log worked hours and review team time reports.</p></div><div class="cards"><div class="stat"><div class="label">Hours This Week</div><div class="num">34.5</div><div class="trend">↑ 8% from last week</div></div><div class="stat"><div class="label">Billable Hours</div><div class="num">28.0</div></div><div class="stat"><div class="label">Unbilled</div><div class="num">6.5</div></div><div class="stat"><div class="label">Avg. Daily</div><div class="num">6.9</div></div></div><div class="panel"><div class="panel-head"><h3>Weekly Hours</h3><button onclick="showToast('Time entry saved.')">＋ Log Time</button></div><div class="bar-chart">${[55,75,45,88,65,35,18].map((h,i)=>`<div class="bar" style="height:${h}%"><small>${[6,8,5,9,7,4,2][i]}h</small></div>`).join("")}</div><div class="legend">Mon &nbsp; Tue &nbsp; Wed &nbsp; Thu &nbsp; Fri &nbsp; Sat &nbsp; Sun</div></div>`;
}
function clients(){return `<div class="hero-title"><h2>Client Management</h2><p>Manage client profiles, contacts and communication history.</p></div><div class="filterbar"><input placeholder="Search clients..."><button class="add-btn" onclick="openModal('client')">＋ Add Client</button></div><div class="panel">${`<div class="table-wrap"><table class="table"><thead><tr><th>CLIENT</th><th>CONTACT</th><th>EMAIL</th><th>PHONE</th><th>PROJECTS</th><th>STATUS</th></tr></thead><tbody>${state.clients.map(c=>`<tr><td><b>${c.name}</b></td><td>${c.contact}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.projects}</td><td>${badge(c.status)}</td></tr>`).join("")}</tbody></table></div>`}</div>`}
function filesPage(){return `<div class="hero-title"><h2>File Sharing</h2><p>Upload and organize project documents and resources.</p></div><div class="notice">Files in this demo are stored in your browser session. Connect a backend/cloud storage service for real multi-user uploads.</div><div class="panel"><div class="panel-head"><h3>Project Files</h3><label class="add-btn" style="cursor:pointer">＋ Upload File<input type="file" hidden onchange="showToast(this.files[0]?.name+' selected')"></label></div><table class="table"><thead><tr><th>FILE</th><th>PROJECT</th><th>TYPE</th><th>UPDATED</th><th>OWNER</th></tr></thead><tbody><tr><td><b>Project Brief.pdf</b></td><td>Website Redesign</td><td>PDF</td><td>Today</td><td>Admin User</td></tr><tr><td><b>UI Wireframes.fig</b></td><td>Mobile Application</td><td>Design</td><td>Yesterday</td><td>Designer</td></tr><tr><td><b>API Documentation.docx</b></td><td>Website Redesign</td><td>Document</td><td>28 Sep</td><td>Developer</td></tr></tbody></table></div>`}
function team(){let team=[["Admin User","Project Manager","3 Projects","Online"],["Ananya Rao","Developer","2 Projects","Online"],["Kiran Das","Designer","2 Projects","Away"],["Megha Singh","QA","1 Project","Online"],["Rohit Verma","Analyst","2 Projects","Offline"]];return `<div class="hero-title"><h2>Team Management</h2><p>Manage team members, roles and workload.</p></div><div class="panel"><div class="panel-head"><h3>Team Members</h3><button class="add-btn" onclick="showToast('Invite feature ready for backend integration.')">＋ Invite Member</button></div><table class="table"><thead><tr><th>MEMBER</th><th>ROLE</th><th>WORKLOAD</th><th>STATUS</th></tr></thead><tbody>${team.map(x=>`<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]==="Online"?badge("Completed"):x[3]}</td></tr>`).join("")}</tbody></table></div>`}
function reports(){return `<div class="hero-title"><h2>Project Reports</h2><p>Review project, task and time reporting data.</p></div><div class="kpis"><div class="kpi"><b>${state.projects.length}</b><span>Total projects</span></div><div class="kpi"><b>${state.tasks.length}</b><span>Total tasks</span></div><div class="kpi"><b>34.5h</b><span>Hours this week</span></div></div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Project Report</h3><button class="add-btn" onclick="window.print()">Print / Export</button></div>${projectTable(state.projects)}</div>`}
function profile(){return `<div class="profile-grid"><div class="panel profile-card"><div class="profile-big">${initials(current.name)}</div><h2>${current.name}</h2><p>${current.role}</p><span class="badge completed">Active Account</span></div><div class="panel"><div class="panel-head"><h3>Account Information</h3></div><div class="form-grid"><label>Full Name<input id="pname" value="${current.name}"></label><label>Email<input value="${current.email}" disabled></label><label>Role<select id="prole"><option>${current.role}</option><option>Project Manager</option><option>Developer</option><option>Designer</option><option>QA</option><option>Client</option></select></label><label>Phone<input id="pphone" placeholder="+91 XXXXX XXXXX"></label><button class="add-btn" onclick="updateProfile()">Save Changes</button></div></div></div>`}

function render(page=location.hash.slice(1)||"dashboard"){
 if(!titles[page]) page="dashboard";
 document.getElementById("pageTitle").textContent=titles[page][0]; document.getElementById("pageSubtitle").textContent=titles[page][1];
 document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===page));
 const map={dashboard,projects,tasks,milestones,time,clients,files:filesPage,team,reports,profile};
 content.innerHTML=map[page]();
 document.getElementById("sidebar").classList.remove("open");
}
function navigate(p){location.hash=p}
window.addEventListener("hashchange",()=>render());
render();

function filterProjects(){const q=(document.getElementById("projectSearch")?.value||"").toLowerCase(),s=document.getElementById("projectStatus")?.value||"";let a=state.projects.filter(p=>(p.name+p.client).toLowerCase().includes(q)&&(!s||p.status===s));document.getElementById("projectPanel").innerHTML=projectTable(a)}
function filterTasks(q="",priority=""){q=(q||"").toLowerCase();priority=priority||document.getElementById("taskPriority")?.value||"";let a=state.tasks.filter(t=>(t.task+t.project+t.assignee).toLowerCase().includes(q)&&(!priority||t.priority===priority));document.getElementById("taskPanel").innerHTML=taskTable(a)}

function openModal(type){
 const forms={
 project:["Create New Project",`<div class="modal-form-grid"><label>Project Name<input id="m1" required></label><label>Client<input id="m2" required></label><label>Manager<input id="m3" value="${current.name}"></label><label>Status<select id="m4"><option>Planning</option><option>In Progress</option><option>On Hold</option></select></label><label>Budget<input id="m5" placeholder="₹0"></label><label>Start Date<input id="m6" type="date"></label><label>End Date<input id="m7" type="date"></label><button class="modal-submit" type="submit">Create Project</button></div>`],
 task:["Add New Task",`<div class="modal-form-grid"><label>Task Name<input id="m1" required></label><label>Project<input id="m2" required></label><label>Assignee<input id="m3" required></label><label>Priority<select id="m4"><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label><label>Due Date<input id="m5" type="date"></label><label>Status<select id="m6"><option>Planning</option><option>In Progress</option><option>Completed</option></select></label><button class="modal-submit" type="submit">Add Task</button></div>`],
 client:["Add New Client",`<div class="modal-form-grid"><label>Company Name<input id="m1" required></label><label>Contact Person<input id="m2" required></label><label>Email<input id="m3" type="email" required></label><label>Phone<input id="m4" required></label><button class="modal-submit" type="submit">Add Client</button></div>`]
 };
 document.getElementById("modalTitle").textContent=forms[type][0]; document.getElementById("modalForm").innerHTML=forms[type][1]; document.getElementById("modal").classList.add("show");
 document.getElementById("modalForm").onsubmit=e=>{e.preventDefault();
  if(type==="project"){state.projects.push({name:m1.value,client:m2.value,manager:m3.value,status:m4.value,budget:m5.value||"₹0",start:m6.value||"Not set",end:m7.value||"Not set"});save("pm_projects",state.projects)}
  if(type==="task"){state.tasks.push({task:m1.value,project:m2.value,assignee:m3.value,priority:m4.value,due:m5.value||"Not set",status:m6.value});save("pm_tasks",state.tasks)}
  if(type==="client"){state.clients.push({name:m1.value,contact:m2.value,email:m3.value,phone:m4.value,projects:0,status:"Active"});save("pm_clients",state.clients)}
  closeModal();showToast("Saved successfully!");render(location.hash.slice(1)||"dashboard");
 };
}
function closeModal(){document.getElementById("modal").classList.remove("show")}
document.getElementById("modalClose").onclick=closeModal;
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
function updateProfile(){current.name=document.getElementById("pname").value.trim()||current.name;current.role=document.getElementById("prole").value;localStorage.setItem("clientpm_current",JSON.stringify(current));document.getElementById("sideName").textContent=current.name;document.getElementById("topName").textContent=current.name;document.getElementById("sideRole").textContent=current.role;document.getElementById("sideAvatar").textContent=initials(current.name);document.getElementById("topAvatar").textContent=initials(current.name);showToast("Profile updated.")}
