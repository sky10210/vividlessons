/*
============================================================
VIVID LESSONS MODULE METADATA TEMPLATE
============================================================

Use this metadata block at the top of every Vivid Lessons module.

This data should match:
- homepage product cards
- category pages
- teacher dashboard
- Shopify product descriptions
- completion tracking
- future standards/state alignment

Do not make question counts random.
questionCount must match the actual number of scored questions.

Reflection is always required, but should not count as a scored question
unless it is intentionally graded.

Difficulty must use only:
- Intro
- Standard
- Advanced

Question type tags should use consistent wording:
- Multiple Choice Heavy
- Scenario-Based
- Matching
- Sorting
- Word Bank
- Calculator
- Vocabulary Practice
- Case Study
- Current Events
- Project-Based
- Short Response
*/

const MODULE_META = {
  id: "category-module-name",
  title: "Module Title",
  category: "Personal Finance",
  topic: "Topic Name",
  productType: "Interactive Module",

  shortDescription: "One clear sentence explaining what students learn and do in this module.",

  questionCount: 0,
  sectionCount: 0,

  primaryQuestionTypes: [
    "Scenario-Based",
    "Multiple Choice Heavy"
  ],

  difficulty: "Intro",

  tags: [
    "Tag 1",
    "Tag 2",
    "Tag 3"
  ],

  reflectionRequired: true,
  certificateIncluded: true,
  completionTracking: true,
  autoScored: true,

  previewUrl: "sample-module.html",
  launchUrl: "teacher-dashboard.html",
  shopifyUrl: "https://YOUR-SHOPIFY-LINK-HERE.com",

  sections: [
    "Section 1 title",
    "Section 2 title",
    "Section 3 title",
    "Reflection and certificate"
  ],

  teacherTools: [
    "Launch from dashboard",
    "Copy student link",
    "Display QR code",
    "View completions",
    "Review student reflection"
  ],

  standards: {
    national: [],
    state: [],
    notes: ""
  },

  statePackReady: false,

  completionFields: [
    "Timestamp",
    "First Name",
    "Last Name",
    "Class Period",
    "Module ID",
    "Module Title",
    "Category",
    "Score",
    "Total Questions",
    "Percent",
    "Completed",
    "Question Types",
    "Answers",
    "Time Started",
    "Time Finished",
    "Total Time",
    "Reflection"
  ],

  lastUpdated: "2026-06-06",
  version: "1.0"
};
