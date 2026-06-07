/*
============================================================
VIVID LESSONS MODULE CARD RENDERER
============================================================

Reads assets/modules-data.js and displays module cards.

Preview button goes to limited public preview.
Launch button goes to teacher dashboard / full access path.
*/

function moduleTypePills(module){
  const pills = [];

  if(module.questionCount){
    pills.push(`${module.questionCount} Questions`);
  }

  if(module.previewQuestionCount){
    pills.push(`${module.previewQuestionCount} Preview`);
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
    category === "homepage" && module.homepageLabel
      ? module.homepageLabel
      : module.courseLabels && module.courseLabels.length
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
      <div class="item-subtitle">${subtitle}</div>

      <p>${module.description}</p>

      <div class="meta">
        ${pills}
      </div>

      <div class="price-row">
        <div class="price">${module.price || "$9"}<span><small> ${module.priceLabel || "module"}</small></span></div>
        <small>${module.autoScored ? "Auto-scored" : "Teacher reviewed"}</small>
      </div>

      <div class="item-actions">
        <a class="btn btn-primary btn-small" href="${module.previewUrl}">Preview</a>
        <button class="btn btn-secondary btn-small" onclick="toggleItemDescription('${descId}')">Description</button>
        <a class="btn btn-shopify btn-small" href="${module.shopifyUrl}" target="_blank">Buy on Shopify</a>
        <a class="btn btn-secondary btn-small" href="${module.launchUrl}">Launch</a>
      </div>

      <div class="description-panel" id="${descId}">
        <strong>Inside the full module:</strong>
        <ul>${sections}</ul>
        <p style="margin-top:12px;color:#64748B;font-weight:700;font-size:.88rem;">
          Preview includes ${module.previewQuestionCount || 2} sample questions.
          Full access includes all ${module.questionCount || "module"} questions, reflection, certificate, and teacher launch tools.
        </p>
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

  const section = target.closest("section");
  const showEmpty = target.dataset.showEmpty === "true";

  if(typeof VIVID_MODULES === "undefined"){
    if(section && !showEmpty){
      section.style.display = "none";
      return;
    }

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
    if(section && !showEmpty){
      section.style.display = "none";
      return;
    }

    target.innerHTML = `
      <article class="card empty-message">
        <span class="pill">No Items</span>
        <h3>No modules added yet</h3>
        <p>Real modules added to assets/modules-data.js will appear here automatically.</p>
      </article>
    `;
    return;
  }

  if(section){
    section.style.display = "";
  }

  target.innerHTML = modules
    .map(module => renderModuleCard(module, category))
    .join("");
}

function toggleItemDescription(id){
  const panel = document.getElementById(id);
  if(panel){
    panel.classList.toggle("show");
  }
}
