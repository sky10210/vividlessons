/*
============================================================
VIVID LESSONS MODULE LIBRARY
============================================================

This is the master catalog for all Vivid Lessons modules.

Every time you build a new module, add it here once.

A module can appear in multiple subject pages by adding multiple categories.

Example:
categories: ["personal-finance", "business-basics"]

Use order to control where it appears on each page.

Example:
order: {
  "personal-finance": 1,
  "business-basics": 4,
  "all": 1
}
*/

const VIVID_MODULES = [
  {
    id: "pfm-credit-scores-101",
    title: "Credit Scores 101",
    categories: ["personal-finance", "business-basics"],
    courseLabels: ["Personal Finance", "Business Basics"],
    topic: "Credit",
    productType: "Interactive Module",

    description:
      "Students learn what affects a credit score and practice identifying smart credit behaviors through scenarios, matching, sorting, calculation, reflection, and a completion certificate.",

    questionCount: 9,
    types: ["Scenario-Based", "Matching", "Calculator"],
    tags: ["Credit", "Credit Cards", "Loans", "Financial Decisions"],

    previewUrl: "modules/pfm-credit-scores-101.html",
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
  },

  {
    id: "sample-interactive-module",
    title: "Sample Interactive Module",
    categories: [
      "personal-finance",
      "ap-business",
      "business-basics",
      "marketing",
      "current-events",
      "projects",
      "free"
    ],
    courseLabels: ["Free Preview"],
    topic: "Sample",
    productType: "Free Preview",

    description:
      "Preview the Vivid Lessons format with guided progression, active checks, feedback, reflection, scoring, and a completion certificate.",

    questionCount: 7,
    types: ["Interactive", "Multiple Choice", "Reflection"],
    tags: ["Free", "Preview", "Student Module"],

    previewUrl: "sample-module.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-FREE-PREVIEW-LINK.com",

    price: "Free",
    priceLabel: "preview",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: true,

    featured: false,

    order: {
      "personal-finance": 99,
      "ap-business": 99,
      "business-basics": 99,
      "marketing": 99,
      "current-events": 99,
      "projects": 99,
      "free": 1,
      "all": 99
    },

    sections: [
      "Student start form",
      "Locked module sections",
      "Multiple choice check",
      "Word bank activity",
      "Matching activity",
      "Sorting activity",
      "Calculation scenario",
      "Required reflection and certificate"
    ]
  },

  {
    id: "pfm-budgeting-basics",
    title: "Budgeting Basics",
    categories: ["personal-finance", "business-basics"],
    courseLabels: ["Personal Finance", "Business Basics"],
    topic: "Budgeting",
    productType: "Interactive Module",

    description:
      "Students build spending plans, compare needs and wants, make trade-offs, and practice real-world budgeting choices.",

    questionCount: 9,
    types: ["Scenario-Based", "Budgeting", "Decision-Making"],
    tags: ["Budgeting", "Spending", "Needs and Wants"],

    previewUrl: "sample-module.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-BUDGETING-MODULE-LINK.com",

    price: "$9",
    priceLabel: "module",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: true,

    featured: false,

    order: {
      "personal-finance": 2,
      "business-basics": 5,
      "all": 2
    },

    sections: [
      "What a budget is",
      "Income and expenses",
      "Needs vs wants",
      "Spending trade-offs",
      "Savings goals",
      "Real-life budget scenario",
      "Required reflection and certificate"
    ]
  },

  {
    id: "pfm-index-funds-investing",
    title: "Index Funds & Investing",
    categories: ["personal-finance", "business-basics"],
    courseLabels: ["Personal Finance", "Business Basics"],
    topic: "Investing",
    productType: "Interactive Module",

    description:
      "Students compare saving, investing, risk, diversification, index funds, compound growth, and long-term decisions.",

    questionCount: 10,
    types: ["Calculator", "Scenario-Based", "Investing"],
    tags: ["Investing", "Index Funds", "Compound Growth"],

    previewUrl: "sample-module.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-INDEX-FUNDS-MODULE-LINK.com",

    price: "$12",
    priceLabel: "module",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: true,

    featured: false,

    order: {
      "personal-finance": 3,
      "business-basics": 8,
      "all": 3
    },

    sections: [
      "Saving vs investing",
      "Risk and reward",
      "What index funds are",
      "Diversification",
      "Compound growth",
      "Long-term investing scenario",
      "Required reflection and certificate"
    ]
  },

  {
    id: "pfm-taxes-filing-basics",
    title: "Taxes & Filing Basics",
    categories: ["personal-finance", "business-basics"],
    courseLabels: ["Personal Finance", "Business Basics"],
    topic: "Taxes",
    productType: "Interactive Module",

    description:
      "Students learn income taxes, payroll deductions, filing basics, refunds, and real-world tax vocabulary.",

    questionCount: 10,
    types: ["Scenario-Based", "Vocabulary Practice", "Calculator"],
    tags: ["Taxes", "Paychecks", "Filing"],

    previewUrl: "sample-module.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-TAXES-MODULE-LINK.com",

    price: "$12",
    priceLabel: "module",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: true,

    featured: false,

    order: {
      "personal-finance": 4,
      "business-basics": 9,
      "all": 4
    },

    sections: [
      "Why taxes exist",
      "Gross pay vs net pay",
      "Payroll deductions",
      "Federal, state, and local taxes",
      "Filing basics",
      "Refunds and withholding",
      "Required reflection and certificate"
    ]
  },

  {
    id: "business-build-your-own-company",
    title: "Build Your Own Company",
    categories: ["business-basics", "marketing", "projects"],
    courseLabels: ["Business Basics", "Marketing", "Projects"],
    topic: "Entrepreneurship",
    productType: "Project-Based Module",

    description:
      "Students create a company, product or service, brand identity, slogan, billboard concept, and early business pitch.",

    questionCount: 12,
    types: ["Project-Based", "Branding", "Short Response"],
    tags: ["Entrepreneurship", "Branding", "Business Creation"],

    previewUrl: "business-101.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-COMPANY-PROJECT-LINK.com",

    price: "$15",
    priceLabel: "project",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: false,

    featured: false,

    order: {
      "business-basics": 1,
      "marketing": 6,
      "projects": 1,
      "all": 5
    },

    sections: [
      "Choose a business idea",
      "Define the customer",
      "Create the product or service",
      "Build a brand identity",
      "Create slogan and visual direction",
      "Prepare a pitch concept",
      "Required reflection and certificate"
    ]
  },

  {
    id: "marketing-attention-economy",
    title: "Attention Economy",
    categories: ["marketing", "business-basics", "current-events"],
    courseLabels: ["Marketing", "Business Basics", "Current Events"],
    topic: "Marketing",
    productType: "Interactive Module",

    description:
      "Students analyze how brands, platforms, creators, sports, entertainment, and advertisers compete for attention.",

    questionCount: 9,
    types: ["Current Examples", "Scenario-Based", "Marketing Analysis"],
    tags: ["Marketing", "Advertising", "Consumer Behavior"],

    previewUrl: "marketing.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-ATTENTION-ECONOMY-LINK.com",

    price: "$9",
    priceLabel: "module",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: true,

    featured: false,

    order: {
      "marketing": 1,
      "business-basics": 6,
      "current-events": 5,
      "all": 6
    },

    sections: [
      "What attention means in marketing",
      "Platforms and algorithms",
      "Creators and influencers",
      "Sports and entertainment attention",
      "Brand competition",
      "Campaign decision scenario",
      "Required reflection and certificate"
    ]
  },

  {
    id: "current-events-why-prices-change",
    title: "Why Do Prices Change?",
    categories: ["current-events", "personal-finance", "business-basics"],
    courseLabels: ["Current Events", "Personal Finance", "Business Basics"],
    topic: "Economics",
    productType: "Current Events Module",

    description:
      "Students learn how supply, demand, shortages, inflation, conflict, and consumer behavior can affect prices.",

    questionCount: 8,
    types: ["Current Events", "Scenario-Based", "Economics"],
    tags: ["Prices", "Inflation", "Supply and Demand"],

    previewUrl: "sample-module.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-PRICES-MODULE-LINK.com",

    price: "$9",
    priceLabel: "module",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: true,

    featured: false,

    order: {
      "current-events": 1,
      "personal-finance": 7,
      "business-basics": 2,
      "all": 7
    },

    sections: [
      "Why prices move",
      "Supply and demand",
      "Shortages and scarcity",
      "Inflation in everyday life",
      "Global events and prices",
      "Student decision scenario",
      "Required reflection and certificate"
    ]
  },

  {
    id: "current-events-hezbollah-explained",
    title: "Who Is Hezbollah?",
    categories: ["current-events"],
    courseLabels: ["Current Events"],
    topic: "World Issues",
    productType: "Current Events Module",

    description:
      "A classroom-ready explainer that helps students understand the group, region, background, and why it appears in the news.",

    questionCount: 8,
    types: ["World Issues", "Current Events", "Reading Check"],
    tags: ["Current Events", "World Issues", "Middle East"],

    previewUrl: "sample-module.html",
    launchUrl: "teacher-dashboard.html",
    shopifyUrl: "https://YOUR-SHOPIFY-HEZBOLLAH-MODULE-LINK.com",

    price: "$9",
    priceLabel: "module",

    reflectionRequired: true,
    certificateIncluded: true,
    completionTracking: true,
    autoScored: true,

    featured: false,

    order: {
      "current-events": 2,
      "all": 8
    },

    sections: [
      "Where Hezbollah is based",
      "Basic background and origins",
      "Why the group is controversial",
      "Regional conflict context",
      "How to read news carefully",
      "Current event scenario",
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
