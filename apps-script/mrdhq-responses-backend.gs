const MRDHQ_SPREADSHEET_ID = '1SFtvrGktaYEqqjbiCOji2wzWCL150xUMu5nnjetvTt4';
const RESPONSES_SHEET = 'Responses';
const MODULES_MASTER_SHEET = 'Modules';

const RESPONSE_HEADERS = [
  'Timestamp','Date','Class','Block','First Name','Last Name',
  'Question ID','Question','Response','Status','Duration'
];

const MODULE_HEADERS = [
  'Timestamp','First Name','Last Name','Class Period','Module ID','Module Title',
  'Category','Topic','Product Type','Module Size','Score','Total Questions',
  'Percent','Completed','Question Types','Answers / Raw Record','Time Started',
  'Time Finished','Total Time','Reflection','Version','Teacher Email','Session ID',
  'Attempts','Points Earned','Notes / Source ID'
];

function doGet(e) {
  return handleRequest_(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  let params = {};
  try {
    if (e && e.postData && e.postData.contents) {
      const type = String(e.postData.type || '').toLowerCase();
      if (type.indexOf('application/json') > -1) {
        params = JSON.parse(e.postData.contents || '{}');
      } else if (e.parameter) {
        params = e.parameter;
      }
    } else if (e && e.parameter) {
      params = e.parameter;
    }
  } catch (err) {
    params = e && e.parameter ? e.parameter : {};
  }
  return handleRequest_(params);
}

function handleRequest_(p) {
  try {
    const ss = SpreadsheetApp.openById(MRDHQ_SPREADSHEET_ID);
    const normalized = normalizeResponse_(p);

    appendRawResponse_(ss, normalized);

    const moduleRecord = extractModuleRecord_(p, normalized);
    if (moduleRecord) {
      appendModuleRecord_(ss, MODULES_MASTER_SHEET, moduleRecord);
      appendModuleRecord_(ss, moduleSheetName_(moduleRecord), moduleRecord);
    }

    return json_({
      ok: true,
      module: !!moduleRecord,
      moduleSheet: moduleRecord ? moduleSheetName_(moduleRecord) : '',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    return json_({ok:false,error:String(err && err.message ? err.message : err)});
  }
}

function normalizeResponse_(p) {
  const now = new Date();
  const timestampRaw = first_(p.timestamp, p.Timestamp, now.toISOString());
  const timestamp = safeDate_(timestampRaw) || now;
  const cls = first_(p.cls, p.className, p.class, p.course, '');
  const block = first_(p.block, p.period, p.classPeriod, deriveBlock_(cls), '');
  const firstName = first_(p.firstName, p.firstname, '');
  const lastName = first_(p.lastName, p.lastname, '');
  const qid = first_(p.qid, p.questionId, p.bellId, p.id, '');
  const question = first_(p.question, p.label, p.title, '');
  const answer = first_(p.answer, p.response, '');
  const status = first_(p.status, String(p.late || '') === '1' ? 'Late' : 'On Time');
  const duration = first_(p.duration, '');

  return {
    timestamp: timestamp,
    date: Utilities.formatDate(timestamp, Session.getScriptTimeZone() || 'America/New_York', 'M/d/yyyy'),
    cls: cls,
    block: block,
    firstName: firstName,
    lastName: lastName,
    qid: qid,
    question: question,
    answer: answer,
    status: status,
    duration: duration
  };
}

function appendRawResponse_(ss, r) {
  const sheet = getOrCreateSheet_(ss, RESPONSES_SHEET, RESPONSE_HEADERS);
  sheet.appendRow([
    r.timestamp,
    r.date,
    r.cls,
    r.block,
    r.firstName,
    r.lastName,
    r.qid,
    r.question,
    r.answer,
    r.status,
    r.duration
  ]);
}

function extractModuleRecord_(p, r) {
  let payload = null;
  const raw = first_(p.answer, p.response, '');

  if (typeof raw === 'object' && raw !== null) {
    payload = raw;
  } else if (typeof raw === 'string' && raw.trim().charAt(0) === '{') {
    try { payload = JSON.parse(raw); } catch (err) {}
  }

  if (!payload || !payload.moduleId) return null;

  const sessionId = first_(payload.sessionId, p.sessionId, '');

  return {
    timestamp: safeDate_(first_(p.timestamp, payload.timestamp, '')) || new Date(),
    firstName: first_(r.firstName, payload.firstName, ''),
    lastName: first_(r.lastName, payload.lastName, ''),
    classPeriod: first_(r.block, payload.classPeriod, deriveBlock_(r.cls), ''),
    moduleId: first_(payload.moduleId, r.qid, ''),
    moduleTitle: first_(payload.moduleTitle, r.question, ''),
    category: first_(payload.category, categoryFromClass_(r.cls), ''),
    topic: first_(payload.topic, ''),
    productType: first_(payload.productType, 'Interactive Module'),
    moduleSize: first_(payload.moduleSize, ''),
    score: cleanNumber_(payload.score),
    totalQuestions: cleanNumber_(payload.totalQuestions),
    percent: first_(payload.percent, percentFrom_(payload.score, payload.totalQuestions)),
    completed: first_(payload.completed, 'Yes'),
    questionTypes: first_(payload.questionTypes, ''),
    answers: first_(payload.answers, raw, ''),
    timeStarted: first_(payload.timeStarted, ''),
    timeFinished: first_(payload.timeFinished, ''),
    totalTime: first_(payload.totalTime, r.duration ? r.duration + ' minutes' : ''),
    reflection: first_(payload.reflection, ''),
    version: first_(payload.version, ''),
    teacherEmail: first_(payload.teacherEmail, ''),
    sessionId: sessionId,
    attempts: first_(payload.attempts, ''),
    pointsEarned: first_(payload.pointsEarned, payload.score, ''),
    notes: first_(payload.notes, r.qid, '')
  };
}

function appendModuleRecord_(ss, sheetName, m) {
  const sheet = getOrCreateSheet_(ss, sheetName, MODULE_HEADERS);

  if (m.sessionId && hasSessionId_(sheet, m.sessionId)) {
    return;
  }

  sheet.appendRow([
    m.timestamp,
    m.firstName,
    m.lastName,
    m.classPeriod,
    m.moduleId,
    m.moduleTitle,
    m.category,
    m.topic,
    m.productType,
    m.moduleSize,
    m.score,
    m.totalQuestions,
    m.percent,
    m.completed,
    m.questionTypes,
    m.answers,
    m.timeStarted,
    m.timeFinished,
    m.totalTime,
    m.reflection,
    m.version,
    m.teacherEmail,
    m.sessionId,
    m.attempts,
    m.pointsEarned,
    m.notes
  ]);
}

function moduleSheetName_(m) {
  const id = String(m.moduleId || '').toLowerCase();
  const title = String(m.moduleTitle || '').trim();

  const map = {
    'marketing-basics-intro': 'Basics of Marketing',
    'marketing-cafe-customer-strategy': 'Marketing Cafe',
    'pfm-your-first-paycheck': 'Your First Paycheck',
    'ap-business-unit-1': 'AP Business Unit 1'
  };

  if (map[id]) return map[id];

  return sanitizeSheetName_(title || m.moduleId || 'Module Responses');
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  return sheet;
}

function hasSessionId_(sheet, sessionId) {
  if (!sessionId || sheet.getLastRow() < 2) return false;
  const sessionColumn = 23;
  const values = sheet.getRange(2, sessionColumn, sheet.getLastRow() - 1, 1).getDisplayValues();
  return values.some(function(row){ return String(row[0]) === String(sessionId); });
}

function sanitizeSheetName_(name) {
  let s = String(name || 'Module Responses')
    .replace(/[\\\/\?\*\[\]\:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) s = 'Module Responses';
  return s.substring(0, 90);
}

function deriveBlock_(cls) {
  const m = String(cls || '').match(/(?:block|period|marketing)\s*-?\s*(\d+)/i);
  return m ? m[1] : '';
}

function categoryFromClass_(cls) {
  const s = String(cls || '').toLowerCase();
  if (s.indexOf('marketing') > -1) return 'Marketing';
  if (s.indexOf('personal') > -1 || s.indexOf('pfm') > -1) return 'Personal Finance';
  if (s.indexOf('ap business') > -1) return 'AP Business';
  if (s.indexOf('business 101') > -1) return 'Business 101';
  return '';
}

function safeDate_(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function cleanNumber_(value) {
  if (value === null || value === undefined || value === '') return '';
  const n = Number(String(value).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? value : n;
}

function percentFrom_(score, total) {
  const s = Number(score), t = Number(total);
  if (!isFinite(s) || !isFinite(t) || t <= 0) return '';
  return Math.round((s / t) * 100) + '%';
}

function first_() {
  for (let i = 0; i < arguments.length; i++) {
    const v = arguments[i];
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return '';
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
