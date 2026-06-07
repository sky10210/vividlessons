/*
============================================================
VIVID LESSONS MODULE LIBRARY
============================================================

This is the master catalog for real Vivid Lessons interactive modules.

Add each real module here one time.

Course category options:
- personal-finance
- ap-business
- business-basics
- marketing
- current-events
- projects
- worksheets
- free

Homepage sorting:
- homepage: true = show this module on homepage
- homepageOrder: optional manual override
- dateAdded: controls natural order
- Newer modules appear lower by default unless homepageOrder is set

Preview system:
- previewUrl = limited public preview
- fullModuleUrl = full student module
- teacherGuideUrl = teacher guide / answer key page
- launchUrl = teacher dashboard / access page
- shopifyUrl = purchase page
*/

const VIVID_MODULES = [
  {
    id: "pfm-credit-scores-101",
    title: "Credit Scores 101",
    displayType: "Interactive Lesson",
    moduleSize: "mini",

    categories: ["personal-finance", "business-basics"],
    courseLabels: ["Personal Finance", "Business Basics"],

    homepage: true,
    homepageOrder: null,
    dateAdded: "2026-06-07",
    homepageLabel: "New Module",

    topic: "Credit",
    productType: "Interactive Module",

    description:
      "Students learn what affects a credit score and practice identifying smart credit behaviors through scenarios, matching, sorting, calculation, reflection, and a completion certificate.",

    questionCount: 9,
    previewQuestionCount: 2,
    estimatedMinutes: "8–12",

    types: ["Scenario-Based", "Matching", "Calculator"],
    tags: ["Credit", "Credit Cards", "Loans", "Financial Decisions"],

    previewUrl: "modules/pfm-credit-scores-101-preview.html",
    fullModuleUrl: "modules/pfm-credit-scores-101.html",
    teacherGuideUrl: "teacher-guides/pfm-credit-scores-101-teacher-guide.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-CREDIT-SCORES-MODULE-LINK.com",

    price: "$9",
    priceLabel: "module",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: true,

    featured: true,

    order: {
      "personal-finance": 1,
      "business-basics": 4,
      "all": 1
    },

    sections: [
      "What a credit score is",
      "Why credit scores matter",
      "Payment history",
      "Credit utilization",
      "Credit cards and loans",
      "Matching credit factors",
      "Sorting smart credit steps",
      "Credit utilization calculation",
      "Final credit decision",
      "Required reflection and certificate"
    ]
  },
  {
    id: "pfm-financial-planning-goal-setting",
    title: "Financial Planning & Goal Setting",
    displayType: "Interactive Lesson",
    moduleSize: "standard",

    categories: ["personal-finance", "business-basics"],
    courseLabels: ["Personal Finance", "Business Basics"],

    homepage: true,
    homepageOrder: null,
    dateAdded: "2026-06-07",
    homepageLabel: "New Module",

    topic: "Financial Planning and Goal Setting",
    productType: "Interactive Module",

    description:
      "A grades 9–12 interactive personal finance module where students set financial goals, evaluate long-term financial impact, apply opportunity cost, compare realistic options, calculate monthly savings, and complete a reflection certificate.",

    questionCount: 15,
    previewQuestionCount: 3,
    estimatedMinutes: "10–15",

    types: ["Scenario-Based", "Matching", "Sorting", "Calculator"],
    tags: [
      "Financial Goals",
      "Financial Planning",
      "Opportunity Cost",
      "SMART Goals",
      "Decision-Making"
    ],

    previewUrl: "modules/pfm-financial-planning-goal-setting-preview.html",
    fullModuleUrl: "modules/pfm-financial-planning-goal-setting.html",
    teacherGuideUrl: "teacher-guides/pfm-financial-planning-goal-setting-teacher-guide.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://vividlessons.com/products/pfm-financial-planning-goal-setting",

    price: "$14",
    priceLabel: "module",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: true,

    featured: true,

    order: {
      "personal-finance": 3,
      "business-basics": 6,
      "all": 3
    },

    sections: [
      "Financial goals",
      "Goal timelines",
      "Long-term financial impact",
      "SMART goals",
      "Opportunity cost",
      "Systematic decision-making",
      "Matching planning terms",
      "Sorting goal planning steps",
      "Fixing weak goals",
      "Monthly savings calculation",
      "Comparing financial choices",
      "Real-world spending decision",
      "Goal, cost, and timeline review",
      "Final planning application",
      "Reflection and certificate"
    ]
  }
];

function getModulesByCategory(category) {
  if (category === "homepage") {
    return VIVID_MODULES
      .filter(module => module.homepage === true)
      .sort((a, b) => {
        const aManual = a.homepageOrder;
        const bManual = b.homepageOrder;

        if (
          aManual !== null &&
          aManual !== undefined &&
          bManual !== null &&
          bManual !== undefined
        ) {
          return aManual - bManual;
        }

        if (aManual !== null && aManual !== undefined) {
          return -1;
        }

        if (bManual !== null && bManual !== undefined) {
          return 1;
        }

        return new Date(a.dateAdded || "2099-01-01") - new Date(b.dateAdded || "2099-01-01");
      });
  }

  return VIVID_MODULES
    .filter(module => category === "all" || module.categories.includes(category))
    .sort((a, b) => {
      const aOrder = a.order?.[category] ?? a.order?.all ?? 999;
      const bOrder = b.order?.[category] ?? b.order?.all ?? 999;
      return aOrder - bOrder;
    });
}

function getModuleById(id) {
  return VIVID_MODULES.find(module => module.id === id);
}
