from pathlib import Path
import re

p = Path('modules/pfm-your-first-paycheck.html')
s = p.read_text(encoding='utf-8')

s = s.replace(
    'https://script.google.com/macros/s/AKfycbzwX6kkT5EvvNiSO_dtsQ5VhNbteuqN3O9HV1SDT4zkgsiEMCtQsa8a56gK7GPVYNEv/exec',
    'https://script.google.com/macros/s/AKfycbw4kLfppzaPH0LJnYnijygKpqSN11gme9JHpgOt4_R-ReiA-cHFi53kde4hK3kl0y4/exec'
)

s = s.replace(
    'const MODULE_TITLE = "Your First Paycheck";\n\nlet started=false, answered=0, score=0, submitted=false;',
    'const MODULE_TITLE = "Your First Paycheck";\nconst MODULE_ID = "pfm-your-first-paycheck";\nconst SESSION_ID = "vl-paycheck-" + Date.now() + "-" + Math.random().toString(36).slice(2,8);\n\nlet started=false, answered=0, score=0, submitted=false, moduleStartedAt=null;'
)

s = s.replace(
    '  started=true;\n  alert(',
    '  started=true;\n  if(!moduleStartedAt) moduleStartedAt=new Date();\n  alert(',
    1
)

new_submit = '''async function submitCompletion(){
  if(submitted) return;
  submitted = true;
  const first=document.getElementById('firstName').value.trim();
  const last=document.getElementById('lastName').value.trim();
  const period=document.getElementById('classPeriod').value.trim();
  const percent=Math.round(score/questions.length*100);
  const finishedAt=new Date();
  const startedAt=moduleStartedAt || finishedAt;
  const minutes=Math.max(1,Math.round((finishedAt-startedAt)/60000));
  const payload={
    moduleId:MODULE_ID,
    moduleTitle:MODULE_TITLE,
    category:'Personal Finance',
    topic:'Paychecks, Taxes, and First Money Decisions',
    productType:'Interactive Module',
    moduleSize:'standard',
    score:score,
    totalQuestions:questions.length,
    percent:percent+'%',
    completed:'Yes',
    questionTypes:'multiple-choice, matching, sorting, calculator',
    answers:'',
    timeStarted:startedAt.toLocaleString(),
    timeFinished:finishedAt.toLocaleString(),
    totalTime:minutes+' minutes',
    reflection:document.getElementById('reflection').value.trim(),
    version:'1.0',
    teacherEmail:'',
    accessCode:'',
    sessionId:SESSION_ID,
    notes:''
  };
  const params=new URLSearchParams({
    timestamp:finishedAt.toISOString(),
    cls:'Personal Finance',
    block:period,
    firstName:first,
    lastName:last,
    qid:'BELL-PFM-FIRST-PAYCHECK',
    question:'Vivid PFM Paycheck',
    answer:JSON.stringify(payload),
    status:'On Time',
    duration:String(minutes)
  });
  setSubmitStatus('Submitting completion to MRDHQ Responses...', '');
  try{
    await fetch(GOOGLE_SCRIPT_URL+'?'+params.toString(),{method:'GET',mode:'no-cors'});
    setSubmitStatus('MRDHQ submission sent. Screenshot your certificate just in case.', 'good');
    const note=document.getElementById('certSubmitNote');
    if(note) note.textContent='MRDHQ submission sent. Screenshot your certificate just in case.';
  }catch(error){
    submitted = false;
    setSubmitStatus('Certificate created, but the MRDHQ submission may not have gone through. Screenshot the certificate and tell Mr. D.', 'warn');
    const note=document.getElementById('certSubmitNote');
    if(note) note.textContent='Submission may not have gone through. Screenshot this certificate and tell Mr. D.';
  }
}'''

s2, n = re.subn(
    r'async function submitCompletion\(\)\{.*?\n\}\n\nrender\(\);',
    new_submit + '\n\nrender();',
    s,
    count=1,
    flags=re.S,
)
if n != 1:
    raise SystemExit('Could not replace submitCompletion()')

p.write_text(s2, encoding='utf-8')
