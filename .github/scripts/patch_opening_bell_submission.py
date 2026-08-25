from pathlib import Path
import re

p = Path('modules/pfm-financial-planning-goal-setting-mrd.html')
s = p.read_text()

endpoint = 'https://script.google.com/macros/s/AKfycbw4kLfppzaPH0LJnYnijygKpqSN11gme9JHpgOt4_R-ReiA-cHFi53kde4hK3kl0y4/exec'
s = re.sub(r'const COMPLETION_WEB_APP_URL = "[^"]+";', f'const COMPLETION_WEB_APP_URL = "{endpoint}";', s, count=1)

start = s.find('function submitCompletionRecord(record){')
end = s.find('\n\nrestoreCompletionLockIfNeeded();', start)
if start == -1 or end == -1:
    raise SystemExit('Could not locate submission function boundaries')

new_func = r'''function submitCompletionRecord(record){
  if(completionSubmitted){
    toast("Completion already submitted.");
    return;
  }

  completionSubmitted = true;
  toast("Saving completion...");

  const p = new URLSearchParams({
    bellId: "PFM-GOAL-SETTING",
    label: "Vivid PFM Goal Setting",
    firstName: record.firstName || "",
    lastName: record.lastName || "",
    name: ((record.firstName||"")+" "+(record.lastName||"")).trim(),
    answer: JSON.stringify({
      moduleId: record.moduleId,
      moduleTitle: record.moduleTitle,
      category: record.category,
      topic: record.topic,
      productType: record.productType,
      moduleSize: record.moduleSize,
      score: record.score,
      totalQuestions: record.totalQuestions,
      percent: record.percent,
      completed: record.completed,
      questionTypes: record.questionTypes,
      answers: record.answers,
      timeStarted: record.timeStarted,
      timeFinished: record.timeFinished,
      totalTime: record.totalTime,
      reflection: record.reflection,
      version: record.version,
      teacherEmail: record.teacherEmail,
      accessCode: record.accessCode,
      sessionId: record.sessionId,
      shopifyOrderNumber: record.shopifyOrderNumber,
      notes: record.notes
    }),
    late: "0",
    duration: String(record.totalTime || "").replace(/[^0-9]/g, "") || "1",
    timestamp: record.timestamp || new Date().toISOString(),
    cls: "PFM - " + (record.classPeriod || "")
  });

  fetch(`${COMPLETION_WEB_APP_URL}?${p.toString()}`,{
    method:"GET",
    mode:"no-cors"
  })
  .then(()=>{
    toast("Completion saved to Google Sheets.");
  })
  .catch(error=>{
    completionSubmitted = false;
    console.error("Completion submit error:", error);
    toast("Certificate created, but completion did not save. Tell your teacher.");
  });
}'''

s = s[:start] + new_func + s[end:]
p.write_text(s)
print('Patched Opening Bell-style submission successfully')
