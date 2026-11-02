// The same page compositor powers the reader, print export and moving book proof.
// Export dimensions never imply that a small illustration has native 8K detail.
async function updateBookSourceQuality(){
 const state=bookState,target=$('#bookSourceQuality');if(!state||!target)return;
 try{let width,height;
  if(state.index<0){const art=await loadCharacterImage(state.story);width=Math.floor(art.sw);height=Math.floor(art.sh)}
  else{const info=sceneInfo(state.story,state.index),img=await bookImage(info.src);width=Math.floor(img.width/info.cols);height=Math.floor(img.height/info.rows)}
  if(bookState!==state||!target.isConnected)return;
  const edge=Number($('#bookExportSize')?.value)||8192,ppi=Math.floor(Math.min(width,height)/(21/2.54));
  target.textContent=t(`تنزيل ${edge} × ${edge} بكسل · مصدر الرسم ${width} × ${height} بكسل (نحو ${ppi} نقطة/بوصة عند ٢١ سم). النص يُرسم بدقة التصدير. الرسم مكبّر، وليس 8K أصليًا.`,`Export ${edge} × ${edge} px · Source art ${width} × ${height} px (about ${ppi} ppi at 21 cm). Text is rendered at export resolution. Artwork is enlarged, not native 8K.`);
 }catch{target.textContent=t('تعذّر قراءة دقة مصدر الرسم.','Could not read the source artwork resolution.')}
}

const bookCinema=document.createElement('dialog');bookCinema.id='bookCinema';bookCinema.className='book-cinema';document.body.append(bookCinema);
let cinemaState=null;
const filmText=(state,ar,en)=>state.ar?ar:en;
const filmClock=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
function cinemaSegments(s){let at=0;const result=[];const add=(type,pages,duration)=>{result.push({type,pages,start:at,duration});at+=duration};add('cover',[-1],2800);for(let i=0;i<s.pages.length;i+=2)add('spread',[i,...(i+1<s.pages.length?[i+1]:[])],3500);add('end',[],2500);return{segments:result,duration:at}}
function cinemaLocation(state,time){const index=state.segments.findIndex(s=>time<s.start+s.duration);const segment=state.segments[index<0?state.segments.length-1:index];return{segment,index:index<0?state.segments.length-1:index,p:Math.max(0,Math.min(1,(time-segment.start)/segment.duration))}}
async function openBookCinema(s){
 if(cinemaState?.recording)return;
 if(cinemaState)disposeCinema();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const state=cinemaState={story:structuredClone(s),ar:s.language==='ar',pages:[],time:0,playing:false,ready:false,recording:false,rate:1,last:0,raf:0,uiAt:0,resources:[],...cinemaSegments(s)};
 bookCinema.dir=state.ar?'rtl':'ltr';
 bookCinema.innerHTML=`<div class="cinema-heading"><div><span class="overline">${filmText(state,'من الشاشة… إلى كتيّب بين يديك','FROM SCREEN TO A BOOK IN YOUR HANDS')}</span><h2>${esc(s.title)}</h2></div><button class="close" id="cinemaClose" aria-label="${filmText(state,'إغلاق المعاينة','Close preview')}">×</button></div><div class="cinema-stage"><canvas id="cinemaCanvas" width="1280" height="800" role="img" aria-label="${filmText(state,'معاينة متحركة لغلاف الكتيّب وصفحاته','Animated proof of the book cover and pages')}"></canvas><div class="cinema-loading" id="cinemaLoading" role="status">${filmText(state,'نجهّز غلافك وصفحات حكايتك…','Preparing your cover and story pages…')}</div></div><div class="cinema-cue" id="cinemaCue" role="status" aria-live="polite"></div><div class="cinema-controls"><button class="button" id="cinemaPlay" disabled>${filmText(state,'تشغيل ▶','Play ▶')}</button><button class="button outline" id="cinemaBack" disabled aria-label="${filmText(state,'المشهد السابق','Previous scene')}">↶</button><button class="button outline" id="cinemaNext" disabled aria-label="${filmText(state,'المشهد التالي','Next scene')}">↷</button><label class="cinema-speed">${filmText(state,'السرعة','Speed')}<select id="cinemaRate" disabled><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option></select></label><span id="cinemaTime" dir="ltr">0:00 / ${filmClock(state.duration)}</span></div><label class="cinema-seek"><span class="sr-only">${filmText(state,'موضع تشغيل المعاينة','Preview playback position')}</span><input id="cinemaSeek" type="range" min="0" max="${state.duration}" step="10" value="0" disabled></label><div class="cinema-details"><p>${filmText(state,`مقاس توضيحي ٢١ × ٢١ سم · غلاف + ${s.pages.length} ${s.pages.length>10?'صفحة':'صفحات'} · تقليب ${state.ar?'من اليمين إلى اليسار':'من اليسار إلى اليمين'}`,`Illustrative 21 × 21 cm book · Cover + ${s.pages.length} pages · ${state.ar?'Right-to-left':'Left-to-right'} page order`)}</p><button class="button outline" id="cinemaDownload" disabled>${filmText(state,'تنزيل فيديو المعاينة WebM','Download preview video WebM')}</button></div><p class="cinema-note">${filmText(state,'معاينة رقمية متحركة لتصميم الكتاب، دون صوت. لون الورق وسُمك التجليد ونتيجة الطباعة الفعلية تعتمد على المطبعة. دقة الفيديو 1280 × 800؛ تنزيل صفحات 8K متاح من استوديو الكتاب.','A silent digital motion proof of the book design. Paper color, binding thickness and actual print depend on the printer. Video is 1280 × 800; 8K page downloads are available in the book studio.')}</p><p id="cinemaError" role="alert"></p>`;
 $('#cinemaClose').onclick=()=>bookCinema.close();
 if(!bookCinema.open)bookCinema.showModal();bookCinema.scrollTop=0;
 $('#cinemaPlay').onclick=()=>{if(state.time>=state.duration)state.time=0;state.playing=!state.playing;state.last=0;syncCinemaUI(state,true)};
 $('#cinemaBack').onclick=()=>seekCinema(state,Math.max(0,cinemaLocation(state,state.time).index-1));
 $('#cinemaNext').onclick=()=>seekCinema(state,Math.min(state.segments.length-1,cinemaLocation(state,state.time).index+1));
 $('#cinemaSeek').oninput=e=>{state.time=Number(e.target.value);state.last=0;drawBookCinema(state);syncCinemaUI(state,true)};
 $('#cinemaRate').onchange=e=>{state.rate=Number(e.target.value);state.last=0};
 $('#cinemaDownload').onclick=()=>downloadBookCinema(state);
 try{
  const indices=[-1,...s.pages.map((_,i)=>i)];
  for(let n=0;n<indices.length;n++){
   const canvas=await paintBookPage(state.story,indices[n],{size:1200,portrait:false});
   if(cinemaState!==state||!bookCinema.open){canvas.width=1;return}
   state.pages.push(canvas);$('#cinemaLoading').textContent=filmText(state,`نجهّز الصفحة ${n+1} من ${indices.length}…`,`Preparing page ${n+1} of ${indices.length}…`);
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  state.ready=true;state.playing=!reduced;$('#cinemaLoading').hidden=true;
  bookCinema.querySelectorAll('button,input,select').forEach(b=>b.disabled=false);
  if(!cinemaRecorderType()){$('#cinemaDownload').disabled=true;$('#cinemaDownload').textContent=filmText(state,'تنزيل الفيديو غير مدعوم في هذا المتصفح','Video download is not supported in this browser')}
  syncCinemaUI(state,true);drawBookCinema(state);state.raf=requestAnimationFrame(now=>cinemaTick(state,now));
 }catch(e){if(cinemaState===state){$('#cinemaLoading').hidden=true;$('#cinemaError').textContent=e.message||filmText(state,'تعذّر تجهيز المعاينة. أعد فتحها للمحاولة.','Could not prepare the preview. Reopen to retry.')}}
}
function seekCinema(state,index){state.time=state.segments[index].start;state.last=0;drawBookCinema(state);syncCinemaUI(state,true)}
function syncCinemaUI(state,force=false){
 if(cinemaState!==state)return;const now=performance.now();if(!force&&now-state.uiAt<200)return;state.uiAt=now;
 $('#cinemaPlay').textContent=state.time>=state.duration?filmText(state,'إعادة العرض ↻','Replay ↻'):state.playing?filmText(state,'إيقاف مؤقت Ⅱ','Pause Ⅱ'):filmText(state,'تشغيل ▶','Play ▶');
 $('#cinemaSeek').value=state.time;$('#cinemaTime').textContent=`${filmClock(state.time)} / ${filmClock(state.duration)}`;
 const {segment,index}=cinemaLocation(state,state.time);if(state.cueIndex!==index){state.cueIndex=index;$('#cinemaCue').textContent=segment.type==='cover'?filmText(state,'غلاف يحمل اسم بطل الحكاية','A cover bearing your hero’s name'):segment.type==='end'?filmText(state,'حكاية كاملة… وذكرى تُحفظ','A complete story. A memory to keep.'):filmText(state,`داخل الكتيّب · ${segment.pages.length>1?'الصفحتان':'الصفحة'} ${segment.pages.map(p=>p+1).join(' و ')}`,`Inside the book · ${segment.pages.length>1?'Pages':'Page'} ${segment.pages.map(p=>p+1).join(' & ')}`)}
}
function cinemaTick(state,now){if(cinemaState!==state||!bookCinema.open)return;
 if(state.playing&&state.last){state.time=Math.min(state.duration,state.time+(now-state.last)*state.rate);if(state.time===state.duration){state.playing=false;if(state.recording&&state.recorder?.state==='recording')state.recorder.stop()}}
 state.last=now;if(state.playing)drawBookCinema(state);syncCinemaUI(state);state.raf=requestAnimationFrame(t=>cinemaTick(state,t));
}
function drawBookCinema(state){
 if(!state.ready||cinemaState!==state)return;const canvas=$('#cinemaCanvas'),ctx=canvas.getContext('2d'),{segment,index,p}=cinemaLocation(state,state.time),w=canvas.width,h=canvas.height;
 const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#163f37');bg.addColorStop(.6,'#315b4a');bg.addColorStop(1,'#a58a59');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#ffffff05';for(let n=0;n<18;n++){ctx.beginPath();ctx.arc(60+n*88,620+Math.sin(n*1.4)*45,60+n%3*30,0,Math.PI*2);ctx.fill()}
 const bookY=132,side=472,spine=w/2;
 ctx.save();ctx.shadowColor='#001d19aa';ctx.shadowBlur=45;ctx.shadowOffsetY=35;
 if(segment.type!=='spread'){
  const bob=Math.sin(p*Math.PI)*7,x=(w-side)/2,y=bookY-bob;
  ctx.save();ctx.translate(w/2,y+side/2);ctx.rotate((segment.type==='cover'?-1:1)*.025);ctx.fillStyle='#c4b694';ctx.fillRect(-side/2+9,-side/2+12,side,side);ctx.drawImage(state.pages[0],-side/2,-side/2,side,side);ctx.shadowColor='transparent';ctx.strokeStyle='#e9dbbb';ctx.lineWidth=2;ctx.strokeRect(-side/2,-side/2,side,side);const gleam=ctx.createLinearGradient(-side/2,0,side/2,0);gleam.addColorStop(0,'#fff5');gleam.addColorStop(.035,'#0003');gleam.addColorStop(.07,'#fff0');gleam.addColorStop(1,'#fff0');ctx.fillStyle=gleam;ctx.fillRect(-side/2,-side/2,side,side);ctx.restore();
 }else{
  ctx.fillStyle='#bda981';ctx.fillRect(spine-side-8,bookY+7,side*2+16,side+12);ctx.shadowColor='transparent';
  const drawLeaf=(page,x)=>{ctx.fillStyle='#f7f0df';ctx.fillRect(x,bookY,side,side);if(page!==undefined)ctx.drawImage(state.pages[page+1],x,bookY,side,side);ctx.strokeStyle='#e1d8bc';ctx.lineWidth=1;ctx.strokeRect(x,bookY,side,side)};
  const first=segment.pages[0],second=segment.pages[1];drawLeaf(state.ar?second:first,spine-side);drawLeaf(state.ar?first:second,spine);
  // A page turns around the binding, with both sides shaded during the turn.
  const turn=Math.min(1,p*segment.duration/850);
  if(state.playing&&index>1&&turn<1){const previous=state.segments[index-1].pages,face=turn<.5?previous[previous.length-1]:first,scale=Math.abs(Math.cos(turn*Math.PI)),right=state.ar?turn<.5:turn>=.5,leafW=side*scale,x=right?spine:spine-leafW;
   ctx.save();ctx.shadowColor='#001c19aa';ctx.shadowBlur=20;ctx.shadowOffsetX=right?15:-15;ctx.fillStyle='#f5eedb';ctx.fillRect(x,bookY,leafW,side);ctx.drawImage(state.pages[face+1],x,bookY,leafW,side);ctx.shadowColor='transparent';ctx.fillStyle=`rgba(26,39,29,${Math.sin(turn*Math.PI)*.35})`;ctx.fillRect(x,bookY,leafW,side);ctx.restore();
  }
  const shade=ctx.createLinearGradient(spine-30,0,spine+30,0);shade.addColorStop(0,'#0000');shade.addColorStop(.48,'#172f2866');shade.addColorStop(.5,'#091f2977');shade.addColorStop(.54,'#fff2');shade.addColorStop(1,'#0000');ctx.fillStyle=shade;ctx.fillRect(spine-30,bookY,60,side);
  ctx.strokeStyle='#e9dfc2';for(let n=1;n<=4;n++){ctx.beginPath();ctx.moveTo(spine-side,bookY+side+3*n);ctx.lineTo(spine-2,bookY+side+3*n-3);ctx.moveTo(spine+2,bookY+side+3*n-3);ctx.lineTo(spine+side,bookY+side+3*n);ctx.stroke()}
 }
 ctx.restore();ctx.textAlign='center';ctx.direction=state.ar?'rtl':'ltr';ctx.fillStyle='#fff9e9';ctx.font='600 24px "Hikaya Arabic",sans-serif';ctx.fillText(segment.type==='cover'?filmText(state,'كتاب صغير… ومغامرة كبيرة','A little book. A big adventure.'):segment.type==='end'?filmText(state,'من عُمان… إلى خيال طفلك','From Oman to your child’s imagination'):filmText(state,'كل صفحة، مشهد جديد من الحكاية','Every page, a new scene in the story'),w/2,706,w-80);ctx.font='500 15px "Hikaya Arabic",sans-serif';ctx.fillStyle='#efe6ccc7';ctx.fillText('HIKAYA · '+filmText(state,'معاينة رقمية للكتيّب المطبوع','Digital printed-book preview'),w/2,753,w-80);
}
function cinemaRecorderType(){if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return null;return ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(type=>MediaRecorder.isTypeSupported(type))||null}
async function downloadBookCinema(state){
 if(cinemaState!==state||state.recording||!state.ready)return;const mime=cinemaRecorderType();if(!mime)return;
 const controls=[...bookCinema.querySelectorAll('button,input,select')],previous={time:state.time,playing:state.playing,rate:state.rate};let recorder;
 try{
  state.recording=true;controls.forEach(b=>b.disabled=true);$('#cinemaError').textContent='';$('#cinemaDownload').textContent=filmText(state,'نسجّل دورة كاملة…','Recording one complete preview…');state.time=0;state.last=0;state.rate=1;state.playing=true;drawBookCinema(state);
  state.stream=$('#cinemaCanvas').captureStream(24);recorder=state.recorder=new MediaRecorder(state.stream,{mimeType:mime,videoBitsPerSecond:6000000});const chunks=[];
  const done=new Promise((resolve,reject)=>{recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=resolve;recorder.onerror=()=>reject(Error(filmText(state,'تعذّر تسجيل الفيديو.','Video recording failed.')))});recorder.start(1000);await done;
  if(cinemaState===state&&chunks.length)download(new Blob(chunks,{type:'video/webm'}),'hikaya-printed-book-preview.webm');
 }catch(e){if(cinemaState===state)$('#cinemaError').textContent=e.message}
 finally{if(recorder?.state==='recording')recorder.stop();state.stream?.getTracks().forEach(t=>t.stop());state.recording=false;if(cinemaState===state){controls.forEach(b=>b.disabled=false);$('#cinemaDownload').textContent=filmText(state,'تنزيل فيديو المعاينة WebM','Download preview video WebM');Object.assign(state,previous,{last:0});syncCinemaUI(state,true)}}
}
function disposeCinema(){const state=cinemaState;if(!state)return;cinemaState=null;cancelAnimationFrame(state.raf);if(state.recorder?.state==='recording')state.recorder.stop();state.stream?.getTracks().forEach(t=>t.stop());state.pages.forEach(c=>{c.width=1;c.height=1});state.pages.length=0}
bookCinema.addEventListener('cancel',e=>{if(cinemaState?.recording)e.preventDefault()});
bookCinema.addEventListener('close',disposeCinema);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&cinemaState&&!cinemaState.recording){cinemaState.playing=false;cinemaState.last=0;syncCinemaUI(cinemaState,true)}});
