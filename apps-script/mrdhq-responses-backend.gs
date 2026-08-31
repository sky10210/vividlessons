// MRDHQ Unified Response Backend v2026.08.31
// Opening Bells + Discussions + Current Events + Vivid Lessons Modules
// Audited routing: class-isolated bells, module master + per-module tabs, explicit total scores
// Attach this script to: MRDHQ Opening Bell Responses 2026-27
// Deploy as Web App: Execute as Me | Who has access: Anyone

function doGet(e) { return handleRequest_(e); }
function doPost(e) { return handleRequest_(e); }

function requestParams_(e) {
  var p = {};
  var key;

  if (e && e.parameter) {
    for (key in e.parameter) {
      if (Object.prototype.hasOwnProperty.call(e.parameter, key)) {
        p[key] = e.parameter[key];
      }
    }
  }

  // Support JSON POST bodies as well as the existing query/form submissions.
  try {
    if (e && e.postData && e.postData.contents) {
      var type = String(e.postData.type || '').toLowerCase();
      if (type.indexOf('application/json') >= 0) {
        var body = JSON.parse(e.postData.contents || '{}');
        for (key in body) {
          if (Object.prototype.hasOwnProperty.call(body, key)) {
            p[key] = body[key];
          }
        }
      }
    }
  } catch (err) {
    // Keep query/form parameters if a malformed JSON body is received.
  }

  return p;
}

function handleRequest_(e) {
  try {
    var p = requestParams_(e);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = clean_(p.action || '');

    if (action.indexOf('openingBell') === 0) {
      return handleOpeningBell_(ss, p, action);
    }

    if (action === 'moduleSubmit') {
      return handleModuleSubmit_(ss, p);
    }

    if (action.indexOf('discussion') === 0) {
      return handleDiscussion_(ss, p, action);
    }

    // Vivid Lessons modules currently use both authenticated action=moduleSubmit
    // and legacy/no-cors GET submissions. Detect the latter automatically so
    // every completed module is routed into Modules + its own module tab.
    if (looksLikeModuleSubmission_(p)) {
      return handleLegacyModuleSubmit_(ss, p);
    }

    var master = getOrCreateResponseSheet_(ss, 'Responses');
    var ts = parseTimestamp_(p.timestamp);
    var className = normalizeClass_(clean_(p.cls || p.className || ''));
    var block = clean_(p.block || p.period || '');
    var firstName = clean_(p.firstName || p.first || '');
    var lastName = clean_(p.lastName || p.last || '');

    if ((!firstName || !lastName) && (p.name || p.student)) {
      var legacy = clean_(p.name || p.student).split(/\s+/);
      if (!firstName) firstName = legacy.shift() || '';
      if (!lastName) lastName = legacy.join(' ');
    }

    var bellId = clean_(p.qid || (p.bellId ? 'BELL-' + p.bellId : ''));
    var question = clean_(p.question || p.label || '');
    var answer = clean_(p.answer || p.response || '');
    var duration = clean_(p.duration || '');
    var status = normalizeStatus_(p);

    master.appendRow([
      ts,
      formatDate_(ts),
      className,
      block,
      firstName,
      lastName,
      bellId,
      question,
      answer,
      status,
      duration
        ? duration + (
            String(duration).toLowerCase().indexOf('min') >= 0
              ? ''
              : ' min'
          )
        : ''
    ]);

    ensureClassView_(ss, className);

    return json_({
      success: true,
      status: status
    });

  } catch (err) {
    return json_({
      success: false,
      error: String(err)
    });
  }
}

/* ==========================================================
   DISCUSSIONS + CURRENT EVENTS
   ========================================================== */

function handleDiscussion_(ss,p,action){
  var sh=getOrCreateDiscussionSheet_(ss);
  var cls=normalizeClass_(clean_(p.className||p.cls||''));

  if(
    ['AP Business','Marketing','Business 101','Personal Finance']
      .indexOf(cls)===-1
  ){
    return json_({
      success:false,
      error:'Invalid class'
    });
  }

  if(action==='discussionList'){
    return discussionList_(
      sh,
      cls,
      clean_(p.block||''),
      clean_(p.discussionId||''),
      clean_(p.prompt||'')
    );
  }

  if(action==='discussionPost'){
    return discussionPost_(ss,sh,cls,p);
  }

  if(action==='discussionReply'){
    return discussionReply_(ss,sh,cls,p);
  }

  if(action==='discussionAgree'){
    return discussionAgree_(sh,cls,clean_(p.id||''));
  }

  return json_({
    success:false,
    error:'Unknown discussion action'
  });
}

function getOrCreateDiscussionSheet_(ss){
  var sh=ss.getSheetByName('Discussion');
  if(!sh){
    sh=ss.insertSheet('Discussion');
    sh.appendRow([
      'Timestamp','ID','Parent ID','Class','Block','First Name','Last Name',
      'Public Name','Stance','Prompt','Response','Agrees','Hidden','Discussion ID'
    ]);
    sh.setFrozenRows(1);
  }
  if(clean_(sh.getRange(1,14).getValue())!=='Discussion ID'){
    sh.getRange(1,14).setValue('Discussion ID');
  }
  return sh;
}

function discussionArchiveHeaders_(){
  return [
    'Timestamp','ID','Parent ID','Class','Block','First Name','Last Name',
    'Public Name','Stance','Prompt','Response','Agrees','Hidden','Discussion ID',
    'Activity Type','Activity Tab'
  ];
}

function getOrCreateDiscussionArchive_(ss,name){
  var headers=discussionArchiveHeaders_();
  var sh=ss.getSheetByName(name);
  if(!sh){
    sh=ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  } else {
    sh.getRange(1,1,1,headers.length).setValues([headers]);
  }
  return sh;
}

function discussionType_(discussionId){
  var id=clean_(discussionId).toLowerCase();
  return (
    id.indexOf('current-')===0 ||
    id.indexOf('ce-')===0
  ) ? 'Current Event' : 'Discussion';
}

function titleCaseWords_(value){
  return clean_(value)
    .split(/\s+/)
    .map(function(w){
      return w ? String(w).charAt(0).toUpperCase()+String(w).slice(1) : '';
    })
    .join(' ');
}

function discussionActivityName_(cls,discussionId,type){
  var id=clean_(discussionId||'default');
  var label=id
    .replace(/^current-/i,'')
    .replace(/^ce-/i,'')
    .replace(/^discussion-/i,'')
    .replace(/-20\d\d-\d\d-\d\d$/,'')
    .replace(/[-_]+/g,' ')
    .trim();
  if(!label || label.toLowerCase()==='default') label='Default';
  label=titleCaseWords_(label);
  var prefix=type==='Current Event' ? 'CE' : 'Discussion';
  return (prefix+' - '+label+' - '+cls)
    .replace(/[\\\/?*\[\]:]/g,'-')
    .replace(/\s+/g,' ')
    .trim()
    .substring(0,99);
}

function getOrCreateDiscussionActivitySheet_(ss,cls,discussionId,type){
  var name=discussionActivityName_(cls,discussionId,type);
  var headers=discussionArchiveHeaders_();
  var sh=ss.getSheetByName(name);
  if(!sh){
    sh=ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  } else {
    sh.getRange(1,1,1,headers.length).setValues([headers]);
  }
  return sh;
}

function archiveDiscussionRow_(ss,row,cls,discussionId){
  var type=discussionType_(discussionId);
  var activity=getOrCreateDiscussionActivitySheet_(ss,cls,discussionId,type);
  var master=getOrCreateDiscussionArchive_(
    ss,
    type==='Current Event' ? 'Current Event Submissions' : 'Discussion Submissions'
  );
  var archiveRow=row.slice(0,14).concat([type,activity.getName()]);
  master.appendRow(archiveRow);
  activity.appendRow(archiveRow);
  return {type:type,tab:activity.getName()};
}

function findDiscussionParent_(sh,id,cls){
  var vals=sh.getDataRange().getValues();
  for(var i=vals.length-1;i>0;i--){
    if(String(vals[i][1])===id && String(vals[i][3])===cls && !vals[i][2]){
      return vals[i];
    }
  }
  return null;
}

function discussionPost_(ss,sh,cls,p){
  var first=clean_(p.firstName||'');
  var last=clean_(p.lastName||'');
  var block=clean_(p.block||'');
  var response=clean_(p.response||'');
  if(!first || !last || !block || !response){
    return json_({success:false,error:'Missing required fields'});
  }
  if(response.length>1500) response=response.substring(0,1500);
  var id=Utilities.getUuid();
  var display=first+' '+last.charAt(0).toUpperCase()+'.';
  var discussionId=clean_(p.discussionId||'default');
  var now=new Date();
  var row=[
    now,id,'',cls,block,first,last,display,clean_(p.stance||''),
    clean_(p.prompt||''),response,0,false,discussionId
  ];
  sh.appendRow(row);
  var archived=archiveDiscussionRow_(ss,row,cls,discussionId);
  return json_({success:true,id:id,activityType:archived.type,tab:archived.tab});
}

function discussionReply_(ss,sh,cls,p){
  var first=clean_(p.firstName||'');
  var last=clean_(p.lastName||'');
  var block=clean_(p.block||'');
  var response=clean_(p.response||'');
  var parent=clean_(p.parentId||'');
  if(!first || !last || !block || !response || !parent){
    return json_({success:false,error:'Missing required fields'});
  }
  if(response.length>1000) response=response.substring(0,1000);
  var parentRow=findDiscussionParent_(sh,parent,cls);
  if(!parentRow){
    return json_({success:false,error:'Parent post not found'});
  }
  var discussionId=clean_(parentRow[13]||'default');
  var prompt=clean_(parentRow[9]||'');
  var id=Utilities.getUuid();
  var display=first+' '+last.charAt(0).toUpperCase()+'.';
  var now=new Date();
  var row=[
    now,id,parent,cls,block,first,last,display,'',prompt,response,0,false,discussionId
  ];
  sh.appendRow(row);
  var archived=archiveDiscussionRow_(ss,row,cls,discussionId);
  return json_({success:true,id:id,activityType:archived.type,tab:archived.tab});
}

function discussionAgree_(sh,cls,id){
  if(!id) return json_({success:false,error:'Missing post ID'});
  var lock=LockService.getScriptLock();
  lock.waitLock(5000);
  try{
    var vals=sh.getDataRange().getValues();
    for(var i=1;i<vals.length;i++){
      if(String(vals[i][1])===id && vals[i][3]===cls && !vals[i][2]){
        var n=Number(vals[i][11]||0)+1;
        sh.getRange(i+1,12).setValue(n);
        return json_({success:true,agrees:n});
      }
    }
    return json_({success:false,error:'Post not found'});
  } finally {
    lock.releaseLock();
  }
}

function discussionList_(sh,cls,block,discussionId,prompt){
  var vals=sh.getDataRange().getValues();
  var parents=[];
  var replies={};
  for(var i=1;i<vals.length;i++){
    var r=vals[i];
    if(r[3]!==cls || String(r[12]).toLowerCase()==='true') continue;
    var obj={
      id:String(r[1]),
      parentId:String(r[2]||''),
      block:String(r[4]),
      displayName:String(r[7]),
      stance:String(r[8]||''),
      prompt:String(r[9]||''),
      response:String(r[10]||''),
      agrees:Number(r[11]||0),
      discussionId:String(r[13]||''),
      time:Utilities.formatDate(
        new Date(r[0]),
        Session.getScriptTimeZone()||'America/New_York',
        'MMM d, h:mm a'
      )
    };
    if(obj.parentId){
      if(!replies[obj.parentId]) replies[obj.parentId]=[];
      replies[obj.parentId].push(obj);
    } else {
      var discussionMatch=
        !discussionId ||
        obj.discussionId===discussionId ||
        (!obj.discussionId && prompt && obj.prompt===prompt);
      if(discussionMatch && (!block || obj.block===block)) parents.push(obj);
    }
  }
  parents.reverse();
  parents.forEach(function(x){x.replies=(replies[x.id]||[]).slice(-20);});
  return json_({success:true,posts:parents.slice(0,100)});
}

/* ==========================================================
   GENERAL UTILITIES
   ========================================================== */

function normalizeClass_(value) {
  var v = clean_(value);
  var low = v.toLowerCase();

  if (low === 'personal financial management' || low === 'personal finance' || low === 'pfm') {
    return 'Personal Finance';
  }
  if (low === 'marketing fundamentals' || low === 'marketing') {
    return 'Marketing';
  }
  if (low === 'ap business with personal finance' || low === 'ap business') {
    return 'AP Business';
  }
  if (low === 'business 101' || low === 'business101') {
    return 'Business 101';
  }
  return v;
}

function normalizeStatus_(p) {
  var raw=String(p.status||'').trim().toLowerCase();
  var label=String(p.label||'').trim().toLowerCase();
  var makeup=String(p.makeup||'')==='1' || raw.indexOf('makeup')>=0 || label==='makeup';
  var late=String(p.late||'')==='1' || raw.indexOf('late')>=0;
  if(makeup) return 'Makeup — After Class/Absent';
  if(late) return 'Late — Same Day';
  return 'On Time';
}

function getOrCreateResponseSheet_(ss,name){
  var sh=ss.getSheetByName(name);
  if(!sh){
    sh=ss.insertSheet(name);
    sh.appendRow([
      'Timestamp','Date','Class','Block','First Name','Last Name',
      'Question ID','Question','Response','Status','Duration'
    ]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function ensureClassView_(ss,className){
  if(!className) return;
  var allowed=['AP Business','Marketing','Business 101','Personal Finance'];
  if(allowed.indexOf(className)===-1) return;
  var sh=ss.getSheetByName(className);
  if(!sh) return;
}

function parseTimestamp_(value){
  if(!value) return new Date();
  var d=new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}

function formatDate_(d){
  return Utilities.formatDate(
    d,
    Session.getScriptTimeZone()||'America/New_York',
    'M/d/yyyy'
  );
}

function clean_(v){
  return v==null ? '' : String(v).trim();
}

function json_(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ==========================================================
   UNIVERSAL MODULE ROUTING + GRADEBOOK DATA
   ========================================================== */

function parseModuleRecord_(p) {
  var raw = p && p.answer != null ? p.answer : (p && p.response != null ? p.response : '');
  if (typeof raw === 'object' && raw !== null) {
    return { raw: JSON.stringify(raw), record: raw };
  }
  raw = clean_(raw);
  if (!raw || raw.charAt(0) !== '{') return null;
  try {
    var record = JSON.parse(raw);
    return { raw: raw, record: record };
  } catch (err) {
    return null;
  }
}

function looksLikeModuleSubmission_(p) {
  var parsed = parseModuleRecord_(p);
  if (!parsed) return false;
  var r = parsed.record || {};
  return !!(
    r.moduleId || r.moduleTitle || r.productType === 'Interactive Module' ||
    String(r.completed || '').toLowerCase() === 'yes'
  );
}

function inferModuleNumber_(record, p) {
  var explicit = clean_((p && p.moduleNumber) || record.moduleNumber || '');
  if (explicit) return explicit;
  var hay = (
    clean_(record.moduleId || '') + ' ' +
    clean_(record.moduleTitle || '') + ' ' +
    clean_((p && (p.qid || p.bellId || p.label)) || '')
  ).toLowerCase();
  var match = hay.match(/\bmodule[\s_-]*(\d+)\b/);
  if (match) return match[1];
  if (hay.indexOf('marketing-basics') >= 0 || hay.indexOf('basics of marketing') >= 0) return '1';
  if (hay.indexOf('marketing-cafe') >= 0 || hay.indexOf('build a cafe') >= 0 || hay.indexOf('common ground') >= 0) return '2';
  return '';
}

function moduleDisplayName_(record, p) {
  return clean_(record.moduleTitle || (p && (p.label || p.question)) || record.moduleId || 'Interactive Module');
}

function moduleTabName_(record, p, className) {
  var moduleNumber = inferModuleNumber_(record, p);
  var title = moduleDisplayName_(record, p)
    .replace(/^AP Business\s+Module\s+\d+\s*[—-]?\s*/i, '')
    .replace(/^Business 101\s*/i, '')
    .replace(/\s+Interactive Lesson\.?$/i, '')
    .trim();
  var moduleId = clean_(record.moduleId || '').toLowerCase();
  if (moduleId === 'marketing-basics-intro') title = 'Basics of Marketing';
  if (moduleId === 'marketing-cafe-customer-strategy') title = 'Marketing Cafe';
  var prefix = moduleNumber ? ('Module ' + moduleNumber + ' - ') : 'Module - ';
  return safeSheetName_(prefix + title + ' - ' + className, 99);
}

function moduleHeaders_() {
  return [
    'Timestamp','Date','Class','Block','First Name','Last Name','Google Name','School Email',
    'Module Number','Module ID','Module Title','Score','Total','Percent','Total Score',
    'Duration','Reflection','Session ID','Completed','Full Record'
  ];
}

function getOrCreateSheetWithHeaders_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  } else if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function moduleSessionExists_(sh, sessionId) {
  if (!sessionId || !sh || sh.getLastRow() < 2) return false;
  var values = sh.getDataRange().getValues();
  for (var i = values.length - 1; i > 0; i--) {
    if (String(values[i][17] || '') === sessionId) return true;
  }
  return false;
}

function percentValue_(record) {
  var score = Number(record.score || 0);
  var total = Number(record.totalQuestions || record.total || 0);
  var raw = clean_(record.percent || '');
  if (raw) return raw.indexOf('%') >= 0 ? raw : raw + '%';
  return total > 0 ? Math.round((score / total) * 100) + '%' : '';
}

function saveModuleSubmission_(ss, context) {
  var record = context.record || {};
  var p = context.p || {};
  var raw = context.raw || JSON.stringify(record);
  var ts = context.ts || parseTimestamp_(p.timestamp);
  var className = normalizeClass_(context.className || p.cls || p.className || record.category || '');
  var block = clean_(context.block || p.block || p.period || record.classPeriod || '');
  var firstName = clean_(context.firstName || p.firstName || p.first || record.firstName || '');
  var lastName = clean_(context.lastName || p.lastName || p.last || record.lastName || '');
  var googleName = clean_(context.googleName || '');
  var schoolEmail = clean_(context.schoolEmail || '');
  var sessionId = clean_(record.sessionId || p.sessionId || '');
  var moduleNumber = inferModuleNumber_(record, p);
  var moduleId = clean_(record.moduleId || p.moduleId || '');
  var moduleTitle = moduleDisplayName_(record, p);
  var score = Number(record.score || 0);
  var total = Number(record.totalQuestions || record.total || 0);
  var percent = percentValue_(record);
  var totalScore = total > 0 ? (score + ' / ' + total) : String(score);
  var duration = clean_(record.totalTime || p.duration || '');
  var reflection = clean_(record.reflection || '');
  var completed = clean_(record.completed || 'Yes') || 'Yes';

  var master = getOrCreateSheetWithHeaders_(ss, 'Modules', moduleHeaders_());
  if (moduleSessionExists_(master, sessionId)) {
    return {success:false,duplicate:true,error:'This completion was already submitted.'};
  }

  var row = [
    ts,formatDate_(ts),className,block,firstName,lastName,googleName,schoolEmail,
    moduleNumber,moduleId,moduleTitle,score,total,percent,totalScore,duration,reflection,
    sessionId,completed,raw
  ];
  master.appendRow(row);

  var tabName = moduleTabName_(record, p, className || 'Class');
  var moduleSheet = getOrCreateSheetWithHeaders_(ss, tabName, moduleHeaders_());
  moduleSheet.appendRow(row);

  var responses = getOrCreateResponseSheet_(ss, 'Responses');
  responses.appendRow([
    ts,
    formatDate_(ts),
    className,
    block,
    firstName,
    lastName,
    moduleNumber ? ('MODULE-' + moduleNumber) : ('MODULE-' + (moduleId || 'COMPLETE')),
    moduleTitle,
    totalScore + (percent ? ' (' + percent + ')' : ''),
    'On Time',
    duration
  ]);

  return {
    success:true,
    tab:tabName,
    moduleNumber:moduleNumber,
    score:score,
    total:total,
    percent:percent,
    totalScore:totalScore
  };
}

function handleLegacyModuleSubmit_(ss, p) {
  var parsed = parseModuleRecord_(p);
  if (!parsed) return json_({success:false,error:'Invalid module submission.'});
  var record = parsed.record || {};
  if (record.completed && String(record.completed).toLowerCase() !== 'yes') {
    return json_({success:false,error:'Complete the module before submitting.'});
  }
  var firstName = clean_(p.firstName || p.first || record.firstName || '');
  var lastName = clean_(p.lastName || p.last || record.lastName || '');
  if ((!firstName || !lastName) && (p.name || p.student)) {
    var parts = clean_(p.name || p.student).split(/\s+/);
    if (!firstName) firstName = parts.shift() || '';
    if (!lastName) lastName = parts.join(' ');
  }
  if (!firstName || !lastName) return json_({success:false,error:'Enter first and last name.'});
  var result = saveModuleSubmission_(ss, {
    p:p,
    raw:parsed.raw,
    record:record,
    className:normalizeClass_(clean_(p.cls || p.className || record.category || '')),
    block:clean_(p.block || p.period || record.classPeriod || ''),
    firstName:firstName,
    lastName:lastName,
    ts:parseTimestamp_(p.timestamp)
  });
  return json_(result);
}

function safeSheetName_(value, maxLength) {
  return clean_(value)
    .replace(/[\\\/?*\[\]:]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLength || 99);
}

/* ==========================================================
   GOOGLE-AUTHENTICATED VIVID LESSONS MODULE SUBMISSIONS
   ========================================================== */

function handleModuleSubmit_(ss,p){
  var manual = String(p.manualEntry || '') === '1';
  var identity = manual ? null : verifyFirebaseUser_(clean_(p.idToken || ''));
  if (!manual && !identity) {
    return json_({success:false,error:'Sign in with your school Google account first.'});
  }
  if (!manual && identity.email.slice(-16) !== '@casdonline.org') {
    return json_({success:false,error:'Use your casdonline.org school account.'});
  }
  if (manual) {
    if (!clean_(p.firstName || '') || !clean_(p.lastName || '')) {
      return json_({success:false,error:'Enter first and last name.'});
    }
    identity = {email:'',name:'Manual entry'};
  }
  var parsed = parseModuleRecord_(p);
  if (!parsed) return json_({success:false,error:'Invalid module submission.'});
  var record = parsed.record || {};
  if (String(record.completed || '').toLowerCase() !== 'yes') {
    return json_({success:false,error:'Complete the module before submitting.'});
  }
  var className = normalizeClass_(clean_(p.cls || record.category || 'Business 101'));
  var block = clean_(p.block || record.classPeriod || '');
  if (['1','2','3','4'].indexOf(block) === -1) {
    return json_({success:false,error:'Choose Block 1, 2, 3, or 4.'});
  }
  var names = manual
    ? {first:clean_(p.firstName || ''),last:clean_(p.lastName || '')}
    : rosterIdentity_(ss, identity);
  var result = saveModuleSubmission_(ss, {
    p:p,
    raw:parsed.raw,
    record:record,
    className:className,
    block:block,
    firstName:names.first,
    lastName:names.last,
    googleName:manual ? 'Manual entry' : identity.name,
    schoolEmail:manual ? '' : identity.email,
    ts:parseTimestamp_(p.timestamp)
  });
  return json_(result);
}

/* ==========================================================
   UNIVERSAL AUTHENTICATED OPENING BELL
   ========================================================== */

var FIREBASE_WEB_API_KEY_ = 'AIzaSyA_R--xQW8CdgbI1HGx5oxbqljHBGCujhY';
var OPENING_BELL_TEACHER_ = 'skyler.dipasquale@casdonline.org';

function handleOpeningBell_(ss,p,action){
  var identity=verifyFirebaseUser_(clean_(p.idToken||''));
  if(!identity){
    return json_({success:false,error:'Sign in with your school Google account first.'});
  }
  if(action==='openingBellStart') return openingBellStart_(ss,p,identity);
  if(action==='openingBellGet') return openingBellGet_(ss,clean_(p.code||''));
  if(action==='openingBellList') return openingBellList_(ss,clean_(p.className||''));
  if(action==='openingBellSubmit') return openingBellSubmit_(ss,p,identity);
  return json_({success:false,error:'Unknown Opening Bell action.'});
}

function verifyFirebaseUser_(idToken){
  if(!idToken) return null;
  try{
    var url='https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='+encodeURIComponent(FIREBASE_WEB_API_KEY_);
    var response=UrlFetchApp.fetch(url,{
      method:'post',
      contentType:'application/json',
      payload:JSON.stringify({idToken:idToken}),
      muteHttpExceptions:true
    });
    if(response.getResponseCode()!==200) return null;
    var data=JSON.parse(response.getContentText()||'{}');
    var u=data.users && data.users[0];
    if(!u || !u.email) return null;
    return {
      uid:String(u.localId||''),
      email:String(u.email||'').toLowerCase(),
      name:String(u.displayName||'Student')
    };
  } catch(err){
    return null;
  }
}

function openingBellSessions_(ss){
  var headers=[
    'Created At','Code','Title','Class','Block','Question','Duration Seconds',
    'Starts At','Ends At','Teacher Email','Resources JSON','Submission Tab','Active'
  ];
  var sh=ss.getSheetByName('Opening Bell Sessions');
  if(!sh){
    sh=ss.insertSheet('Opening Bell Sessions');
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  } else {
    sh.getRange(1,1,1,headers.length).setValues([headers]);
  }
  return sh;
}

function openingBellSubmissions_(ss){
  var headers=[
    'Timestamp','Date','Title','Class','Block','Question','Gradebook First Name',
    'Gradebook Last Name','Google Name','School Email','Firebase UID','Response',
    'Status','Session Code','Submission Tab'
  ];
  var sh=ss.getSheetByName('Opening Bell Submissions');
  if(!sh){
    sh=ss.insertSheet('Opening Bell Submissions');
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  } else {
    sh.getRange(1,1,1,headers.length).setValues([headers]);
  }
  return sh;
}

function parseResources_(raw){
  if(!raw) return [];
  return String(raw)
    .split(/\r?\n/)
    .map(function(line,index){
      line=clean_(line);
      if(!line) return null;
      var split=line.indexOf('|');
      var label=split>=0 ? clean_(line.substring(0,split)) : 'Attachment '+(index+1);
      var url=clean_(split>=0 ? line.substring(split+1) : line);
      if(!/^https?:\/\//i.test(url)) return null;
      return {label:label||'Attachment '+(index+1),url:url};
    })
    .filter(function(x){return x;})
    .slice(0,6);
}

function uniqueSessionSheet_(ss,title,className,block){
  var base=(
    'Opening Bell - '+title+' - '+className+' - B'+block
  )
    .replace(/[\\\/?*\[\]:]/g,'-')
    .replace(/\s+/g,' ')
    .trim()
    .substring(0,95);
  var name=base;
  var n=2;
  while(ss.getSheetByName(name)){
    name=(base.substring(0,91)+' '+n).substring(0,99);
    n++;
  }
  var sh=ss.insertSheet(name);
  sh.appendRow([
    'Timestamp','Date','Title','Class','Block','Question','Gradebook First Name',
    'Gradebook Last Name','Google Name','School Email','Firebase UID','Response',
    'Status','Session Code'
  ]);
  sh.setFrozenRows(1);
  return name;
}

function openingBellStart_(ss,p,identity){
  if(identity.email!==OPENING_BELL_TEACHER_){
    return json_({success:false,error:'Teacher account required.'});
  }
  var title=clean_(p.title||'');
  var className=normalizeClass_(clean_(p.className||''));
  var block=clean_(p.block||'');
  var question=clean_(p.question||'');
  var duration=Math.max(60,Math.min(3600,Number(p.duration||420)));
  var allowed=['AP Business','Marketing','Business 101','Personal Finance'];
  if(!title || !question || !block || allowed.indexOf(className)===-1){
    return json_({success:false,error:'Complete every Opening Bell field.'});
  }
  var resources=parseResources_(p.resources||'');
  var sheetName=uniqueSessionSheet_(ss,title,className,block);
  var code=createOpeningBellCode_();
  var now=new Date();
  var ends=new Date(now.getTime()+duration*1000);
  openingBellSessions_(ss).appendRow([
    now,code,title,className,block,question,duration,now,ends,identity.email,
    JSON.stringify(resources),sheetName,true
  ]);
  return json_({
    success:true,
    session:{
      code:code,title:title,className:className,block:block,question:question,
      resources:resources,duration:duration,startsAt:now.getTime(),endsAt:ends.getTime()
    }
  });
}

function createOpeningBellCode_(){
  var chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var out='';
  for(var i=0;i<5;i++){
    out+=chars.charAt(Math.floor(Math.random()*chars.length));
  }
  return out;
}

function sessionFromRow_(r,rowNumber){
  var resources=[];
  try{resources=JSON.parse(String(r[10]||'[]'));}catch(e){}
  return {
    row:rowNumber,
    code:String(r[1]),
    title:String(r[2]),
    className:String(r[3]),
    block:String(r[4]),
    question:String(r[5]),
    duration:Number(r[6]),
    startsAt:new Date(r[7]).getTime(),
    endsAt:new Date(r[8]).getTime(),
    resources:resources,
    sheetName:String(r[11]||'')
  };
}

function findOpeningBell_(ss,code){
  if(!code) return null;
  var values=openingBellSessions_(ss).getDataRange().getValues();
  for(var i=values.length-1;i>0;i--){
    if(
      String(values[i][1]).toUpperCase()===String(code).toUpperCase() &&
      String(values[i][12]).toLowerCase()!=='false'
    ){
      return sessionFromRow_(values[i],i+1);
    }
  }
  return null;
}

function publicSession_(session){
  return {
    code:session.code,
    title:session.title,
    className:session.className,
    block:session.block,
    question:session.question,
    duration:session.duration,
    startsAt:session.startsAt,
    endsAt:session.endsAt,
    resources:session.resources,
    isLive:Date.now()<=session.endsAt,
    dateLabel:Utilities.formatDate(
      new Date(session.startsAt),
      Session.getScriptTimeZone()||'America/New_York',
      'MMM d, yyyy'
    )
  };
}

function openingBellGet_(ss,code){
  var session=findOpeningBell_(ss,code);
  if(!session) return json_({success:false,error:'That session code was not found.'});
  return json_({success:true,session:publicSession_(session)});
}

function openingBellList_(ss,className){
  className=normalizeClass_(className);
  var values=openingBellSessions_(ss).getDataRange().getValues();
  var sessions=[];
  for(var i=values.length-1;i>0 && sessions.length<50;i--){
    if(String(values[i][3])!==className || String(values[i][12]).toLowerCase()==='false') continue;
    sessions.push(publicSession_(sessionFromRow_(values[i],i+1)));
  }
  return json_({success:true,sessions:sessions});
}

function rosterIdentity_(ss,identity){
  var first='';
  var last='';
  var sh=ss.getSheetByName('Roster');
  if(sh){
    var values=sh.getDataRange().getValues();
    for(var i=1;i<values.length;i++){
      if(String(values[i][0]||'').trim().toLowerCase()===identity.email){
        first=clean_(values[i][1]||'');
        last=clean_(values[i][2]||'');
        break;
      }
    }
  }
  if(!first && !last){
    var parts=String(identity.name||'Student').trim().split(/\s+/);
    first=parts.shift()||'Student';
    last=parts.join(' ');
  }
  return {first:first,last:last};
}

function openingBellClassSheet_(ss, className) {
  var headers=[
    'Timestamp','Date','Title','Class','Block','Question','Gradebook First Name',
    'Gradebook Last Name','Google Name','School Email','Firebase UID','Response',
    'Status','Session Code','Submission Tab'
  ];
  var name = safeSheetName_('Opening Bell - ' + normalizeClass_(className),99);
  return getOrCreateSheetWithHeaders_(ss,name,headers);
}

function openingBellSubmit_(ss,p,identity){
  var session=findOpeningBell_(ss,clean_(p.code||''));
  if(!session){
    return json_({success:false,error:'Opening Bell session not found.'});
  }
  var answer=clean_(p.answer||'');
  if(answer.length<8){
    return json_({success:false,error:'Write a more complete response.'});
  }
  var master=openingBellSubmissions_(ss);
  var values=master.getDataRange().getValues();
  for(var i=values.length-1;i>0;i--){
    if(
      String(values[i][9]||'').toLowerCase()===identity.email &&
      String(values[i][13]||'').toUpperCase()===session.code
    ){
      return json_({success:false,error:'You already submitted this Opening Bell.'});
    }
  }
  var official=rosterIdentity_(ss,identity);
  var now=new Date();
  var status=Date.now()>session.endsAt ? 'Late' : 'On Time';
  var masterRow=[
    now,formatDate_(now),session.title,session.className,session.block,session.question,
    official.first,official.last,identity.name,identity.email,identity.uid,answer,status,
    session.code,session.sheetName
  ];
  master.appendRow(masterRow);
  openingBellClassSheet_(ss, session.className).appendRow(masterRow);
  var sessionSheet=ss.getSheetByName(session.sheetName);
  if(sessionSheet) sessionSheet.appendRow(masterRow.slice(0,14));
  return json_({success:true,status:status});
}
