/*
============================================================
VIVID LESSONS RESOURCE LIBRARY
============================================================

This is the master catalog for real slides, infographics, posters,
teacher resources, visual aids, and other classroom materials.

Add each real resource here one time.

Use categories to control where it appears.

Category options:
- personal-finance
- ap-business
- business-basics
- marketing
- current-events
- projects
- slides
- infographics
- resources
- free

Use displayType to control the subtitle under the resource title.

Examples:
displayType: "Slide Deck"
displayType: "Infographic"
displayType: "Poster"
displayType: "Teacher Resource"
displayType: "Classroom Visual"

Do not add placeholder resources here.
Only add real resources that exist or are ready to sell/preview.
*/

const VIVID_RESOURCES = [
  /*
  Example format for later:

  {
    id: "pfm-credit-score-slides",
    title: "Credit Scores 101 Slides",
    displayType: "Slide Deck",

    categories: ["personal-finance", "business-basics", "slides", "resources"],
    courseLabels: ["Personal Finance", "Business Basics"],

    topic: "Credit",

    description:
      "A clean teacher-ready slide deck introducing credit scores, credit factors, and smart credit habits.",

    slideCount: 18,
    types: ["Slides", "Teacher-Led", "Editable"],
    tags: ["Credit", "Credit Scores", "Slides"],

    previewUrl: "resources/pfm-credit-score-slides-preview.pdf",
    downloadUrl: "resources/pfm-credit-score-slides.pptx",
    shopifyUrl: "https://YOUR-SHOPIFY-CREDIT-SLIDES-LINK.com",

    price: "$6",
    priceLabel: "slides",

    editable: true,
    printable: false,

    featured: false,

    order: {
      "personal-finance": 1,
      "business-basics": 7,
      "slides": 1,
      "resources": 1,
      "all": 1
    },

    sections: [
      "Credit score overview",
      "Credit factor explanations",
      "Student discussion prompts",
      "Teacher-led examples"
    ]
  }
  */
];

function getResourcesByCategory(category){
  return VIVID_RESOURCES
    .filter(item => category === "all" || item.categories.includes(category))
    .sort((a,b) => {
      const aOrder = a.order?.[category] ?? a.order?.all ?? 999;
      const bOrder = b.order?.[category] ?? b.order?.all ?? 999;
      return aOrder - bOrder;
    });
}

function getResourceById(id){
  return VIVID_RESOURCES.find(item => item.id === id);
}
