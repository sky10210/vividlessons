/*
============================================================
VIVID LESSONS MODULE CARD RENDERER
============================================================

This file reads assets/modules-data.js and displays module cards
on course pages.

Usage on a course page:

<script src="assets/modules-data.js"></script>
<script src="assets/module-renderer.js"></script>
<script>
  renderModuleLibrary("personal-finance", "moduleLibrary");
</script>

Category options:
- all
- personal-finance
- ap-business
- business-basics
- marketing
- current-events
- projects
- worksheets
- free
*/

function moduleTypePills(module){
  const pills = [];

  if(module.questionCount){
    pills.push(`${module.questionCount} Questions`);
  }

  if(module.types && module.types.length){
    module.types.slice(0,3).forEach(type => pills.push(type));
  }

  if(module.reflectionRequired){
    pills.push("Reflection");
  }

  if(module.certificateIncluded){
    pills.push("Certificate");
  }

  return pills;
}

function safeId(text){
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/(^-|-$)/g,"");
}

function renderModuleCard(module, category){
  const descId = `desc-${safeId(module.id)}-${safeId(category)}`;

  const label =
    module.courseLabels && module.courseLabels.length
      ? module.courseLabels[0]
      : module.productType || "Module";

  const subtitle = module.displayType || "Interactive Lesson";

  const pills = moduleTypePills(module)
    .map(pill => `<span class="pill">${pill}</span>`)
    .join("");

  const sections = module.sections && module.sections.length
    ? module.sections.map(section => `<li>${section}</li>`).join("")
    : `<li>Guided student lesson</li><li>Reflection and certificate</li>`;

  const searchText = [
    module.title,
    module.displayType,
    module.topic,
    module.productType,
    module.description,
    module.categories ? module.categories.join(" ") : "",
    module.courseLabels ? module.courseLabels.join(" ") : "",
    module.tags ? module.tags.join(" ") : "",
    module.types ? module.types.join(" ") : ""
  ].join(" ");

  return `
    <article class="card product-card module-card ${module.featured ? "featured" : ""}" data-title="${searchText}">
      <span class="pill">${label}</span>

      <h3>${module.title}</h3>
      <div class="module-subtitle">${subtitle}</div>

      <p>${module.description}</p>

      <div class="meta">
        ${pills}
      </div>

      <div class="price-row">
        <div class="price">${module.price || "$9"}<span><small> ${module.priceLabel || "module"}</small></span></div>
        <small>${module.autoScored ? "Auto-scored" : "Teacher reviewed"}</small>
      </div>

      <div class="module-actions">
        <a class="btn btn-primary btn-small" href="${module.previewUrl}">Preview</a>
        <button class="btn btn-secondary btn-small" onclick="toggleModuleDescription('${descId}')">Description</button>
        <a class="btn btn-shopify btn-small" href="${module.shopifyUrl}" target="_blank">Buy on Shopify</a>
        <a class="btn btn-secondary btn-small" href="${module.launchUrl}">Launch</a>
      </div>

      <div class="description-panel" id="${descId}">
        <strong>Inside this module:</strong>
        <ul>${sections}</ul>
      </div>
    </article>
  `;
}

function renderModuleLibrary(category, targetId){
  const target = document.getElementById(targetId);

  if(!target){
    console.warn("Vivid Lessons renderer: target not found:", targetId);
    return;
  }

  if(typeof VIVID_MODULES === "undefined"){
    target.innerHTML = `
      <article class="card empty-message">
        <span class="pill">Setup Needed</span>
        <h3>Module library not loaded</h3>
        <p>Check that assets/modules-data.js is linked before module-renderer.js.</p>
      </article>
    `;
    return;
  }

  const modules = getModulesByCategory(category);

  if(!modules.length){
    target.innerHTML = `
      <article class="card empty-message">
        <span class="pill">Coming Soon</span>
        <h3>No modules added yet</h3>
        <p>Real modules added to assets/modules-data.js will appear here automatically.</p>
      </article>
    `;
    return;
  }

  target.innerHTML = modules
    .map(module => renderModuleCard(module, category))
    .join("");
}

function toggleModuleDescription(id){
  const panel = document.getElementById(id);
  if(panel){
    panel.classList.toggle("show");
  }
}
