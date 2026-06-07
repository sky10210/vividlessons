/*
============================================================
VIVID LESSONS WORKSHEET LIBRARY
============================================================

This is the master catalog for real worksheets, PDFs, printables,
guided organizers, student handouts, and answer-key resources.

Add each real worksheet here one time.

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

Use displayType to control the subtitle under the worksheet title.

Examples:
displayType: "Printable Worksheet"
displayType: "Guided Organizer"
displayType: "Vocabulary Practice"
displayType: "Project Handout"
displayType: "Answer Key Included"

Do not add placeholder worksheets here.
Only add real worksheet products that exist or are ready to sell/preview.
*/

const VIVID_WORKSHEETS = [
  /*
  Example format for later:

  {
    id: "pfm-credit-score-worksheet",
    title: "Credit Score Worksheet",
    displayType: "Printable Worksheet",

    categories: ["personal-finance", "business-basics", "worksheets"],
    courseLabels: ["Personal Finance", "Business Basics"],

    topic: "Credit",

    description:
      "A guided worksheet for reviewing credit score factors and smart borrowing habits.",

    pageCount: 2,
    types: ["PDF", "Printable", "Answer Key"],
    tags: ["Credit", "Credit Scores", "Borrowing"],

    previewUrl: "worksheets/pfm-credit-score-worksheet-preview.pdf",
    downloadUrl: "worksheets/pfm-credit-score-worksheet.pdf",
    shopifyUrl: "https://YOUR-SHOPIFY-CREDIT-WORKSHEET-LINK.com",

    price: "$3",
    priceLabel: "worksheet",

    answerKeyIncluded: true,
    printable: true,
    digitalReady: true,

    featured: false,

    order: {
      "personal-finance": 1,
      "business-basics": 6,
      "worksheets": 1,
      "all": 1
    },

    sections: [
      "Credit score factor review",
      "Smart borrowing examples",
      "Student response prompts",
      "Answer key"
    ]
  }
  */
];

function getWorksheetsByCategory(category){
  return VIVID_WORKSHEETS
    .filter(item => category === "all" || item.categories.includes(category))
    .sort((a,b) => {
      const aOrder = a.order?.[category] ?? a.order?.all ?? 999;
      const bOrder = b.order?.[category] ?? b.order?.all ?? 999;
      return aOrder - bOrder;
    });
}

function getWorksheetById(id){
  return VIVID_WORKSHEETS.find(item => item.id === id);
}
