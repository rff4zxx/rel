const appleBtn  = document.getElementById('appleBtn');
const appleMenu = document.getElementById('appleMenu');

appleBtn.addEventListener('click', e => {
  e.stopPropagation();
  const open = appleMenu.classList.toggle('show');
  appleBtn.classList.toggle('active', open);
});
document.addEventListener('click', () => {
  appleMenu.classList.remove('show');
  appleBtn.classList.remove('active');
});
appleMenu.addEventListener('click', e => e.stopPropagation());

/* ── CLOCK ── */
function updateClock() {
  const now = new Date();
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[now.getDay()];
  const dateNum = now.getDate();
  const monthName = months[now.getMonth()];
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  const formattedTime = `${dayName} ${dateNum} ${monthName} ${hours}.${minutes}`;
  
  const clockElement = document.getElementById('clock'); 
  if (clockElement) {
    clockElement.textContent = formattedTime;
  }
}
setInterval(updateClock, 1000);
updateClock();


/* ── DRAG WINDOW ── */
const win = document.getElementById('win');
const bar = document.getElementById('titlebar');
let drag=false, ox=0, oy=0;

bar.addEventListener('mousedown', e => {
  if (window.innerWidth <= 768) return;
  drag=true;
  const r=win.getBoundingClientRect();
  ox=e.clientX-r.left; oy=e.clientY-r.top;
  win.style.transition='none';
  win.style.position='fixed'; win.style.margin='0';
  e.preventDefault();
});

document.addEventListener('mousemove', e => {
  if(!drag) return;
  win.style.left=(e.clientX-ox)+'px';
  win.style.top =(e.clientY-oy)+'px';
  win.style.transform='none';
});
document.addEventListener('mouseup', ()=>{ drag=false; });


/* ── PARTICLES ── */
const cv = document.getElementById('bg');
const cx = cv.getContext('2d');
let W, H, mouse={x:-999,y:-999};
function resize(){ W=cv.width=innerWidth; H=cv.height=innerHeight; }
resize(); window.addEventListener('resize', resize);

const N = 100;
const ps = Array.from({length:N}, ()=>({
  x: Math.random()*innerWidth,
  y: Math.random()*innerHeight,
  vx:(Math.random()-.5)*.28,
  vy:(Math.random()-.5)*.28,
  r: .5+Math.random()*.9,
  tw:Math.random()*Math.PI*2
}));

(function loop(){
  cx.clearRect(0,0,W,H);
  const t=Date.now()*.001;
  for(const p of ps){
    const s=Math.hypot(p.vx,p.vy);
    if(s>2){p.vx=p.vx/s*2;p.vy=p.vy/s*2;}
    p.vx*=.97; p.vy*=.97;
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<-4)p.x=W+4; if(p.x>W+4)p.x=-4;
    if(p.y<-4)p.y=H+4; if(p.y>H+4)p.y=-4;
    const a=(.55+.35*Math.sin(t*1.3+p.tw))*.65;
    cx.beginPath(); cx.arc(p.x,p.y,p.r,0,Math.PI*2);
    cx.fillStyle=`rgba(190,178,255,${a.toFixed(2)})`; cx.fill();
  }
  for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
    const dx=ps[i].x-ps[j].x, dy=ps[i].y-ps[j].y, d=Math.hypot(dx,dy);
    if(d<95){
      cx.beginPath(); cx.moveTo(ps[i].x,ps[i].y); cx.lineTo(ps[j].x,ps[j].y);
      cx.strokeStyle=`rgba(170,155,240,${((1-d/95)*.07).toFixed(3)})`;
      cx.lineWidth=.5; cx.stroke();
    }
  }
  requestAnimationFrame(loop);
})();

window.addEventListener('mousemove', e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
window.addEventListener('mouseleave',()=>{mouse.x=-999;mouse.y=-999;});


/* ── PROFILE WINDOW open/close ── */
const profileWin = document.getElementById('win');
const closeProfileBtn = document.getElementById('close-profile-btn');
const profileMenuBtn = document.getElementById('profile-btn');
const systemSettingsBtn = document.getElementById('system-settings-btn');

function openProfileWin() {
  profileWin.style.display = 'block';
  profileWin.style.animation = 'none';
  void profileWin.offsetWidth; // reflow to restart animation
  profileWin.style.animation = 'windowEntrance 0.40s cubic-bezier(0.34,1.46,0.64,1) forwards';
  appleMenu.classList.remove('show');
  appleBtn.classList.remove('active');
}

closeProfileBtn.addEventListener('click', e => {
  e.stopPropagation();
  profileWin.style.display = 'none';
});

profileMenuBtn.addEventListener('click', e => {
  e.stopPropagation();
  openProfileWin();
});

systemSettingsBtn.addEventListener('click', e => {
  e.stopPropagation();
  openProfileWin();
});

/* ── ABOUT THIS MAC open/close ── */
const aboutMacBtn = document.getElementById('about-mac-btn');
const aboutWin = document.getElementById('about-win');
const closeAboutBtn = document.getElementById('close-about-btn');

/* ── DRAG WINDOW ABOUT ── */
const aboutTitlebar = document.getElementById('about-titlebar');
let aboutPosX = 0, aboutPosY = 0, aboutMouseX = 0, aboutMouseY = 0;
aboutTitlebar.onmousedown = dragMouseDownAbout;

function dragMouseDownAbout(e) {
  if (e.target.closest('.traffic-lights')) return;
  e.preventDefault();
  if (aboutWin.style.transform) {
    const rect = aboutWin.getBoundingClientRect();
    aboutWin.style.transform = 'none';
    aboutWin.style.top = rect.top + 'px';
    aboutWin.style.left = rect.left + 'px';
  }
  aboutMouseX = e.clientX;
  aboutMouseY = e.clientY;
  document.onmouseup = closeDragElementAbout;
  document.onmousemove = elementDragAbout;
}
function elementDragAbout(e) {
  e.preventDefault();
  aboutPosX = aboutMouseX - e.clientX;
  aboutPosY = aboutMouseY - e.clientY;
  aboutMouseX = e.clientX;
  aboutMouseY = e.clientY;
  aboutWin.style.top = (aboutWin.offsetTop - aboutPosY) + 'px';
  aboutWin.style.left = (aboutWin.offsetLeft - aboutPosX) + 'px';
}
function closeDragElementAbout() {
  document.onmouseup = null;
  document.onmousemove = null;
}

aboutMacBtn.addEventListener('click', e => {
  e.stopPropagation();
  // Show first (hidden) to measure size, then center
  aboutWin.style.visibility = 'hidden';
  aboutWin.style.display = 'block';
  aboutWin.style.transform = 'none';
  const w = aboutWin.offsetWidth;
  const h = aboutWin.offsetHeight;
  aboutWin.style.left = Math.round((window.innerWidth - w) / 2) + 'px';
  aboutWin.style.top  = Math.round((window.innerHeight - h) / 2) + 'px';
  aboutWin.style.visibility = '';
  aboutWin.style.animation = 'none';
  void aboutWin.offsetWidth;
  aboutWin.style.animation = 'windowEntrance 0.38s cubic-bezier(0.34,1.46,0.64,1) forwards';
  appleMenu.classList.remove('show');
  appleBtn.classList.remove('active');
});

closeAboutBtn.addEventListener('click', e => {
  e.stopPropagation();
  aboutWin.style.display = 'none';
});



document.getElementById('restart-btn').addEventListener('click', () => {
  location.reload();
});

document.getElementById('shutdown-btn').addEventListener('click', () => {
  history.back();
});
