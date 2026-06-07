/*
============================================================
VIVID LESSONS MODULE LIBRARY
============================================================

This is the master catalog for real Vivid Lessons interactive modules.

Add each real module here one time.

Each paid module should have:
- previewUrl = limited public preview
- fullModuleUrl = full student module
- launchUrl = teacher dashboard / access page
- shopifyUrl = purchase page

Use categories to control where it appears.

Category options:
- personal-finance
- ap-business
- business-basics
- marketing
- current-events
- projects
- worksheets
- free
*/

const VIVID_MODULES = [
  {
    id: "pfm-credit-scores-101",
    title: "Credit Scores 101",
    displayType: "Interactive Lesson",

    categories: ["personal-finance", "business-basics"],
    courseLabels: ["Personal Finance", "Business Basics"],

    topic: "Credit",
    productType: "Interactive Module",

    description:
      "Students learn what affects a credit score and practice identifying smart credit behaviors through scenarios, matching, sorting, calculation, reflection, and a completion certificate.",

    questionCount: 9,
    previewQuestionCount: 2,

    types: ["Scenario-Based", "Matching", "Calculator"],
    tags: ["Credit", "Credit Cards", "Loans", "Financial Decisions"],

    previewUrl: "modules/pfm-credit-scores-101-preview.html",
    fullModuleUrl: "modules/pfm-credit-scores-101.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-CREDIT-SCORES-MODULE-LINK.com",

    price: "$12",
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
  }
];

function getModulesByCategory(category){
  return VIVID_MODULES
    .filter(module => category === "all" || module.categories.includes(category))
    .sort((a,b) => {
      const aOrder = a.order?.[category] ?? a.order?.all ?? 999;
      const bOrder = b.order?.[category] ?? b.order?.all ?? 999;
      return aOrder - bOrder;
    });
}

function getModuleById(id){
  return VIVID_MODULES.find(module => module.id === id);
}
